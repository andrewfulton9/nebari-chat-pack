/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  Outlet, createRootRouteWithContext
} from '@tanstack/react-router';

import type {
  QueryClient
} from '@tanstack/react-query';

import type {
  ReactNode
} from 'react';

import {
  ConfigProvider
} from '@/config';

import {
  Sidebar
} from '@/sidebar';


/**
 * Auth state interface
 */
type AuthState = {
  isAuthenticated: boolean;
  user: {user_id: string; username: string; email?: string} | null;
  login: (options: {username: string, password: string}) => Promise<void>;
  logout: () => void;
}

/**
 * The root route context.
 */
type RouteContext = {
  auth: AuthState;
  client: QueryClient;
};


/**
 * The root route.
 */
export
const Route = createRootRouteWithContext<RouteContext>()({
  component: RouteComponent,
});


/**
 * The component that renders the root route.
 */
function RouteComponent(): ReactNode {
  // Fetch the Agno config object.
  const config = Route.useLoaderData();

  // Return the rendered component.
  return (
    <ConfigProvider value={ config }>
      <Sidebar />
      <Outlet />
    </ConfigProvider>
  );
}
