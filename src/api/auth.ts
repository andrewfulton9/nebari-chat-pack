/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import * as v from 'valibot';

/**
 * Logged in user schema
 */
export
const UserSchema = v.object({
  user_id: v.string(),
  username: v.string(),
  email: v.optional(v.string()),
})

/**
 * Type definition for the user
 */
export
type User = v.InferOutput<typeof UserSchema>;

/**
 * User login function
 * 
 * @param options {username and password}
 * 
 * Void function. sets auth cookies with successful respose
 */
export
async function login(options: login.Options) {

  //Extract the options
  const {username, password} = options;

  // make a call to the login api
  const resp = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ username, password }),
  })

  if(!resp.ok) {
    throw new Error('Authentication failed')
  }
}

/**
 * namespace for the login
 */
export namespace login {

  export
  type Options = {
    /**
     * username for login
     */
    readonly username: string;

    /**
     * password for login
     */
    readonly password: string
  }
}

/**
 * Validate cookie session
 * 
 * @returns user data
 */
export async function validate(): Promise<User> {
  const resp = await fetch('/api/auth/validate', {
    credentials: 'include',
  })

  if (!resp.ok) {
    throw new Error('Not authenticated')
  }

  const json = await resp.json()

  return v.parse(UserSchema, json)
}
