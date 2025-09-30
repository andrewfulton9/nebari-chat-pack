/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  clsx
} from 'clsx';

import type {
  ReactNode
} from 'react';

import {
  ChatList
} from './chatlist';

import {
  NewChatButton
} from './newchatbutton';


/**
 * A React component that renders the chats panel for the side bar.
 */
export
function Chats(): ReactNode {
  // Return the rendered component.
  return (
    <div className={ clsx(
      'flex flex-col p-6 gap-6 w-68 bg-bg-neutral-white',
      'border-r border-r-bd-neutral-default'
    ) }>
      <NewChatButton />
      <ChatList />
    </div>
  );
}
