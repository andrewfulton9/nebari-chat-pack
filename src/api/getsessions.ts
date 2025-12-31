/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import * as v from 'valibot';


/**
 * A schema for Agno sessions metadata.
 */
export
const sessionsMetaSchema = v.object({
  page: v.number(),
  limit: v.number(),
  total_pages: v.number(),
  total_count: v.number(),
  search_time_ms: v.number()
});


/**
 * A type alias for Agno sessions metadata.
 */
export
type SessionsMeta = v.InferOutput<typeof sessionsMetaSchema>;


/**
 * A schema for an Agno session.
 */
export
const sessionSchema = v.object({
  session_id: v.string(),
  session_name: v.string(),
  created_at: v.string(),
  updated_at: v.string(),
  session_state: v.optional(v.object({}))
});


/**
 * A type alias for an Agno session.
 */
export
type Session = v.InferOutput<typeof sessionSchema>;


/**
 * A schema for Agno sessions.
 */
export
const sessionsSchema = v.object({
  data: v.array(sessionSchema),
  meta: sessionsMetaSchema
});


/**
 * A type alias for Agno sessions.
 */
export
type Sessions = v.InferOutput<typeof sessionsSchema>;


/**
 * A function which fetches the agno sessions.
 *
 * @returns A promise that resolves with the sessions request.
 */
export
async function getSessions(options: getSessions.Options): Promise<Sessions> {
  // Extract the options.
  const { type } = options;

  // Fetch the resource.
  const resp = await fetch(`/api/sessions?type=${type}`);

  // Guard against fetch failure.
  if (!resp.ok) {
    throw new Error(`Response: ${resp.status} ${resp.statusText}`);
  }

  // Convert the response to JSON.
  const json = await resp.json();

  // Return the parsed result.
  return v.parse(sessionsSchema, json);
}


/**
 * The namespace for the `getSessions` statics.
 */
export
namespace getSessions {
  /**
   * A type alias for the options to `getSessions`.
   *
   * TODO support more options available in the api.
   */
  export
  type Options = {
    /**
     * The type of sessions to query.
     */
    readonly type: 'agent' | 'team' | 'workflow';
  };
}
