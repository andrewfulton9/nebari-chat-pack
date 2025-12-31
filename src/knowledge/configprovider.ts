/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createContext, useContext
} from 'react';


/**
 * A type alias for the knowledge config.
 */
export
type KnowledgeConfig = {

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
