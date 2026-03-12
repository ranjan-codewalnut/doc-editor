import { useState, useRef } from "react";
import type { Editor } from "@tiptap/react";

interface ImagePopoverProps {
  editor: Editor;
  onClose: () => void;
}

function ImagePopover({ editor, onClose }: ImagePopoverProps) {
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertImageFromUrl = () => {
    if (url.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      editor.chain().focus().setImage({ src: dataUrl }).run();
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      insertImageFromUrl();
    }
    if (event.key === "Escape") {
      onClose();
    }
  };

  const tabClass = (tab: "upload" | "url") =>
    `flex-1 py-1.5 text-sm text-center cursor-pointer transition-colors ${
      activeTab === tab
        ? "text-blue-600 border-b-2 border-blue-600 font-medium"
        : "text-gray-500 hover:text-gray-700"
    }`;

  return (
    <div
      className="absolute top-full right-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
      style={{ width: 320 }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-3">
        <button
          type="button"
          className={tabClass("upload")}
          onMouseDown={(event) => {
            event.preventDefault();
            setActiveTab("upload");
          }}
        >
          Upload
        </button>
        <button
          type="button"
          className={tabClass("url")}
          onMouseDown={(event) => {
            event.preventDefault();
            setActiveTab("url");
          }}
        >
          By URL
        </button>
      </div>

      {activeTab === "upload" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-6 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-colors"
          >
            Click to choose an image
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com/image.png"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
          />
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              insertImageFromUrl();
            }}
            className="w-full mt-2 px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer transition-colors"
          >
            Insert
          </button>
        </div>
      )}
    </div>
  );
}

export default ImagePopover;
