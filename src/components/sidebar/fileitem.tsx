/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  clsx
} from 'clsx';

import {
  Trash2
} from 'lucide-react';

import type {
  ReactNode
} from 'react';

import {
  useAppStore
} from '@/store';


/**
 * A React component that renders an item in the file list.
 */
export
function FileItem(props: FileItem.Props): ReactNode {
  // Extract the props.
  const { fileId } = props;

  // Fetch the `deleteFile` function from the store.
  const deleteFile = useAppStore(store => store.deleteFile);

  // Fetch the file name from the store.
  const fileName = useAppStore(store =>
    store.files.find(f => f.id === fileId)!.name
  );

  // Set up the click handler to delete the file.
  const handleDelete = () => { deleteFile(fileId); };

  // Return the rendered component.
  return (
    <li className=
      'px-3 h-10 flex items-center justify-between whitespace-nowrap'>
      <span
        className={ clsx(
          'flex-1 min-w-0 text-text-neutral-default',
          'overflow-hidden text-ellipsis'
        ) }>
        { fileName }
      </span>
      <span className='cursor-pointer' onClick={ handleDelete }>
        <Trash2 size={ 16 } />
      </span>
    </li>
  );
}


/**
 * The namespace for the `FileItem` component statics.
 */
export
namespace FileItem {
  /**
   * A type alias for the `FileItem` props.
   */
  export
  type Props = {
    /**
     * The unique id of the file.
     */
    readonly fileId: string;
  };
}
