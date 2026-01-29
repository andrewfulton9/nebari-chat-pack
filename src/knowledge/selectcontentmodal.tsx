import type{
  ReactNode
} from 'react'

import {
  Button
} from '@/components/ui/button'

import {
  X
} from 'lucide-react';


export
function SelectContentModal(options: SelectContentModal.Options): ReactNode {
  // extract the options
  const {isOpen, onClose, onSelect} = options;

  // return nothing if the modal is not open
  if (!isOpen) return null;

  // callback with the type of content is being uploaded
  const handleSelect = (source: SelectContentModal.ContentSource) => {
    onSelect?.(source);
    onClose();
  };

  // Render component
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold whitespace-nowrap">
            Select content type to add to the knowledge base
          </h3>

          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 flex items-center justify-center"
          >
            <X className="h-4 w-4"/>
          </Button>
        </div>

        <p className="mt-2 text-sm text-gray-800">
          You can add different types of content
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Button variant="outline" onClick={() => handleSelect("file")}>File</Button>
          <Button variant="outline" onClick={() => handleSelect("web")} >Web</Button>
          <Button variant="outline" onClick={() => handleSelect("text")} >Text</Button>
        </div>
      </div>
    </div>
  )
}

export
namespace SelectContentModal {

  export
  type ContentSource = "file" | "web" | "text";

  export
  type Options = {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (source: ContentSource) => void;
  }
}
