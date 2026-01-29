/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import * as v from 'valibot';

import {
  pb
} from './pb'


/**
 * A schema for a knowledge item details.
 */
export
const knowledgeDetailSchema = v.object({
  id: v.string(),
  name: v.string(),
  description: v.string(),
  type: v.string(),
  size: v.string(),
  metadata: v.optional(v.nullable(v.record(v.string(), v.string()))),
  access_count: v.optional(v.nullable(v.number())),
  status: v.string(),
  status_message: v.string(),
  created_at: v.string(),
  updated_at: v.string()
});


/**
 * A knowledge item schema.
 */
export
type KnowledgeDetail = v.InferOutput<typeof knowledgeDetailSchema>;


/**
 * A function which fetches the agno knowledge detail.
 *
 * @param options - The options for the request.
 *
 * @returns A promise that resolves with the knowledge request.
 */
export
async function getKnowledge(options: getKnowledge.Options): Promise<KnowledgeDetail> {
  // Extract the options.
  const { knowledgeId } = options;

  // Fetch the resource.
  const resp = await fetch(`/api/knowledge/content/${knowledgeId}`, {
    headers: { 'Authorization': `Bearer ${pb.authStore.token}` }
  });

  // Guard against fetch failure.
  if (!resp.ok) {
    throw new Error(`Response: ${resp.status} ${resp.statusText}`);
  }

  // Convert the response to JSON.
  const json = await resp.json();

  // Return the parsed result.
  return v.parse(knowledgeDetailSchema, json);
}


/**
 * The namespace for the `getKnowledge` statics.
 */
export
namespace getKnowledge {
  /**
   * A type alias for the `getKnowledge` options.
   */
  export
  type Options = {

    /**
     * The id of the knowledge to retrieve.
     */
    readonly knowledgeId: string;
  };
}
