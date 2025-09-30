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
  FileList
} from './filelist';

import {
  UploadButton
} from './uploadbutton';


/**
 * A React component that renders files for the side bar.
 */
export
function Files(): ReactNode {
  // Return the rendered component.
  return (
    <div className={ clsx(
      'flex flex-col p-6 gap-6 w-68 bg-bg-neutral-white',
      'border-r border-r-bd-neutral-default'
    ) }>
      <UploadButton />
      <FileList />
    </div>
  );
}
