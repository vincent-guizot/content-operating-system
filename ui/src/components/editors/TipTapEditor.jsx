import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import UnderlineExt from "@tiptap/extension-underline";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Undo,
  Redo,
  ImagePlus,
  Underline,
} from "lucide-react";

export default function ArticleEditor({ content, setContent }) {
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, Image, UnderlineExt],

    content: content || "<p></p>",
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },

    editorProps: {
      handlePaste(view, event) {
        const text = event.clipboardData.getData("text/plain");

        // jika paste image url
        if (text && text.match(/\.(jpeg|jpg|png|gif)$/)) {
          event.preventDefault();

          editor.chain().focus().setImage({ src: text }).run();

          return true;
        }

        // biarkan tiptap handle paste html default
        return false;
      },
    },
  });

  if (!editor) return null;

  const btn = (active) =>
    `p-2 rounded hover:bg-[#e7d6b2] ${active ? "bg-[#d9c39a]" : ""}`;

  const addImage = () => {
    if (!imageUrl) return;

    editor.chain().focus().setImage({ src: imageUrl }).run();

    setImageUrl("");
  };

  return (
    <div className="border border-[#B08968] rounded bg-[#fffdf4] flex flex-col h-full">
      {/* TOOLBAR */}

      <div className="flex flex-wrap gap-1 border-b border-[#e3d3a9] p-2 bg-[#fdf6e3]">
        {/* UNDO REDO */}

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 hover:bg-[#e7d6b2] rounded"
        >
          <Undo size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 hover:bg-[#e7d6b2] rounded"
        >
          <Redo size={16} />
        </button>

        {/* HEADING */}

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={btn(editor.isActive("heading", { level: 1 }))}
        >
          <Heading1 size={16} />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btn(editor.isActive("heading", { level: 2 }))}
        >
          <Heading2 size={16} />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={btn(editor.isActive("heading", { level: 3 }))}
        >
          <Heading3 size={16} />
        </button>

        {/* TEXT */}

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btn(editor.isActive("underline"))}
        >
          <Underline size={16} />
        </button>
        {/* LIST */}

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive("bulletList"))}
        >
          <List size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive("orderedList"))}
        >
          <ListOrdered size={16} />
        </button>

        {/* QUOTE */}

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btn(editor.isActive("blockquote"))}
        >
          <Quote size={16} />
        </button>

        {/* CODE */}

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={btn(editor.isActive("codeBlock"))}
        >
          <Code size={16} />
        </button>

        {/* IMAGE */}

        <div className="flex items-center gap-2 ml-4">
          <ImagePlus size={16} />

          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="text-xs border border-[#B08968] rounded px-2 py-1 w-40"
          />

          <button
            onClick={addImage}
            className="text-xs px-2 py-1 bg-[#F97316] text-white rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* EDITOR */}

      <EditorContent
        editor={editor}
        className="flex-1 p-6 overflow-y-auto cursor-text"
      />
    </div>
  );
}
