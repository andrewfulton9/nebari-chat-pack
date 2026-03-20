/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ToolCall
} from '@ag-ui/core';

import {
  JsonEditor
} from 'json-edit-react';

import {
  Hammer
} from 'lucide-react';

import type {
  ReactNode
} from 'react';

import {
  cn
} from '@/lib/utils';

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';


/**
 * A react component that renders the tool executions for a run.
 */
export
function ToolCallsRenderer(props: ToolsRenderer.Props): ReactNode {
  // Extract the props.
  const { toolCalls } = props;

  // Bail early if there is nothing to render.
  if (toolCalls.length === 0) {
    return null;
  }

  // Return the rendered component.
  return (
    <div className='flex flex-col gap-4'>
      <Private.ToolAccordion toolCalls={ toolCalls } />
    </div>
  );
}


/**
 * The namespace for the `ToolsRenderer` statics.
 */
export
namespace ToolsRenderer {
  /**
   * A type alias for the `ToolsRenderer` props.
   */
  export
  type Props = {
    /**
     * The api events for the run.
     */
    readonly toolCalls: readonly ToolCall[];
  };
}


/**
 * The namespace for the module implementation details.
 */
namespace Private {
  /**
   * A type alias for the `ToolAccordion` props.
   */
  export
  type ToolAccordionProps = {
    /**
     * The tool calls for the message.
     */
    readonly toolCalls: readonly ToolCall[];
  };

  /**
   * A react component that renders the tool accordion.
   *
   * This component allows the user to inspect the raw JSON tool data.
   */
  export
  function ToolAccordion(props: ToolAccordionProps): ReactNode {
    // Extract the props.
    const { toolCalls } = props;

    // Get the number of tools called, which is known to be `> 0`.
    const count = toolCalls.length;

    // Create the JSON viewer content for the tool calls.
    const content = toolCalls.map(tc => {
      // Try to parse the arguments to JSON, falling back on the string.
      const args = (() => {
        try {
          return JSON.parse(tc.function.arguments);
        } catch {
          return tc.function.arguments;
        }
      })();

      // Return the rendered component.
      return (
        <div key={ tc.id } className='flex flex-col gap-4'>
          <div className='font-semibold'>
            { tc.function.name.toUpperCase() }
          </div>
          <JsonEditor
            className='ot-ChatPlusPlus-jer'
            data={ args }
            maxWidth='100%'
            rootName='arguments'
            viewOnly={ true }
            rootFontSize={ 12 }
            collapse={ false } />
        </div>
      );
    });

    // Return the rendered component.
    return (
      <Accordion type='single' collapsible>
        <AccordionItem value='tools'>
          <AccordionTrigger
            className={ cn(
              'px-2 py-1 gap-2 items-center flex-0 text-nowrap text-xs rounded-sm',
              'hover:no-underline cursor-pointer bg-bg-neutral-dark',
              'hover:bg-bg-neutral-default' ) }>
            <Hammer size={ 14 } />
            { `${count} TOOL${count === 1 ? '' : 'S'} CALLED` }
          </AccordionTrigger>
          <AccordionContent
            className='mt-4 p-4 flex flex-col gap-6 border rounded-md'>
            { content }
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }
}
