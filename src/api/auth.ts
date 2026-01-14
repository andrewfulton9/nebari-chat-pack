/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  RecordAuthResponse, RecordModel
} from 'pocketbase';

import {
  pb
} from './pb'


/**
 * A function which handles the user login via UN/PW.
 * 
 * @param options - The options for logging in the user.
 * 
 */
export
async function login(
  options: login.Options
): Promise<RecordAuthResponse<RecordModel>> {
  // Extract the options
  const { email, password } = options;

  // Auth with password using Pocketbase
  return await pb.collection('users').authWithPassword(email, password);
}


/**
 * The namespace for the `login` statics.
 */
export
namespace login {
  /**
   * A type alias for the `login` options.
   */
  export
  type Options = {
    /**
     * The username for the login.
     */
    readonly email: string;

    /**
     * The password for login.
     */
    readonly password: string
  };
}
