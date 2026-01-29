import type {
  ReactNode
} from "react";

import {
  useMemo,
  useRef,
  useState
} from "react";

import {
  Button
} from "@/components/ui/button";

import {
  X,
  Trash2,
  Upload,
  Link2,
  File as FileIcon
} from "lucide-react";


function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export
function AddFileModal(options: AddFileModal.Options): ReactNode {
  // Expand the options
  const { isOpen, onClose, title, onItemsChange } = options;

  const [items, setItems] = useState<AddFileModal.Item[]>([]);
  const [url, setUrl] = useState<string>("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const headerTitle = useMemo(
    () => title ?? "Add files",
    [title]
  );

  if (!isOpen) return null;

  const emit = (next: AddFileModal.Item[]) => {
    setItems(next);
    onItemsChange?.(next);
  };

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const next: AddFileModal.Item[] = [
      ...items,
      ...Array.from(files).map((f) => ({
        id: crypto.randomUUID(),
        type: "file" as const,
        name: f.name,
        size: f.size,
        file: f,
      })),
    ];

    emit(next);
  };

  const addUrl = () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    const next: AddFileModal.Item[] = [
      ...items,
      {
        id: crypto.randomUUID(),
        type: "url",
        name: trimmed,
        url: trimmed,
      },
    ];

    emit(next);
    setUrl("");
  };

  const removeItem = (id: string) => {
    emit(items.filter((it) => it.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative z-10 w-[min(960px,calc(100vw-2rem))] rounded-2xl bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b">
          <h3 className="text-sm font-semibold truncate">{headerTitle}</h3>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-8 w-8 p-0 flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 flex gap-6 h-[70vh]">
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div
              className="flex-1 min-h-[220px] rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-100"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
            >
              <Upload className="h-5 w-5" />
              <div className="font-medium text-gray-800">Drag & drop a file</div>
              <div className="text-xs">or click to browse</div>

              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            <div className="rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Link2 className="h-4 w-4" />
                File URL
              </div>

              <div className="flex gap-2">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/file.pdf"
                  className="flex-1 h-9 rounded-md border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                />
                <Button type="button" variant="outline" onClick={addUrl}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 rounded-xl border border-gray-200 p-4 flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium text-gray-800">Uploaded items</div>
              <div className="text-xs text-gray-500">{items.length} item(s)</div>
            </div>

            <div className="mt-3 flex-1 overflow-auto rounded-lg border border-gray-100">
              {items.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">
                  No items yet
                </div>
              ) : (
                <div className="flex flex-col">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-3 px-3 py-2 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {it.type === "file" ? (
                          <FileIcon className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Link2 className="h-4 w-4 text-gray-600" />
                        )}

                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {it.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {it.type === "file"
                              ? formatBytes(it.size ?? 0)
                              : it.url}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeItem(it.id)}
                        className="h-8 w-8 p-0 flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                type="button"
                onClick={() => options.onContinue?.(items)}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export namespace AddFileModal {
  export type Item =
    | {
        id: string;
        type: "file";
        name: string;
        size: number;
        file: File;
      }
    | {
        id: string;
        type: "url";
        name: string;
        url: string;
      };

  export type Options = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    onItemsChange?: (items: Item[]) => void;
    onContinue?: (items: Item[]) => void;
  };
}
