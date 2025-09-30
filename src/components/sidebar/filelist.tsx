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
  useShallow
} from 'zustand/react/shallow';

import {
  useAppStore,
} from '@/store';

import {
  FileItem
} from './fileitem';


/**
 * A React component which renders the file list in the side bar.
 */
export
function FileList(): ReactNode {
  // Fetch the file ids from the store.
  const fileIds = useAppStore(useShallow(store =>
    store.files.map(file => file.id)
  ));

  // Create the file components for the file list.
  const files = fileIds.map(fileId =>
    <FileItem key={ fileId } fileId={ fileId } />
  );

  // Return the rendered component.
  return (
    <div className={ clsx(
      'flex flex-col flex-auto min-h-0 gap-2 select-none'
      ) }>
      <h1 className='flex-none'>
        Files
      </h1>
      <div className='flex-auto overflow-y-auto'>
        <ul className='flex flex-col gap-3'>
          { files }
        </ul>
      </div>
    </div>
  );
}
