/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  pb
} from './pb'

/**
 * Delete Knowledge item from the server.
 *
 * @param id - The knowledge id string to delete.
 *
 * @returns A promise that resolves at the completion of the delete.
 */
export
async function deleteKnowledgeItem(knowledge_id: string): Promise<void> {
  // Create the request.
  const resp = await fetch(`/api/knowledge/content/${knowledge_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${pb.authStore.token}`
    },
  });

  // Guard against request failure.
  if (!resp.ok) {
    throw new Error(`Response: ${resp.status} ${resp.statusText}`);
  }
}

/**
 * Delete multiple Knowledge items from the server.
 *
 * @param knowledge_ids - A list of knowledge id strings to delete.
 *
 * @returns A promise that resolves at the completion of the delete.
 */
export
async function deleteKnowledgeItems(options: deleteKnowledgeItems.Options): Promise<void> {
  const {knowledge_ids} = options;

  for (const id of knowledge_ids) {
    try {
      await deleteKnowledgeItem(id);
    } catch (error) {
      console.error(`Delete knowledge failed for ${id}`);
    }
  }
}

/**
 * The namespace for the `deleteKnowledgeItems` statics.
 */
export
namespace deleteKnowledgeItems {
  /**
   * The options for the `deleteKnowledgeItems` function.
   */
  export
  type Options = {
    /**
     * The ids of the knowledge items to delete.
     */
    readonly knowledge_ids: readonly string[];
  };
}
