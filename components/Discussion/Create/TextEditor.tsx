"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  Code,
  List,
  ListOrdered,
  Quote,
  Eye,
  Edit3,
  Heading1, // New
  Heading2, // New
  Heading3, // New
  Underline, // New
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // Import this to preview underlines in the "Preview" tab

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, label }: Props) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const before = value.substring(0, start);
    const after = value.substring(end);

    const newValue = `${before}${prefix}${selectedText}${suffix}${after}`;

    onChange(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-bold text-[#d4af37] uppercase tracking-widest">
            {label}
          </label>
        )}

        <div className="flex bg-[#1a110d] rounded-lg p-1 border border-[#3e2723]">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all
              ${
                activeTab === "write"
                  ? "bg-[#d4af37] text-[#1a110d] shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                  : "text-[#a1887f] hover:text-[#d4af37]"
              }
            `}
          >
            <Edit3 size={12} /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all
              ${
                activeTab === "preview"
                  ? "bg-[#d4af37] text-[#1a110d] shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                  : "text-[#a1887f] hover:text-[#d4af37]"
              }
            `}
          >
            <Eye size={12} /> Preview
          </button>
        </div>
      </div>
      <div className="border border-[#3e2723] rounded-xl overflow-hidden bg-[#0f0b0a]/50 focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/50 transition-all">
        {activeTab === "write" && (
          <div className="flex items-center gap-1 p-2 border-b border-[#3e2723] bg-[#1a110d]/50 overflow-x-auto custom-scrollbar">
            {/* Headers Group */}
            <ToolbarButton
              icon={<Heading1 size={16} />}
              onClick={() => insertFormat("# ")}
              tooltip="Heading 1"
            />
            <ToolbarButton
              icon={<Heading2 size={16} />}
              onClick={() => insertFormat("## ")}
              tooltip="Heading 2"
            />
            <ToolbarButton
              icon={<Heading3 size={16} />}
              onClick={() => insertFormat("### ")}
              tooltip="Heading 3"
            />
            <div className="w-px h-5 bg-[#3e2723] mx-1" />

            {/* Formatting Group */}
            <ToolbarButton
              icon={<Bold size={16} />}
              onClick={() => insertFormat("**", "**")}
              tooltip="Bold"
            />
            <ToolbarButton
              icon={<Italic size={16} />}
              onClick={() => insertFormat("*", "*")}
              tooltip="Italic"
            />
            <ToolbarButton
              icon={<Underline size={16} />}
              onClick={() => insertFormat("<u>", "</u>")}
              tooltip="Underline"
            />

            <div className="w-px h-5 bg-[#3e2723] mx-1" />

            <ToolbarButton
              icon={<LinkIcon size={16} />}
              onClick={() => insertFormat("[", "](url)")}
              tooltip="Link"
            />
            <ToolbarButton
              icon={<Quote size={16} />}
              onClick={() => insertFormat("> ")}
              tooltip="Blockquote"
            />
            <ToolbarButton
              icon={<Code size={16} />}
              onClick={() => insertFormat("`", "`")}
              tooltip="Code"
            />

            <div className="w-px h-5 bg-[#3e2723] mx-1" />

            <ToolbarButton
              icon={<List size={16} />}
              onClick={() => insertFormat("- ")}
              tooltip="Bullet List"
            />
            <ToolbarButton
              icon={<ListOrdered size={16} />}
              onClick={() => insertFormat("1. ")}
              tooltip="Ordered List"
            />
          </div>
        )}
        <div className="relative min-h-[250px]">
          {activeTab === "write" ? (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "Share your wisdom, Ronin..."}
              className="w-full h-full min-h-[250px] p-4 bg-transparent text-[#eaddcf] placeholder:text-[#5d4037] resize-y focus:outline-none font-mono text-sm"
            />
          ) : (
            // Updated Internal Preview to handle HTML (for underline)
            <div className="p-4 prose prose-invert prose-p:text-[#eaddcf] prose-headings:text-[#d4af37] prose-a:text-[#d4af37] prose-code:text-[#d4af37] max-w-none min-h-[250px] overflow-y-auto">
              {value ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]} // Enable HTML parsing for <u>
                  components={{
                    // Pass specific styling for 'u' tag in preview
                    u: ({ children }) => (
                      <u className="decoration-[#d4af37] decoration-2 underline-offset-4">
                        {children}
                      </u>
                    ),
                    // ... (Keep existing ul, ol, a, etc. from your code if you wish, or rely on prose defaults for preview)
                  }}
                >
                  {value}
                </ReactMarkdown>
              ) : (
                <p className="text-[#5d4037] italic">Nothing to preview yet...</p>
              )}
            </div>
          )}
        </div>
        <div className="bg-[#1a110d]/30 p-2 border-t border-[#3e2723] flex justify-between items-center text-[10px] text-[#5d4037] px-4 font-mono">
          <span>MARKDOWN SUPPORTED</span>
          <span>{value.length} CHARS</span>
        </div>
      </div>
    </div>
  );
}

const ToolbarButton = ({
  icon,
  onClick,
  tooltip,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={tooltip}
    className="p-1.5 text-[#a1887f] hover:text-[#d4af37] hover:bg-[#3e2723]/30 rounded transition-colors"
  >
    {icon}
  </button>
);
