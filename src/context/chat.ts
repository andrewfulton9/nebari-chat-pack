/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createContext, useContext
} from 'react';

import * as api from '@/api';


/**
 * The configuration for a chat.
 */
export
type ChatConfig = {
  /**
   * The thread object loaded for the URL `threadId` search param.
   */
  readonly thread: api.Thread | null;

  /**
   * A callback to set the thread id.
   *
   * This will cause the URL to update and a new `Thread` to be loaded.
   */
  readonly setThreadId: (threadId: string | undefined) => void;

  /**
   * The agent id for the chat.
   *
   * This is locked to the loaded thread object.
   *
   * If the thread is null, the user's agent choice will prevail.
   */
  readonly agentId: string;

  /**
   * A callback to set the agent id for creating new threads.
   *
   * This will ignore an invalid agent id.
   */
  readonly setAgentId: (agentId: string) => void;
};


/**
 * The chat config context.
 */
export
const ChatConfigContext = createContext<ChatConfig | undefined>(undefined);


/**
 * A hook which returns the chat config.
 */
export
function useChatConfig(): ChatConfig {
  const config = useContext(ChatConfigContext);
  if (config === undefined) {
    throw new Error('`useChatConfig` must be called within a `ChatConfigContext`');
  }
  return config;
}
