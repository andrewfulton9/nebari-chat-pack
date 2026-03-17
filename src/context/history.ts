/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createContext, useContext
} from 'react';

import * as api from '@/api';


/**
 * A type alias for the history context value.
 */
export
type HistoryContextValue = {
  /**
   * The loaded history page from the api.
   */
  readonly page: api.ThreadPage;

  /**
   * A function that deletes the provided threads by id.
   */
  readonly deleteThreads: (ids: readonly string[]) => Promise<void>;
};


/**
 * The history context.
 */
export
const HistoryContext = createContext<HistoryContextValue | undefined>(undefined);


/**
 * A hook which returns the history context value.
 */
export
function useHistory(): HistoryContextValue {
  const value = useContext(HistoryContext);
  if (value === undefined) {
    throw new Error('`useHistory` must be called within a `HistoryContext`');
  }
  return value;
}
