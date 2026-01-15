/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createContext, useContext
} from 'react';

import * as api from '@/api'


/**
 * A type alias for the auth configuration.
 */
export
type AuthConfig = {
  /**
   * The user auth record, or `null` if the user is not logged in.
   */
  readonly user: api.AuthRecord;
};


/**
 * The auth config provider.
 */
export
const AuthConfigProvider = createContext<AuthConfig | undefined>(undefined);


/**
 * A hook which returns the chat config.
 */
export
function useAuthConfig(): AuthConfig {
  const config = useContext(AuthConfigProvider);
  if (config === undefined) {
    throw new Error('missing `AuthConfigProvider`');
  }
  return config;
}
