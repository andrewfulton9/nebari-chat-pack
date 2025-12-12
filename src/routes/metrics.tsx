/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createFileRoute
} from '@tanstack/react-router';

import {
  useCallback
} from 'react';

import * as v from 'valibot';

import type {
  MetricsConfig, MetricsConfigUpdateOptions
} from '@/components/metrics';

import {
  Metrics, MetricsConfigProvider
} from '@/components/metrics';


/**
 * The schema for the route search params.
 */
const routeSearchSchema = v.object({
  month: v.optional(v.number()),
  year: v.optional(v.number()),
});


/**
 * The route for the `/metrics` endpoint.
 */
export
const Route = createFileRoute('/metrics')({
  validateSearch: routeSearchSchema,
  component: RouteComponent
});


/**
 * The component that renders the `/metrics` route.
 */
function RouteComponent() {
  // Fetch the search parameters.
  const { month, year } = Route.useSearch();

  // Fetch the navigator.
  const navigate = Route.useNavigate();

  // Create the callback for updating the config.
  const update = useCallback((options: MetricsConfigUpdateOptions) => {
    navigate({ search: { ...options } });
  }, []);

  // Create the metrics context.
  const context: MetricsConfig = { month, year, update };

  // Return the rendered component.
  return (
    <MetricsConfigProvider value={ context }>
      <Metrics />
    </MetricsConfigProvider>
  );
}
