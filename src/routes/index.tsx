/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createFileRoute
} from '@tanstack/react-router';

import type {
  QueryClient
} from '@tanstack/react-query';

import {
  ConfigProvider
} from '@/components/common';

import type {
  ReactNode
} from 'react';

import {
  HomePage
} from '@/components/landing-page';

import * as api from '@/api';

/**
 * The query params for loading the Agno config.
 */
const configQuery = {
  queryKey: ['config'],
  queryFn: api.getConfig,
  staleTime: 'static'
} as const;

/**
 * The loader function for the config query.
 */
function loadConfig(client: QueryClient): Promise<api.Config> {
  return client.ensureQueryData(configQuery); 
}

export
const Route = createFileRoute('/')({
  loader: ({ context }) => loadConfig(context.queryClient),
  component: RouteComponent
});


function RouteComponent(): ReactNode {
  const config = Route.useLoaderData();
  return (
    <ConfigProvider value={ config }>
      <HomePage/>
    </ConfigProvider>
  );
}
