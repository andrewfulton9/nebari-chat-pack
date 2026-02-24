/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  type ReactNode
} from 'react';

import {
  EventsLog
} from './eventslog';

import {
  FaultInjector
} from './faultinjector';

import {
  SensorStatus
} from './sensorstatus';

import {
  Tracks
} from './tracks';


/**
 * A react component that renders the SkyKeeper dashboard.
 */
export
function Dashboard(): ReactNode {
  return (
    <div className='h-full @container'>
    <div className='h-full grid gap-2 grid-cols-6 @[900px]:grid-cols-8 grid-rows-[260px_1fr]'>
      <SensorStatus className='col-span-4 @[900px]:col-span-6' />
      <FaultInjector className='col-span-2' />
      <Tracks className='col-span-3 @[900px]:col-span-4' />
      <EventsLog className='col-span-3 @[900px]:col-span-4' />
    </div>
    </div>
  );
}
