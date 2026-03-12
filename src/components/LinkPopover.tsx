import { useState, useRef } from "react";
import type { Editor } from "@tiptap/react";

interface LinkPopoverProps {
  editor: Editor;
  onClose: () => void;
}

function LinkPopover({ editor, onClose }: LinkPopoverProps) {
  const existingHref = (editor.getAttributes("link").href as string) || "";
  const [url, setUrl] = useState(existingHref);

  // Save the editor selection before the input steals focus
  const savedSelectionRef = useRef(editor.state.selection);

  const applyLink = () => {
    if (url.trim()) {
      const { from, to } = savedSelectionRef.current;
      editor
        .chain()
        .focus()
        .setTextSelection({ from, to })
        .setLink({ href: url.trim() })
        .run();
    }
    onClose();
  };

  const removeLink = () => {
    const { from, to } = savedSelectionRef.current;
    editor
      .chain()
      .focus()
      .setTextSelection({ from, to })
      .unsetLink()
      .run();
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyLink();
    }
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
      style={{ width: 300 }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <input
        autoFocus
        type="text"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://example.com"
        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
      />
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            applyLink();
          }}
          className="flex-1 px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer transition-colors"
        >
          Apply
        </button>
        {existingHref && (
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              removeLink();
            }}
            className="flex-1 px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 cursor-pointer transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default LinkPopover;
