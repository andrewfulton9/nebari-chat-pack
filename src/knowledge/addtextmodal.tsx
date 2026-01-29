import type {
  ReactNode, FormEvent
} from "react";

import {
  useMemo,
  useState
} from "react";

import {
  Input
} from "@/components/ui/input"

import {
  Button
} from "@/components/ui/button";

import {
  X,
  Plus,
  Trash2,
  FileText,
  Type,
  AlignLeft,
  BookOpen,
  Braces,
} from "lucide-react";


/**
 * Function that returns a modal for a manual text input for a knowledge item
 * 
 * @param options 
 * @returns 
 */
export
function AddTextModal(options: AddTextModal.Options): ReactNode {
  const {
    isOpen,
    onClose,
    onBack,
    defaultReader,
    onSubmit,
  } = options;

  const readers = ["TextReader"]

  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [reader, setReader] = useState<string>(defaultReader ?? readers[0] ?? "TextReader");
  const [configureChunking, setConfigureChunking] = useState<boolean>(false);

  const [metadata, setMetadata] = useState<AddTextModal.MetadataEntry[]>([]);
  const [metaKey, setMetaKey] = useState<string>("");
  const [metaValue, setMetaValue] = useState<string>("");

  if (!isOpen) return null;

  const addMetadata = () => {
    const k = metaKey.trim();
    const v = metaValue.trim();
    if (!k) return;

    setMetadata((prev) => [
      ...prev,
      { id: crypto.randomUUID(), key: k, value: v },
    ]);

    setMetaKey("");
    setMetaValue("");
  };

  const removeMetadata = (id: string) => {
    setMetadata((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const values: AddTextModal.Values = {
      content: content.trim(),
      name: name.trim(),
      description: description.trim(),
      reader,
      configureChunking,
      metadata,
    };

    onSubmit?.(values);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative z-10 w-[min(760px,calc(100vw-2rem))] max-h-[85vh] rounded-2xl bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b">
          <h3 className="text-sm font-semibold truncate">Add text content to the knowledge base</h3>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-8 w-8 p-0 flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 overflow-auto px-6 py-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <FileText className="h-4 w-4" />
                Content
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter or paste text content here"
                className="h-28 rounded-md border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-gray-200 resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Type className="h-4 w-4" />
                Name
              </div>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter content name"
                className="h-9 rounded-md border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <AlignLeft className="h-4 w-4" />
                Description
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="h-24 rounded-md border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-gray-200 resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <BookOpen className="h-4 w-4" />
                Reader
              </div>

              <select
                value={reader}
                onChange={(e) => setReader(e.target.value)}
                className="h-9 rounded-md border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-gray-200 bg-white"
              >
                {readers.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-4">
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-800">Configure Chunking</div>
                <div className="text-xs text-gray-500">
                  Enable advanced chunking settings for this content.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfigureChunking((v) => !v)}
                className={[
                  "w-11 h-6 rounded-full border transition flex items-center px-1",
                  configureChunking ? "bg-gray-900 border-gray-900 justify-end" : "bg-gray-200 border-gray-300 justify-start",
                ].join(" ")}
              >
                <div className="h-4 w-4 rounded-full bg-white shadow" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Braces className="h-4 w-4" />
                Metadata <span className="text-xs font-normal text-gray-500">Optional</span>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={metaKey}
                  onChange={(e) => setMetaKey(e.target.value)}
                  placeholder="Key"
                  className="h-9 flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />

                <div className="text-sm text-gray-500">=</div>

                <Input
                  value={metaValue}
                  onChange={(e) => setMetaValue(e.target.value)}
                  placeholder="Value"
                  className="h-9 flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={addMetadata}
                  className="h-9 w-9 p-0 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Existing metadata */}
              {metadata.length > 0 && (
                <div className="mt-2 rounded-lg border border-gray-100 overflow-hidden">
                  {metadata.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-3 px-3 py-2 border-b last:border-b-0"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{m.key}</div>
                        <div className="text-xs text-gray-500 truncate">{m.value}</div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeMetadata(m.id)}
                        className="h-8 w-8 p-0 flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => (onBack ? onBack() : onClose())}
              className="w-28"
            >
              Back
            </Button>

            <Button type="submit" className="w-32">
              Add Content
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export namespace AddTextModal {
  export type MetadataEntry = {
    id: string;
    key: string;
    value: string;
  };

  export type Values = {
    content: string;
    name: string;
    description: string;
    reader: string;
    configureChunking: boolean;
    metadata: MetadataEntry[];
  };

  export type Options = {
    /**
     * Is modal open
     */
    isOpen: boolean;

    /**
     * Callback function for the Close button
     */
    onClose: () => void;

    /**
     * Callback function for the Back button
     */
    onBack?: () => void;
    defaultReader?: string;
    onSubmit?: (values: Values) => void | Promise<void>;
  };
}
