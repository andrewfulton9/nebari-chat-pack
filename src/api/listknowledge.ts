/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import * as v from 'valibot';

import {
  pb
} from './pb'

/**
 * A schema for Agno knowledge metadata.
 */
export
const knowledgeListMetaSchema = v.object({
  page: v.number(),
  limit: v.number(),
  total_pages: v.number(),
  total_count: v.number(),
  search_time_ms: v.number(),
});


/**
 * A type alias for Agno knowledge list metadata.
 */
export
type knowledgeListMeta = v.InferOutput<typeof knowledgeListMetaSchema>;


/**
 * A schema for an Agno knowledge item.
 */
export
const knowledgeListItemSchema = v.object({
  id: v.string(),
  name: v.string(),
  type: v.string(),
  metadata: v.optional(v.nullable(v.record(v.string(), v.string()))),
  status: v.string(),
  status_message: v.string(),
  updated_at: v.string()
});

/**
 * A type alias for an Agno knowledge list item.
 */
export
type KnowledgeListItem = v.InferOutput<typeof knowledgeListItemSchema>;


/**
 * A schema for Agno knowledge.
 */
export
const knowledgeSchema = v.object({
  data: v.array(knowledgeListItemSchema),
  meta: knowledgeListMetaSchema,
});

/**
 * A type alias for an Agno knowledge list.
 */
export
type KnowledgeList = v.InferOutput<typeof knowledgeSchema>

/**
 * A function that fetches the knowledge data.
 * 
 * @returns A promise that resolves with the knowledge request
 */
export
async function listKnowledge(): Promise<KnowledgeList> {
  // Fetch the resource.
  const resp = await fetch('/api/knowledge/content?sort_by=updated_at', {
    headers: { 'Authorization': `Bearer ${pb.authStore.token}` }
  });

  // Guard against fetch failure.
  if (!resp.ok) {
    throw new Error(`Response: ${resp.status} ${resp.statusText}`);
  }

  // Convert the response to JSON.
  const json = await resp.json();

  return v.parse(knowledgeSchema, json);
}
