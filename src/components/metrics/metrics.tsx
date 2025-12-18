/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  cn
} from '@/lib/utils';

import {
  AgentRunsChart, AgentSessionsChart
} from './agents';

import {
  ModelRunsChart
} from './models';

import {
  MonthSelector
} from './monthselector';

import {
  TeamRunsChart, TeamSessionsChart
} from './teams';

import {
  TokensChart
} from './tokens';

import {
  UsersChart
} from './users';

import {
  WorkflowRunsChart, WorkflowSessionsChart
} from './workflows';


/**
 * A React component that renders the metrics chart page.
 *
 * TODO enable tailwind container queries for this component instead
 * of using the default screen query.
 */
export
function Metrics(): ReactNode {
  return (
    <main className='grow flex flex-col'>
      <div className={ cn(
        'px-4 py-2 flex flex-row gap-4 items-center justify-between',
        'border-b border-bd-neutral-default') }>
        <h2 className='text-lg font-semibold'>
          Metrics
        </h2>
        <MonthSelector />
      </div>
      <div className={ cn(
        'p-4 grow min-h-0 overflow-y-auto grid gap-4 auto-rows-[1fr]',
        'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3') }>
        <TokensChart />
        <UsersChart />
        <AgentRunsChart />
        <AgentSessionsChart />
        <TeamRunsChart />
        <TeamSessionsChart />
        <WorkflowRunsChart />
        <WorkflowSessionsChart />
        <ModelRunsChart />
      </div>
    </main>
  );
}
