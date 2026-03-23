/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createFileRoute, redirect
} from '@tanstack/react-router';

import * as auth from '@/auth';


/**
 * A route that logs out the user and then redirects to `/`.
 */
export
const Route = createFileRoute('/logout')({
  beforeLoad: async () => {
    await auth.logout('/');  // this might be a no-op
    throw redirect({ to: '/' });  // ensure the redirect happens
  }
});
