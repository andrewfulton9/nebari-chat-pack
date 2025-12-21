/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import * as v from 'valibot';


/**
 * A schema for Agno memories.
 */
export
const memoryItemSchema = v.object({
  memory_id: v.string(),
  memory: v.string(),
  topics: v.array(v.string()),
  agent_id: v.nullable(v.string()),
  team_id: v.nullable(v.string()),
  user_id: v.string(),
  updated_at: v.string(),
});


/**
 *
 */
export
type MemoryItem = v.InferOutput<typeof memoryItemSchema>;


/**
 *
 */
export
const memoriesMetaSchema = v.object({
  page: v.number(),
  limit: v.number(),
  total_pages: v.number(),
  total_count: v.number(),
  search_time_ms: v.number(),
});


/**
 *
 */
export
type MemoriesMeta = v.InferOutput<typeof memoriesMetaSchema>;


/**
 *
 */
export
const memoriesSchema = v.object({
  data: v.array(memoryItemSchema),
  meta: memoriesMetaSchema,
});


/**
 * A type alias for Agno metrics.
 */
export
type Memories = v.InferOutput<typeof memoriesSchema>;


/**
 *
 */
export
async function getMemories(): Promise<Memories> {
  const url = '/agno_memory';

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Response: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  return v.parse(memoriesSchema, json);
}
