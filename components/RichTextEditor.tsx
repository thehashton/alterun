"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef } from "react";

const FANTASY_COLORS = [
  { name: "Gold", value: "#c9a227" },
  { name: "Muted gold", value: "#8b7355" },
  { name: "Light", value: "#e8e4df" },
  { name: "Muted", value: "#6b6560" },
  { name: "Red", value: "#a63d3d" },
  { name: "Green", value: "#4a6b4a" },
];

type Props = {
  defaultValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
};

function Toolbar({ editor }: { editor: Editor | null }) {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("URL", previous ?? "https://");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-alterun-border bg-alterun-bg-card/80 px-2 py-1.5">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline"
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <span className="w-px h-5 bg-alterun-border mx-0.5" aria-hidden />
      <ToolbarButton onClick={setLink} isActive={editor.isActive("link")} title="Link">
        <LinkIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        isActive={false}
        title="Remove link"
      >
        <UnlinkIcon />
      </ToolbarButton>
      <span className="w-px h-5 bg-alterun-border mx-0.5" aria-hidden />
      <div className="flex items-center gap-1">
        <span className="text-alterun-muted text-sm px-1">Color</span>
        {FANTASY_COLORS.map(({ name, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => editor.chain().focus().setColor(value).run()}
            className="h-6 w-6 rounded border border-alterun-border hover:border-alterun-gold/50 focus:outline-none focus:ring-1 focus:ring-alterun-gold/50"
            style={{ backgroundColor: value }}
            title={name}
            aria-label={name}
          />
        ))}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="text-alterun-muted text-sm px-1.5 hover:text-alterun-gold"
          title="Reset color"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  isActive,
  title,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-xl transition-colors ${
        isActive
          ? "bg-alterun-gold/20 text-alterun-gold border border-alterun-gold/40"
          : "text-alterun-muted hover:text-alterun-gold hover:border-alterun-gold/30 border border-transparent"
      }`}
    >
      {children}
    </button>
  );
}

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function UnlinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71" />
      <path d="m5.17 11.75-1.72 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71" />
      <line x1="8" y1="16" x2="16" y2="8" />
    </svg>
  );
}

export function RichTextEditor({
  defaultValue = "",
  onChange,
  placeholder = "Chronicle text…",
  className = "",
  minHeight = "14rem",
}: Props) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-alterun-gold underline hover:text-alterun-gold-muted" } }),
      Underline,
      TextStyle,
      Color,
    ],
    content: defaultValue || undefined,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[14rem] px-4 py-3 text-xl text-alterun-muted font-body",
      },
    },
  });

  useEffect(() => {
    if (!editor || !onChangeRef.current) return;
    const sync = () => {
      const html = editor.getHTML();
      if (html !== "<p></p>") onChangeRef.current?.(html);
    };
    sync();
    editor.on("blur", sync);
    editor.on("update", sync);
    return () => {
      editor.off("blur", sync);
      editor.off("update", sync);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || defaultValue === undefined) return;
    if (editor.getHTML() !== defaultValue) editor.commands.setContent(defaultValue ?? "", { emitUpdate: false });
  }, [defaultValue, editor]);

  return (
    <div className={`overflow-hidden rounded-lg border border-alterun-border bg-alterun-bg ${className}`} style={{ minHeight }}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <style jsx global>{`
        .ProseMirror {
          min-height: ${minHeight};
        }
        .ProseMirror p.is-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--color-muted);
          pointer-events: none;
          height: 0;
        }
        .ProseMirror a {
          color: var(--color-gold);
          text-decoration: underline;
        }
        .ProseMirror a:hover {
          color: var(--color-gold-muted);
        }
      `}</style>
    </div>
  );
}
