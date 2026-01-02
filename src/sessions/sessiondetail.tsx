/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  X
} from 'lucide-react';

import {
  Link
} from '@tanstack/react-router';

import type {
  ReactNode
} from 'react';

import {
  useState
} from 'react';

import * as api from '@/api';

import {
  ToggleGroup, ToggleGroupItem
} from '@/components/ui/toggle-group';


/**
 * A React component that renders a session detail.
 */
export
function SessionDetail(props: SessionDetail.Props): ReactNode {
  // Extract the props.
  const { detail } = props;

  // Create the state to track the active tab.
  const [tabId, setTabId] = useState<Private.TabId>('history');

  // Return the rendered component.
  return (
    <div className='border-l border-bd-neutral-default'>
      <Private.Header
        title={ detail.session_name }
        tabId={ tabId }
        setTabId={ setTabId } />
    </div>
  );
}


/**
 * The namespace for the `SessionDetail` statics.
 */
export
namespace SessionDetail {
  /**
   * A type alias for the `SessionDetail` props.
   */
  export
  type Props = {
    /**
     * The session detail data from the api.
     */
    readonly detail: api.SessionDetail;
  };
}


/**
 * The namespace for the module implementation details.
 */
namespace Private {
  /**
   * A type alias for a tab id.
   */
  export
  type TabId = 'history' | 'metrics' | 'details';

  /**
   * A type alias for the `Header` props.
   */
  export
  type HeaderProps = {
    /**
     * The title for the header.
     */
    readonly title: string;

    /**
     * The selected tab id.
     */
    readonly tabId: TabId;

    /**
     * A callback to set the selected tab id.
     */
    readonly setTabId: (id: TabId) => void;
  };

  /**
   * A react component that renders the header for the session detail.
   */
  export
  function Header(props: HeaderProps): ReactNode {
    // Extract the props.
    const { title, tabId, setTabId } = props;

    // Return the rendered component.
    return (
      <div className='border-b border-bd-neutral-default'>
        <div className='py-2 px-4 flex flex-row items-center justify-between'>
          <h2 className='text-lg font-semibold'>
            { title }
          </h2>
          <Link
            className='p-1 rounded-sm hover:bg-bg-neutral-dark'
            aria-label='close'
            to='..'
            search={ prev => prev }>
            <X size={ 20 } />
          </Link>
        </div>
        <ToggleGroup
          className='py-2 px-4'
          type='single'
          variant='outline'
          size='sm'
          value={ tabId }
          onValueChange={ setTabId }>
          <ToggleGroupItem value='history' aria-label='history'>
            History
          </ToggleGroupItem>
          <ToggleGroupItem value='metrics' aria-label='metrics'>
            Metrics
          </ToggleGroupItem>
          <ToggleGroupItem value='details' aria-label='details'>
            Details
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    );
  }
}
