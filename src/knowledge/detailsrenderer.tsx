/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useState
} from 'react';

import * as api from '@/api';

import {
  useForm,
} from "@tanstack/react-form"

import {
  Button
} from "@/components/ui/button"

import {
  Input
} from "@/components/ui/input"

import {
  Label
} from "@/components/ui/label"

import {
  Link
} from '@tanstack/react-router';

import {
  X
} from "lucide-react"

import { useKnowledgeConfig } from './configprovider';

export
function DetailsRenderer(props: DetailsRenderer.Props): ReactNode {
  // getch the props
  const { detail } = props;

  const {updateKnowledgeItem, deleteKnowledgeItem} = useKnowledgeConfig();

  // Form definition 
  // TODO: Update the form from the Tanstack form to something similar to (HITL) form
  // Metadata field is pretty complex and should be simplified.
  const form = useForm({
    defaultValues: {
      name: detail.name,
      description: detail.description,
      metadata: detail.metadata,
      content_type: detail.type,
      created_at: detail.created_at,
      updated_at: detail.updated_at,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
      const knowledge_id = detail.id
      
      updateKnowledgeItem({
        knowledge_id,
        body: {
          name: value.name,
          description: value.description,
          metadata: value.metadata ?? {},
          reader_id: "",
        },
      });
    },
  })

  // variables for the metadata object breakdown
  const [metadataKey, setMetadataKey] = useState("")
  const [metadataVal, setMetadataVal] = useState("")


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="h-full flex flex-col justify-between"
    >
      <div className="space-y-6 p-6">
        <form.Field
          name="name"
          children={(field) => (
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />

        <form.Field
          name="description"
          children={(field) => (
            <div className="space-y-2">
              <Label>
                <span>Description</span>
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="min-h-[110px]"
                placeholder="Add a description..."
              />
            </div>
          )}
        />

        <form.Field
          name="metadata"
          children={(field) => {
            const meta = field.state.value ?? {}

            const handleAddMetadata = () => {
              const key = metadataKey.trim()
              if (!key) return

              field.setValue((prev) => ({
                ...(prev ?? {}),
                [key]: metadataVal,
              }))

              setMetadataKey("")
              setMetadataVal("")
            }

            // Removes the mmetatags for a knowledge item
            const handleRemoveMetadata = (keyToRemove: string) => {
              field.setValue((prev) => {
                const next = { ...(prev ?? {}) }
                delete next[keyToRemove]
                return next
              })
            }

            return (
              <div className="space-y-2">
                <Label>Metadata</Label>

                <div className="flex gap-2">
                  <Input placeholder="Key" value={metadataKey} onChange={(e) => setMetadataKey(e.target.value)} />
                  <Input placeholder="Value" value={metadataVal} onChange={(e) => setMetadataVal(e.target.value)} />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddMetadata}
                  >
                    +
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {Object.entries(meta).map(([k, v]) => (
                    <div
                      key={k}
                      className="h-8 inline-flex items-center gap-2 rounded-full border px-3 text-sm"
                      title={`${k}=${v}`}
                    >
                      <span className="font-mono whitespace-nowrap">
                        {k}={v}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveMetadata(k)}
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-muted"
                        aria-label={`Remove ${k}`}
                      >
                        <X className="h-3 w-3"/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          }}
        />


        <div className="space-y-2">
          <Label>Content Type</Label>
          <div className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
            {detail.type.toUpperCase()}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Last Updated</Label>
          <div className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
            {detail.updated_at}
          </div>
        </div>
      </div>

      <div className=" border-t p-6">
        <div className="flex items-center justify-between">
          <Button
            asChild
            type="button"
            variant="destructive"
            onClick={async () => {
              deleteKnowledgeItem(detail.id)
            }}
          >
            <Link
              aria-label='close'
              to='..'
              search={ prev => prev }>
              Delete
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link
                aria-label='close'
                to='..'
                search={ prev => prev }>
                Cancel
              </Link>
            </Button>
            <Button type="submit">
              Save
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

/**
 * The namespace for the `DetailsRenderer` statics.
 */
export
namespace DetailsRenderer {
  /**
   * A type alias for the `DetailsRenderer` props.
   */
  export
  type Props = {
    /**
     * The session detail data from the api.
     */
    readonly detail: api.KnowledgeDetail;
  };
}
