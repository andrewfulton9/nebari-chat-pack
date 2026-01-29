/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  pb
} from './pb'

export
async function updateKnowledgeItem(options: updateKnowledgeItem.Options): Promise<void> {
  const {knowledge_id, body} = options;
  
  // Create a URLSearchParam variable to be passed into the body
  const params = new URLSearchParams();
  params.set("name", body.name);
  params.set("description", body.description);
  params.set("reader_id", body.reader_id);
  params.set(
    "metadata",
    typeof body.metadata === "string" ? body.metadata : JSON.stringify(body.metadata)
  );

  // Create the request.
  const resp = await fetch(`/api/knowledge/content/${knowledge_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${pb.authStore.token}`
    },
    body: params.toString(),
  });

  // Guard against request failure.
  if (!resp.ok) {
    throw new Error(`Response: ${resp.status} ${resp.statusText}`);
  }
}

export
namespace updateKnowledgeItem {
  // typedef for the body of the request
  type UpdateKnowledgeContentBody = {
    name: string;
    description: string;
    metadata: unknown;
    reader_id: string;
  };

  // Options for the update knowledge request
  export
  type Options = {
      readonly knowledge_id: string;
      readonly body: UpdateKnowledgeContentBody;
  }
}
