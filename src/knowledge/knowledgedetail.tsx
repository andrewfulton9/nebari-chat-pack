/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  DetailHeader
} from './detailheader';

import {
  DetailsRenderer
} from './detailsrenderer';

import * as api from '@/api';

export
function KnowledgeDetail(props: KnowledgeDetail.Props): ReactNode {
  // Extract the props.
  const { detail } = props;

  // Return the rendered component.
  return (
    <div className='border-l border-bd-neutral-default flex flex-col min-h-0'>
      <DetailHeader detail={detail}/>
      <DetailsRenderer detail={ detail } />
    </div>
  );
}

export
namespace KnowledgeDetail {
  /**
   * A type alias for the `KnowledgeDetail` props.
   */
  export
  type Props = {
  /**
   * The session detail data from the api.
   */
  readonly detail: api.KnowledgeDetail;
  };
}
