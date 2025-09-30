/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useAppStore
} from '@/store';

import {
  Chats
} from './chats';

import {
  Files
} from './files';


/**
 * A React component that renders the SideBar content.
 */
export
function SideBarContent(): ReactNode {
  // Fetch the side bar state from the store.
  const sideBarState = useAppStore(store => store.sideBarState);

  // Set up the variable for the side bar content.
  let content: ReactNode = null;

  // Render the content based on the side bar state.
  switch (sideBarState) {
  case 'chats':
    content = <Chats />;
    break;
  case 'files':
    content = <Files />;
    break;
  default:
    break;
  }

  // Return the rendered component.
  return content;
}
