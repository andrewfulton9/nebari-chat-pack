/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  Outlet, createFileRoute, redirect
} from '@tanstack/react-router'

import type {
  ReactNode,
} from 'react';

import * as api from '@/api';

import {
  ConfigProvider
} from '@/config';


/**
 * Auth bypass for the dev environment.
 * 
 * (IMPORTANT) - update the .env variables before deployment.
 */
function shouldEnforceAuth(): boolean {
  const bypass = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';
  const prod = import.meta.env.VITE_MODE === 'production';
  return !(bypass && !prod);
}


/**
 * The query params for loading the core Agno OS config.
 */
const configQuery = {
  queryKey: ['config'],
  queryFn: api.getConfig,
  staleTime: 'static'
} as const;


/**
 * The base route that enforces authentication.
 */
export
const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    if (shouldEnforceAuth() && api.getUser() === null) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: RouteComponent,
  loader: ({ context }) => {
    return context.client.ensureQueryData(configQuery);
  }
});


/**
 * The component that renders the authenticated route.
 */
function RouteComponent(): ReactNode {
  // Fetch the Agno config object.
  const config = Route.useLoaderData();

  // Return the rendered component.
  return (
    <ConfigProvider value={ config }>
      <Outlet />
    </ConfigProvider>
  );
}
