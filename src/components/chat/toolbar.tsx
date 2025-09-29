/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  MouseEvent, ReactNode
} from 'react';

import {
  ModelSelector
} from './modelselector';

import {
  SubmitButton
} from './submitbutton';


/**
 * A React component that renders a chat tool bar.
 */
export
function ToolBar(props: ToolBar.Props): ReactNode {
  // Extract the props.
  const { model, setModel, onSubmit} = props;

  // Return the rendered component.
  return (
    <div className='flex flex-row gap-3'>
      <div className='flex flow-row flex-wrap flex-1 items-start gap-3'>
        <ModelSelector model={ model } setModel={ setModel } />
      </div>
      <SubmitButton onClick={ onSubmit } />
    </div>
  );
}


/**
 * The namespace for the `ToolBar` component statics.
 */
export
namespace ToolBar {
  /**
   * A type alias for the `ToolBar` props.
   */
  export
  type Props = {
    /**
     * The name of the model to use for the chat.
     */
    readonly model: string;

    /**
     * A callback to set the selected model.
     */
    readonly setModel: (model: string) => void;

    /**
     * The click handler for the submit button.
     */
    readonly onSubmit: (event: MouseEvent) => void;
  };
}
