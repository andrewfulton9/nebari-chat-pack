/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createFileRoute, redirect
} from '@tanstack/react-router';

import * as api from '@/api';


/**
 * A route that logs out the user and then redirects to `/`.
 */
export
const Route = createFileRoute('/logout')({
  beforeLoad: () => {
    api.logout();
    throw redirect({ to: '/' });
  },
});
