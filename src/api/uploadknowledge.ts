/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  pb
} from './pb'

/**
 * Handles the upload of a knowledge datapoint
 * 
 * handles file uploads, urls to files and manual text input
 */
export
async function uploadKnowledgeItem(options: uploadKnowledgeItem.Options): Promise<void> {
  const form = new FormData();

  // Helper: only include fields if they are not null/undefined
  const setIfPresent = (key: string, val: unknown) => {
    if (val === undefined || val === null) return;
    form.set(key, String(val));
  };

  setIfPresent("name", options.name);
  setIfPresent("description", options.description);

  if (options.url !== undefined && options.url !== null) {
    // If array, send as JSON string (common pattern)
    form.set("url", Array.isArray(options.url) ? JSON.stringify(options.url) : options.url);
  }

  if (options.metadata !== undefined && options.metadata !== null) {
    // Ensure metadata is a JSON string
    form.set(
      "metadata",
      typeof options.metadata === "string" ? options.metadata : JSON.stringify(options.metadata)
    );
  }

  if (options.file !== undefined && options.file !== null) {
    // If it's a File, keep its name. If Blob, give a default filename.
    const filename =
      options.file instanceof File ? options.file.name : "upload.bin";
    form.append("file", options.file, filename);
  }

  setIfPresent("text_content", options.text_content);
  setIfPresent("reader_id", options.reader_id);
  setIfPresent("chunker", options.chunker);
  setIfPresent("chunk_size", options.chunk_size);
  setIfPresent("chunk_overlap", options.chunk_overlap);

  // Create the request.
  const resp = await fetch('/api/knowledge/content', {
    method: "POST",
    headers: { 'Authorization': `Bearer ${pb.authStore.token}` },
    body: form,
  });

  // Guard against request failure.
  if (!resp.ok) {
    throw new Error(`Response: ${resp.status} ${resp.statusText}`);
  }
}

export
namespace uploadKnowledgeItem {

  export
  type Options = {
    // All optional
    name?: string | null;
    description?: string | null;
    url?: string | string[] | null;
    metadata?: string | Record<string, unknown> | null;
    file?: File | Blob | null;
    text_content?: string | null;
    reader_id?: string | null;
    chunker?: string | null;
    chunk_size?: number | null;
    chunk_overlap?: number | null;
  };
}
