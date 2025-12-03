/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  TextMessagePart, ThreadMessageLike, ToolCallMessagePart
} from '@assistant-ui/react';

import * as api from '@/api';


/**
 * A class that handles loading the session history as AUI messages.
 */
export
class LoadHandler {
  /**
   * Construct a new load handler.
   *
   * @param sessionId - The unique id for the session. If this is `undefined`,
   *   an empty message history will be loaded. If this is provided, the chat
   *   history will be loaded from the server.
   */
  constructor(sessionId: string | undefined) {
    this._sessionId = sessionId;
  }

  /**
   * Get the session id for the handler.
   */
  get sessionId(): string | undefined {
    return this._sessionId;
  }

  /**
   * Load the message history for the handler.
   *
   * @returns A promise that resolves with the AUI message history.
   */
  async loadHistory(): Promise<readonly ThreadMessageLike[]> {
    // Bail early if the session id is undefined.
    if (this._sessionId === undefined) {
      return [];
    }

    // Fetch the runs from the server.
    const runs = await api.getSessionRuns(this._sessionId);

    // Convert the runs to thread messages.
    const messages = runs.map(Private.convertRun);

    // Return the flattened messages.
    return messages.flat();
  }

  private _sessionId: string | undefined;
}


/**
 * The namespace for the module implementation details.
 */
namespace Private {
  /**
   * Convert an Agno run into AUI thread messages.
   *
   * @param run - The Agno api run of interest.
   *
   * @returns An array of AUI thread messages for the run.
   */
  export
  function convertRun(run: api.Run): ThreadMessageLike[] {
    // Create the user message.
    const user = createUserMessage(run);

    // Create the assistant message.
    const assistant = createAssistantMessage(run);

    // Return the AUI messages.
    return [user, assistant];
  }

  /**
   * Create the AUI user message for an Agno run.
   *
   * @param run - The Agno api run of interest.
   *
   * @returns The AUI user message for the run.
   */
  function createUserMessage(run: api.Run): ThreadMessageLike {
    return {
      role: 'user',
      content: [createTextPart(run.run_input)],
      createdAt: new Date(run.created_at)
    };
  }

  /**
   * Create the AUI assistant message for an Agno run.
   *
   * @param run - The Agno api run of interest.
   *
   * @returns The AUI assistant message for the run.
   */
  function createAssistantMessage(run: api.Run): ThreadMessageLike {
    // Create the tool call parts.
    const tools = (run.tools ?? []).map(createToolCallPart);

    // Create the text part.
    const text = createTextPart(run.content);

    // Return the assistant message.
    return {
      role: 'assistant',
      content: [...tools, text],
      createdAt: new Date(run.created_at)
    };
  }

  /**
   * Create an AUI tool call part from an Agno tool call.
   *
   * @param tool - The Agno api tool call.
   *
   * @returns The equivalent AUI tool call part.
   */
  function createToolCallPart(tool: api.ToolCall): ToolCallMessagePart {
    return {
      type: 'tool-call',
      toolCallId: tool.tool_call_id,
      toolName: tool.tool_name,
      args: tool.tool_args as {},
      argsText: JSON.stringify(tool.tool_args),
      result: tool.result
    };
  }

  /**
   * Create the AUI assistant text part for an Agno run.
   *
   * @param content - The content for the text part.
   *
   * @returns The AUI assistant text part for the run.
   */
  function createTextPart(content: string): TextMessagePart {
    return { type: 'text', text: content };
  }
}
