import {
  useState
} from "react";

import {
  useAppStore
} from "@/store";

import {
  Settings
} from "lucide-react";

import clsx from "clsx";

import {
  useShallow
} from 'zustand/react/shallow';

import {
  Switch
} from "@/components/ui/switch";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Returns a react component which renders the list of tools.
 */
function ToolMenuItems({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (name: string) => void;
}) {
  
  const availableTools = useAppStore((store) => store.tools);
  return (
    <>
      {availableTools.map((tool) => {
        const isChecked = selected.includes(tool.name);

        return (
          <DropdownMenuItem
            key={tool.name}
            onSelect={(e) => {
              e.preventDefault();
              onToggle(tool.name);
            }}
            className="flex justify-between"
          >
            <span>{tool.display_name}</span>
            <Switch
              checked={isChecked}
              className="pointer-events-none data-[state=checked]:!bg-bg-brand-default"
            />
          </DropdownMenuItem>
        );
      })}
    </>
  );
}

/**
 * A React component which renders the tool selector dropdown.
 *
 * This component hooks into the store to get the available tools.
 */
export
function ToolSelector(props: ToolSelector.Props) {
  const { tools, setTools } = props;

  const allToolNames = useAppStore(useShallow((store) => store.tools.map((tool) => tool.name)));

  const [isOpen, setIsOpen] = useState(false);

  const selectedCount = tools.length;
  const hasAnySelected = selectedCount > 0;

  // Toggle selection for a tool by name.
  const toggleToolSelection = (toolName: string) => {
    if (tools.includes(toolName)) {
      setTools(tools.filter(tool => tool !== toolName));
    } else {
      setTools([...tools, toolName]);
    }
  };


  // Return the rendered component.
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={clsx(
            "inline-flex items-center gap-2 rounded-md border text-sm font-medium",
            "h-8 px-3 box-border shadow-sm"
          )}
        >
          <Settings className="!text-text-neutral-default size-5 shrink-0" />
          <span>Tools</span>

          {selectedCount > 0 && (
            <span
              className={clsx(
                "inline-flex h-5 w-5 items-center justify-center",
                "rounded-full text-xs",
                "bg-bg-brand-default",
                "text-text-brand-on-brand"
              )}
            >
              {selectedCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuLabel>
          Available tools
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ToolMenuItems
          selected={tools}
          onToggle={toggleToolSelection}
        />

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            if (hasAnySelected) setTools([]);
            else setTools(allToolNames);
          }}
        >
          {hasAnySelected ? "Clear all" : "Select all"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export
namespace ToolSelector {

  /**
   * A type alias for the `ToolSelector` props.
   */
  export
  type Props = {
    /**
     * The selected tool for the selector.
     */
    readonly tools: string[];
    /**
     * The callback to set the selected tool.
     */
    readonly setTools: (tools: string[]) => void;
  };
}
