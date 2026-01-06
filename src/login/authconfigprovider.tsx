import {
  createContext,
  useContext,
  useState,
  useEffect 
} from 'react'

import * as api from '@/api'

export
type User = {
  user_id: string;
  username: string;
  email?: string;
}

export
type UserLoginOptions = {
  /**
   * username for the login
   */
  readonly username: string;
  /**
   * password for the login
   */
  readonly password: string;
}

export
type AuthConfig = {
  /**
   * User Login status
   */
  readonly isAuthenticated: boolean;

  /**
   * Logged in User
   */
  readonly user: User | null;

  /**
   * A callback for the login
   */
  readonly login: (options: UserLoginOptions) => Promise<void>;

  /**
   * A callback for the login
   */
  readonly logout: () => void;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isAuthenticated = user !== null

  // validate auth state on app load
  useEffect(() => {
    validate()
      .catch(() => {
        cookieStore.delete('access_token')
        setIsLoading(false);
      })
  }, [])

  const validate = async () => {
    const user = await api.validate()

    if(user) {
      setUser(user);
      setIsLoading(false);
    }
  }

  const login = async (options: UserLoginOptions) => {
    await api.login(options);

    await validate();
  }

  const logout = () => {
    setUser(null)
    cookieStore.delete('access_token')
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export
const AuthContext = createContext<AuthConfig | undefined>(undefined)

// return auth context
export function useAuth(): AuthConfig {
  const config = useContext(AuthContext)
  if (config === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return config
}

