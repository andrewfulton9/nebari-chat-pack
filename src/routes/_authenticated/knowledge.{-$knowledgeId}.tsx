/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createFileRoute, useRouter
} from '@tanstack/react-router';

import type {
  QueryClient
} from '@tanstack/react-query';

import * as api from '@/api';

import type {
  KnowledgeConfig
} from '@/knowledge';

import {
  Knowledge, KnowledgeConfigProvider
} from '@/knowledge';

/**
 * A query function which fetches the sessions list from the API.
 */
async function listKnowledge(
  client: QueryClient,
): Promise<api.KnowledgeList> {
  // Create the sessions query.
  const sesssionsQuery = {
    queryKey: ['knowledge'],
    queryFn: () => api.listKnowledge()
  } as const;

  // Fetch the query.
  return await client.fetchQuery(sesssionsQuery);
}

async function getKnowledge(
  client: QueryClient,
  knowledgeId: string
): Promise<api.KnowledgeDetail> {
  // Create the session query.
  const knowledgeQuery = {
    queryKey: ['knowledge', knowledgeId],
    queryFn: () => api.getKnowledge({ knowledgeId })
  } as const;

  // Fetch the query.
  return await client.fetchQuery(knowledgeQuery);
}

/**
 * The route for the `/knowledge` endpoint.
 */
export
const Route = createFileRoute('/_authenticated/knowledge/{-$knowledgeId}')({
  component: RouteComponent,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params }) => {
      // Extract the query client from the context.
      const { client } = context;
  
      // Unpack the params.
      const { knowledgeId } = params;
  
      // Fetch the sessions list.
      const knowledge = await listKnowledge(client);
  
      // Fetch the session detail, if needed.
      const detail = (
        knowledgeId !== undefined ?
        await getKnowledge(client, knowledgeId) :
        null
      );
  
      // Return the loader data.
      return { knowledge, detail };
    }
});


/**
 * The component that renders the `/knowledge` route.
 */
function RouteComponent() {
  // Fetch the router for the current endpoint.
  const router = useRouter();
  
  // Fetch the loader data.
  const { knowledge, detail} = Route.useLoaderData();

  const uploadKnowledgeItem = async(options: api.uploadKnowledgeItem.Options) => {
    // Upload a knowledge datapoint
    await api.uploadKnowledgeItem(options);

    // Force the router to reload the current data.
    await router.invalidate();
  }

  const updateKnowledgeItem = async (options: api.updateKnowledgeItem.Options) => {
    // Update a knowledge datapoint
    await api.updateKnowledgeItem(options);
    
    // Force the router to reload the current data.
    await router.invalidate();
  }

  const deleteKnowledgeItem = async (knowledge_id: string) => {
    // Delete the knowledge item on the server.
    await api.deleteKnowledgeItem(knowledge_id);

    // Force the router to reload the current data.
    await router.invalidate();
  }

  const deleteKnowledgeItems = async (options: api.deleteKnowledgeItems.Options) => {
    // Delete a list of knowledge items on the server.
    await api.deleteKnowledgeItems(options);

    // Force the router to reload the current data.
    await router.invalidate();
  };

  // Create the knowledge config.
  const config: KnowledgeConfig = {
    knowledge,
    detail,
    uploadKnowledgeItem,
    updateKnowledgeItem,
    deleteKnowledgeItem,
    deleteKnowledgeItems
  };

  // Return the rendered component.
  return (
    <KnowledgeConfigProvider value={ config }>
      <Knowledge />
    </KnowledgeConfigProvider>
  );
}
