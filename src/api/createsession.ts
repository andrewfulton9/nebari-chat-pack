/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import * as v from 'valibot';


/**
 * The schema for the `createSession` response.
 */
const createSessionResponseSchema = v.object({
  session_id: v.string()
});


/**
 * A type alias for a `createSession` response.
 */
export
type CreateSessionResponse = v.InferOutput<typeof createSessionResponseSchema>;


/**
 * Create a new session on the server.
 *
 * @returns A promise that resolves with the new session data.
 */
export
async function createSession(): Promise<CreateSessionResponse> {
  // Fetch the resource.
  const resp = await fetch('/sessions', { method: 'POST' });

  // Convert the response to json.
  const json = await resp.json();

  // Parse and return the response.
  return v.parse(createSessionResponseSchema, json);
}
