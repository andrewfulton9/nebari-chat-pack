/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import Keycloak from 'keycloak-js';


// Whether auth is enabled for the application.
const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED === 'true';


// The singleton `Keycloak` instance for handling authentication.
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
});


// Save a reference to the native fetch before it can be overridden.
//
// This does two things:
//   1) It prevents a monkey-patched fetch from intercepting the
//      the auth token, unless it's patched before this module loads.
//   2) It allows us to define our own `fetch` without name-clashing.
const nativeFetch = window.fetch;


/**
 * A fetch wrapper that adds the bearer token to the request headers.
 *
 * This function prevents the exposure of the auth token. It also handles
 * the `!response.ok` condition in a single location.
 */
export
async function fetch(url: string, init: RequestInit = {}): Promise<Response> {
  // Create the extra headers if needed.
  const headers = (
    AUTH_ENABLED ? { 'Authorization': `Bearer ${keycloak.token ?? ''}` } : { }
  ) as HeadersInit;

  // Clone the init object and headers to prevent snooping by the caller.
  const options = { ...init, headers: { ...init.headers, ...headers } };

  // Fetch the resource.
  const resp = await nativeFetch(url, options);

  // Guard against request failure.
  if (!resp.ok) {
    throw new Error(`Fetch failure: ${resp.status} ${resp.statusText}`);
  }

  // Return the response.
  return resp;
}


/**
 * A function which handles the user login via Keycloak.
 *
 * If authentication is not enabled, or if the user is already logged-in,
 * this function is a no-op.
 *
 * @param redirectUri - The redirect target if login is required.
 */
export
async function login(redirectUri: string): Promise<void> {
  // Bail early if authentication is not enabled.
  if (!AUTH_ENABLED) {
    return;
  }

  // Bail early if the user is already logged in.
  if (keycloak.authenticated) {
    return;
  }

  // Initialize the keycloak instance if needed.
  if (!keycloak.didInitialize) {
    await keycloak.init();
  }

  // Log in the user.
  await keycloak.login({ redirectUri });
}


/**
 * A function which handles user logout via Keycloack.
 *
 * If authentication is not enabled, or if the user is already logged-out,
 * this function is a no-op.
 *
 * @param redirectUri - The redirect target if logout is required.
 */
export
async function logout(redirectUri: string): Promise<void> {
  // Bail early if authentication is not enabled.
  if (!AUTH_ENABLED) {
    return;
  }

  // Bail early if the user is not logged-in.
  if (!keycloak.authenticated) {
    return;
  }

  // Log out the user.
  await keycloak.logout({ redirectUri });
}


/**
 * Get the auth record for the logged in user, or `null`.
 */
export
function getUser(): null {
  return null;
};
