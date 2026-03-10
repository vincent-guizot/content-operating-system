import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

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
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Minus,
  Eraser,
} from "lucide-react";

export default function ArticleEditor({ content, setContent }) {
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,

      Image,

      Link.configure({
        openOnClick: false,
      }),

      Underline,

      HorizontalRule,

      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),
    ],

    content: content || "<p></p>",

    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },

    editorProps: {
      handlePaste(view, event) {
        const text = event.clipboardData.getData("text/plain");

        // auto detect image url
        if (text && text.match(/\.(jpeg|jpg|png|gif|webp)$/)) {
          event.preventDefault();

          editor.chain().focus().setImage({ src: text }).run();

          return true;
        }

        // allow normal html paste
        return false;
      },
    },
  });

  if (!editor) return null;

  const btn = (active) =>
    `p-2 rounded hover:bg-[#e7d6b2] ${active ? "bg-[#d9c39a]" : ""}`;

  const divider = <div className="w-px h-5 bg-[#e3d3a9] mx-1" />;

  const addImage = () => {
    if (!imageUrl) return;

    editor.chain().focus().setImage({ src: imageUrl }).run();

    setImageUrl("");
  };

  const addLink = () => {
    const url = prompt("Enter URL");

    if (!url) return;

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border border-[#B08968] rounded bg-[#fffdf4] flex flex-col h-full">
      {/* TOOLBAR */}

      <div className="flex flex-wrap items-center gap-1 border-b border-[#e3d3a9] p-2 bg-[#fdf6e3]">
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

        {divider}

        {/* HEADINGS */}

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

        {divider}

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
          <UnderlineIcon size={16} />
        </button>

        <button onClick={addLink} className={btn(editor.isActive("link"))}>
          <LinkIcon size={16} />
        </button>

        {divider}

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

        {divider}

        {/* BLOCK */}

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btn(editor.isActive("blockquote"))}
        >
          <Quote size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={btn(editor.isActive("codeBlock"))}
        >
          <Code size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 hover:bg-[#e7d6b2] rounded"
        >
          <Minus size={16} />
        </button>

        {divider}

        {/* CLEAR FORMAT */}

        <button
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
          className="p-2 hover:bg-[#e7d6b2] rounded"
        >
          <Eraser size={16} />
        </button>

        {divider}

        {/* IMAGE */}

        <div className="flex items-center gap-2 ml-2">
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
        className="flex-1 p-6 overflow-y-auto cursor-text prose max-w-none"
      />
    </div>
  );
}
