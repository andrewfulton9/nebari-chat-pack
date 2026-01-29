/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createContext, useContext
} from 'react';

import * as api from '@/api';


/**
 * A type alias for the knowledge config.
 */
export
type KnowledgeConfig = {
  /**
   * The loaded knowledge from the api.
   */
  readonly knowledge: api.KnowledgeList;

  /**
   * The details for the currently selected session.
   *
   * This will be null if there is no selected session.
   */
  readonly detail: api.KnowledgeDetail | null;

  /**
   * A function that deletes the provided knowledge by id.
   */
  readonly deleteKnowledgeItem: (knowledge_id: string) => Promise<void>;

  /**
   * A function that deletes a list of provided knowledge items.
   */
  readonly deleteKnowledgeItems: (options: api.deleteKnowledgeItems.Options) => Promise<void>;

  /**
   * A function that updates data for the provided knowledge by id.
   */
  readonly updateKnowledgeItem: (options: api.updateKnowledgeItem.Options) => Promise<void>;

  /**
   * A function to upload a knowledge datapoint to the db
   * @param option
   * @returns 
   */
  readonly uploadKnowledgeItem: (option: api.uploadKnowledgeItem.Options) => Promise<void>;
};


/**
 * The knowledge config provider.
 */
export
const KnowledgeConfigProvider = createContext<KnowledgeConfig | undefined>(undefined);

/**
 * A hook which returns the knowledge config.
 */
export
function useKnowledgeConfig(): KnowledgeConfig {
  const config = useContext(KnowledgeConfigProvider);
  if (config === undefined) {
    throw new Error('missing `KnowledgeConfigProvider`');
  }
  return config;
}
