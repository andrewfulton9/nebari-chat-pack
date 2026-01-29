/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import * as api from '@/api';


export
function DetailHeader(props: DetailHeader.Props): ReactNode {
  // Extract the props.
  const { detail } = props;

  return (
    <div className='border-b border-bd-neutral-default'>
      <div className={
        'py-2 px-4 flex flex-row gap-2 items-center justify-between' }>
        <h2 className='text-lg font-semibold truncate'>
          { detail.name }
        </h2>
      </div>
    </div>
  );
}

export
namespace DetailHeader {
  export
  type Props = {
    /**
     * The session detail data from the api.
     */
    readonly detail: api.KnowledgeDetail;
  };
}
