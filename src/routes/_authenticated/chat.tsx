/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createFileRoute
} from '@tanstack/react-router';

import {
  useCallback, useState
} from 'react';

import * as z from 'zod';

import {
  Chat
} from '@/chat';

import type {
  ChatConfig
} from '@/context';

import {
  ChatConfigContext, useAppConfig
} from '@/context';

import {
  threadQuery
} from '@/queries';


// The schema for the `/chat` route search params
const searchSchema = z.object({
  threadId: z.string().optional()
});


/**
 * The route for the `/chat` endpoint.
 */
export
const Route = createFileRoute('/_authenticated/chat')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    const query = threadQuery(deps.threadId);
    return context.client.fetchQuery(query);
  },
  component: RouteComponent
});


/**
 * The component that renders the `/chat` route.
 */
function RouteComponent() {
  // Fetch the loaded thread.
  const thread = Route.useLoaderData();

  // Fetch the navigator.
  const navigate = Route.useNavigate();

  // Fetch the available agents.
  const { agents } = useAppConfig();

  // Create the internal state for the user's agent selection.
  const [$agentId, $setAgentId] = useState('');

  // Create the callback for setting the thread id.
  const setThreadId = useCallback((threadId: string | undefined) => {
    navigate({ search: { threadId } });
  }, []);

  // Create the callback for setting the agent id.
  const setAgentId = useCallback((agentId: string) => {
    if (agents.some(a => a.id === agentId)) {
      $setAgentId(agentId);
    }
  }, [agents]);

  // Compute the effective agent id.
  const agentId = (
    thread ? thread.agentId :
    $agentId ? $agentId :
    agents[0]?.id ?? ''
  );

  // Create the chat config.
  const chatConfig: ChatConfig = { thread, setThreadId, agentId, setAgentId };

  // Return the rendered component.
  return (
    <ChatConfigContext value={ chatConfig }>
      <Chat />
    </ChatConfigContext>
  );
}
