/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  AppendMessage, ThreadMessageLike
} from '@assistant-ui/react';

import type {
  QueryClient
} from '@tanstack/react-query';

import type {
  WritableDraft
} from 'immer';

import {
  produce
} from 'immer';

import * as api from '@/api';

import {
  createQueryKey
} from './querykey';


/**
 * A class that manages running an Agno agent via AUI.
 */
export
class RunHandler {
  /**
   * Create a run handler that talks to the Agno API.
   *
   * @param sessionId - The id of the session. If this is not provided,
   *   a new session will be created with a new id. If the id is provided,
   *   this assumes the id already exists on the server.
   *
   * @param client - The query client for populating the query cache.
   *
   * @returns A new run handler for handling messages.
   */
  static
  async create(
    sessionId: string | undefined, client: QueryClient
  ): Promise<RunHandler> {
    // If the session id already exists, return a new handler.
    if (sessionId !== undefined) {
      return new RunHandler(sessionId, client);
    }

    // Create a new session on the server.
    const resp = await api.createSession();

    // Extract the session id.
    sessionId = resp.session_id;

    // Initialize the query cache for the new session.
    client.setQueryData(createQueryKey(sessionId), []);

    // Return the handler for the new session.
    return new RunHandler(sessionId, client);
  }

  /**
   * Construct a new `RunHandler`.
   *
   * @param sessionId - The id of the session which is assumed to exist
   *   on the server.
   *
   * @param client - The query client for updating the query cache.
   *
   * #### Note
   * This is a private constructor. User code should call the
   * `RunHandler.create(...)` method to construct the handler.
   */
  private constructor(sessionId: string, client: QueryClient) {
    this._sessionId = sessionId;
    this._client = client;
  }

  /**
   * Get the session id for the handler.
   */
  get sessionId(): string {
    return this._sessionId;
  }

  /**
   * Get the query client for the handler.
   */
  get client(): QueryClient {
    return this._client;
  }

  /**
   * Run the user message with given agent.
   *
   * @param message - The user provided prompt message.
   *
   * @param agentId - The agent to invoke with user message.
   *
   * @returns A promise that resolves when the run is completed.
   *
   * #### Notes
   * This handler will update the query client data for session key with
   * the streaming messages as they come in. This method does not return
   * a value.
   */
  async run(message: AppendMessage, agentId: string): Promise<void> {
    // Bail early if the content length is unexpected.
    if (message.content.length !== 1) {
      throw new Error(`Unhandled content length: ${message.content.length}`);
    }

    // Extract the single message part.
    const part = message.content[0];

    // Bail early if the content part type is unexpected.
    if (part.type !== 'text') {
      throw new Error(`Unhandled part type: ${part.type}`);
    }

    // Create the query key for the run.
    const queryKey = createQueryKey(this._sessionId);

    // Initialize the cache with the user message.
    this._client.setQueryData<ThreadMessageLike[]>(
      queryKey,
      produce(draft => {
        draft!.push({
          role: 'user',
          content: part.text,
          createdAt: message.createdAt
        });
      })
    );

    // Set up the event stream for the Agno API.
    const stream = api.createAgentRun({
      session_id: this._sessionId,
      agent_id: agentId,
      message: part.text
    });

    // Handle the stream events from the Agno API.
    for await (const evt of stream) {
      this._client.setQueryData<ThreadMessageLike[]>(
        queryKey,
        produce(draft => { Private.processEvent(evt, draft!); })
      );
    }
  }

  private _sessionId: string;
  private _client: QueryClient;
}


/**
 * The namespace for the module implementation details.
 */
namespace Private {
  /**
   * A type alias for a writeable AUI thread draft.
   */
  export
  type Draft = WritableDraft<ThreadMessageLike>[];

  /**
   * Process an Agno event and add it's effects to the thread draft.
   *
   * @param evt - The Agno run event to process.
   *
   * @param draft - The AUI thread message draft to modify.
   */
  export
  function processEvent(evt: api.RunEvent, draft: Draft): void {
    switch (evt.event) {
    case 'RunStarted':
      Private.evtRunStarted(evt, draft);
      break;
    case 'RunContent':
      Private.evtRunContent(evt, draft);
      break;
    case 'RunContentCompleted': // no need to handle this event
      break;
    case 'RunCompleted': // no need to handle this event
      break
    case 'ToolCallStarted':
      Private.evtToolCallStarted(evt, draft);
      break;
    case 'ToolCallCompleted':
      Private.evtToolCallCompleted(evt, draft);
      break;
    default:
      console.log('unhandled run event', evt);
    }
  }

  /**
   * Handle the `RunStarted` Agno event.
   */
  export
  function evtRunStarted(evt: api.RunStartedEvent, draft: Draft): void {
    draft.push({
      role: 'assistant',
      id: evt.run_id,
      createdAt: new Date(evt.created_at),
      content: []
    });
  }

  /**
   * Handle the `RunContent` Agno event.
   */
  export
  function evtRunContent(evt: api.RunContentEvent, draft: Draft): void {
    // Find the most recent matching assistant message.
    const msg = draft.findLast(m =>
      m.role === 'assistant' && m.id === evt.run_id
    );

    // Log an error if the message is not found.
    if (!msg) {
      console.error(`Assistant message not found: ${evt.run_id}`);
      return;
    }

    //
    const content = msg.content;
    if (typeof content === 'string') {
      console.error('Assistant message `content` has invalid type');
      return;
    }

    //
    const last = content[content.length - 1];

    //
    if (last && last.type === 'text') {
      last.text += evt.content;
    } else {
      content.push({ type: 'text', text: evt.content });
    }
  }

  /**
   * Handle the `ToolCallStarted` Agno event.
   */
  export
  function evtToolCallStarted(evt: api.ToolCallStartedEvent, draft: Draft): void {
    // Find the most recent matching assistant message.
    const msg = draft.findLast(m =>
      m.role === 'assistant' && m.id === evt.run_id
    );

    // Log an error if the message is not found.
    if (!msg) {
      console.error(`Assistant message not found: ${evt.run_id}`);
      return;
    }

    //
    const content = msg.content;
    if (typeof content === 'string') {
      console.error('Assistant message `content` has invalid type');
      return;
    }

    //
    content.push({
      type: 'tool-call',
      toolCallId: evt.tool.tool_call_id,
      toolName: evt.tool.tool_name
    });
  }

  /**
   * Handle the `ToolCallCompleted` Agno event.
   */
  export
  function evtToolCallCompleted(evt: api.ToolCallCompletedEvent, draft: Draft): void {
    return;
  }
}
