/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/


/**
 * Delete sessions from the server.
 *
 * @param ids - The array of session ids to delete.
 *
 * @returns A promise that resolves at the completion of the delete.
 */
export
async function deleteSessions(ids: readonly string[]): Promise<void> {
  // Create the request.
  const resp = await fetch('/api/sessions', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_ids: ids })
  });

  // Guard against request failure.
  if (!resp.ok) {
    throw new Error(`Response: ${resp.status} ${resp.statusText}`);
  }
}
