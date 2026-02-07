"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef, useState } from "react";

/** Modifier key for tooltips: ⌘ on Mac, Ctrl on Windows/Linux */
function getModKey(): string {
  if (typeof navigator === "undefined") return "Ctrl";
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";
}

const UnderlineWithShortcut = Underline.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-u": () => this.editor.commands.toggleUnderline(),
    };
  },
});

const EDITOR_LINK_CLASS = "editor-link";

const LinkWithShortcut = Link.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-k": () => {
        const previous = this.editor.getAttributes("link").href;
        const url = window.prompt("URL", previous ?? "https://");
        if (url) this.editor.chain().focus().setLink({ href: url }).run();
        return true;
      },
      "Mod-Shift-k": () => {
        this.editor.chain().focus().unsetLink().run();
        return true;
      },
    };
  },
  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML: (element) =>
          (element as HTMLElement).getAttribute("href") ?? (element as HTMLElement).getAttribute("data-href"),
      },
      target: { default: this.options.HTMLAttributes?.target },
      rel: { default: this.options.HTMLAttributes?.rel },
      class: { default: this.options.HTMLAttributes?.class },
      title: { default: null },
    };
  },
  parseHTML() {
    return [
      { tag: "a[href]", getAttrs: (dom) => ((dom as HTMLElement).getAttribute("href") ? null : false) },
      {
        tag: `span.${EDITOR_LINK_CLASS}[data-href]`,
        getAttrs: (dom) => {
          const href = (dom as HTMLElement).getAttribute("data-href");
          return href ? { href } : false;
        },
      },
    ];
  },
  // Render as span (not anchor) so the browser never navigates; styled to look like a link
  renderHTML({ HTMLAttributes }) {
    const base = { ...this.options.HTMLAttributes, ...HTMLAttributes };
    const href = base.href;
    if (!href || href === "#") return ["span", { class: `${EDITOR_LINK_CLASS} ${base.class || ""}`.trim(), "data-href": "" }, 0];
    const { href: _h, ...rest } = base;
    return [
      "span",
      {
        class: `${EDITOR_LINK_CLASS} ${rest.class || ""}`.trim(),
        "data-href": href,
        ...rest,
      },
      0,
    ];
  },
});

const FANTASY_COLORS = [
  { name: "Gold", value: "#c9a227" },
  { name: "Muted gold", value: "#8b7355" },
  { name: "Light", value: "#e8e4df" },
  { name: "Muted", value: "#6b6560" },
  { name: "Red", value: "#a63d3d" },
  { name: "Green", value: "#4a6b4a" },
];

export type CodexEntryOption = { slug: string; title: string };

type Props = {
  defaultValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  /** When set, toolbar shows "Link to codex" to insert links to other entries by slug. */
  codexEntries?: CodexEntryOption[];
};

function Toolbar({ editor, codexEntries }: { editor: Editor | null; codexEntries?: CodexEntryOption[] }) {
  const [codexDropdownOpen, setCodexDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("URL", previous ?? "https://");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const insertCodexLink = useCallback(
    (slug: string, title: string) => {
      if (!editor) return;
      const href = `/codex/${encodeURIComponent(slug)}`;
      editor.chain().focus();
      const { empty } = editor.state.selection;
      if (empty) {
        const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        editor.chain().insertContent(`<a href="${href}">${safeTitle}</a>`).run();
      } else {
        editor.chain().setLink({ href }).run();
      }
      setCodexDropdownOpen(false);
    },
    [editor]
  );

  useEffect(() => {
    if (!codexDropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setCodexDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [codexDropdownOpen]);

  if (!editor) return null;
  const mod = getModKey();

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-alterun-border bg-alterun-bg-card/80 px-2 py-1.5">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title={`Bold (${mod}+B)`}
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title={`Italic (${mod}+I)`}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title={`Underline (${mod}+U)`}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <span className="w-px h-5 bg-alterun-border mx-0.5" aria-hidden />
      <ToolbarButton onClick={setLink} isActive={editor.isActive("link")} title={`Link (${mod}+K)`}>
        <LinkIcon />
      </ToolbarButton>
      {codexEntries && codexEntries.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <ToolbarButton
            onClick={() => setCodexDropdownOpen((open) => !open)}
            isActive={codexDropdownOpen}
            title="Link to codex entry (pick from list)"
          >
            <CodexLinkIcon />
          </ToolbarButton>
          {codexDropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-72 overflow-auto rounded border border-alterun-border bg-alterun-bg-card py-1 shadow-lg">
              <p className="px-3 py-1.5 text-sm text-alterun-muted">Link to codex entry</p>
              <ul className="border-t border-alterun-border">
                {codexEntries.map((entry) => (
                  <li key={entry.slug}>
                    <button
                      type="button"
                      onClick={() => insertCodexLink(entry.slug, entry.title)}
                      className="w-full px-3 py-2 text-left text-alterun-muted hover:bg-alterun-gold/10 hover:text-alterun-gold transition-colors"
                    >
                      <span className="font-medium">{entry.title}</span>
                      <span className="ml-2 text-sm text-alterun-muted/80">/codex/{entry.slug}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        isActive={false}
        title={`Remove link (${mod}+⇧+K)`}
      >
        <UnlinkIcon />
      </ToolbarButton>
      <span className="w-px h-5 bg-alterun-border mx-0.5" aria-hidden />
      <div className="flex items-center gap-1">
        <span className="text-alterun-muted text-sm px-1" title="Text color (no shortcut)">
          Color
        </span>
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

function CodexLinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78 1.89A2 2 0 0 1 5 14.24V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v10.24a2 2 0 0 1-1.11 1.79l-1.78-1.89A2 2 0 0 1 15 10.76V17" />
    </svg>
  );
}

/** Floating toolbar shown when cursor is on a link: edit URL inline or remove */
function LinkBubbleContent({ editor, modKey }: { editor: Editor; modKey: string }) {
  const href = editor.getAttributes("link").href ?? "";
  const [isEditing, setIsEditing] = useState(false);
  const [draftUrl, setDraftUrl] = useState(href);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep draft in sync when bubble shows for a different link
  useEffect(() => {
    setDraftUrl(href);
  }, [href]);

  useEffect(() => {
    if (isEditing) {
      setDraftUrl(href);
      inputRef.current?.focus();
      // Don't select: leave text unhighlighted so it's readable when the bubble opens
    }
  }, [isEditing, href]);

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleSave() {
    const url = draftUrl.trim();
    if (url) editor.chain().focus().setLink({ href: url }).run();
    setIsEditing(false);
  }

  function handleCancel() {
    setDraftUrl(href);
    setIsEditing(false);
  }

  function handleRemove() {
    editor.chain().focus().unsetLink().run();
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 min-w-[280px]">
        <label className="text-xs text-alterun-muted uppercase tracking-wider">Edit URL</label>
        <input
          ref={inputRef}
          type="url"
          value={draftUrl}
          onChange={(e) => setDraftUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          placeholder="https://"
          className="w-full rounded border border-alterun-border bg-alterun-bg px-2.5 py-1.5 text-sm text-[#e8e4df] placeholder-alterun-muted/60 focus:border-alterun-gold/50 focus:outline-none focus:ring-1 focus:ring-alterun-gold/30 selection:bg-alterun-gold/30 selection:text-alterun-bg"
          aria-label="Link URL"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="rounded px-2.5 py-1.5 text-sm bg-alterun-gold/20 text-alterun-gold border border-alterun-gold/40 hover:bg-alterun-gold/30 transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded px-2.5 py-1.5 text-sm text-alterun-muted hover:bg-alterun-gold/15 hover:text-alterun-gold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleEditClick}
        className="rounded px-2.5 py-1.5 text-sm text-alterun-muted hover:bg-alterun-gold/15 hover:text-alterun-gold transition-colors"
        title={`Edit link (${modKey}+K)`}
      >
        Edit link
      </button>
      <span className="w-px h-4 bg-alterun-border" aria-hidden />
      <button
        type="button"
        onClick={handleRemove}
        className="rounded px-2.5 py-1.5 text-sm text-alterun-muted hover:bg-alterun-gold/15 hover:text-alterun-gold transition-colors"
        title={`Remove link (${modKey}+⇧+K)`}
      >
        Remove link
      </button>
      <span className="ml-2 text-alterun-muted/70 text-xs whitespace-nowrap" title={`${modKey}+click to open link`}>
        {modKey}+click to open
      </span>
    </>
  );
}

export function RichTextEditor({
  defaultValue = "",
  onChange,
  placeholder = "Chronicle text…",
  className = "",
  minHeight = "14rem",
  codexEntries,
}: Props) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      LinkWithShortcut.configure({ openOnClick: false, HTMLAttributes: { class: "text-alterun-gold underline hover:text-alterun-gold-muted" } }),
      UnderlineWithShortcut,
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

  // Editor "links" are spans with data-href; open URL only on Ctrl/Cmd+click
  useEffect(() => {
    function handleLinkClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const inProseMirror = target.closest(".ProseMirror");
      const span = target.closest(`.${EDITOR_LINK_CLASS}`);
      if (!inProseMirror || !span) return;
      e.preventDefault();
      e.stopPropagation();
      const modifierHeld = e.ctrlKey || e.metaKey;
      if (modifierHeld) {
        const url = span.getAttribute("data-href");
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      }
    }
    document.addEventListener("click", handleLinkClick, true);
    document.addEventListener("auxclick", handleLinkClick, true);
    return () => {
      document.removeEventListener("click", handleLinkClick, true);
      document.removeEventListener("auxclick", handleLinkClick, true);
    };
  }, []);

  useEffect(() => {
    if (!editor || !onChangeRef.current) return;
    const sync = () => {
      let html = editor.getHTML();
      if (html === "<p></p>") return;
      // Convert editor span.editor-link back to <a> so saved content has real links (attribute order may vary)
      html = html.replace(
        /<span\s+([^>]*?)>([\s\S]*?)<\/span>/gi,
        (_match, attrs, content) => {
          if (attrs.includes(EDITOR_LINK_CLASS) && attrs.includes("data-href=")) {
            const hrefMatch = attrs.match(/data-href="([^"]*)"/);
            if (hrefMatch?.[1]) return `<a href="${hrefMatch[1]}">${content}</a>`;
          }
          return _match;
        }
      );
      onChangeRef.current?.(html);
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
    <div
      className={`overflow-hidden rounded-lg border border-alterun-border bg-alterun-bg ${className}`}
      style={{ minHeight }}
    >
      <Toolbar editor={editor} codexEntries={codexEntries} />
      <EditorContent editor={editor} />
      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor: e }) => e.isActive("link")}
          options={{ placement: "top", strategy: "absolute" }}
          className="flex items-center gap-0.5 rounded border border-alterun-border bg-alterun-bg-card px-1 py-1 shadow-lg"
        >
          <LinkBubbleContent editor={editor} modKey={getModKey()} />
        </BubbleMenu>
      )}
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
        .ProseMirror a,
        .ProseMirror span.editor-link {
          color: var(--color-gold);
          text-decoration: underline;
        }
        .ProseMirror a:hover,
        .ProseMirror span.editor-link:hover {
          color: var(--color-gold-muted);
        }
      `}</style>
    </div>
  );
}
