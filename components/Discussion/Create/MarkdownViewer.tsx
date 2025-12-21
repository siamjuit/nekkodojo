"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";

interface Props {
  content: string;
}

export default function MarkdownViewer({ content }: Props) {
  return (
    <article className="prose prose-invert max-w-none leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // Supports tables, strikethrough, links
        components={{
          // Customizing the Link (<a> tag)
          a: ({ node, children, href, ...props }) => {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d4af37] hover:underline inline-flex items-center gap-1 font-medium transition-colors hover:text-[#e5c158]"
                {...props}
              >
                {children}
                <ExternalLink size={12} className="opacity-70" />
              </a>
            );
          },
          // Customizing Headers
          h1: ({ children }) => <h1 className="text-2xl font-bold text-[#eaddcf] mt-6 mb-4 border-b border-[#3e2723] pb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold text-[#eaddcf] mt-5 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold text-[#d4af37] mt-4 mb-2">{children}</h3>,
          
          // Customizing Paragraphs
          p: ({ children }) => <p className="mb-4 text-[#eaddcf]/90">{children}</p>,

          // Customizing Code Blocks
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            return isInline ? (
              // Inline Code (e.g. `const a = 5`)
              <code
                className="bg-[#1a110d] text-[#d4af37] px-1.5 py-0.5 rounded border border-[#3e2723] font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            ) : (
              // Block Code
              <div className="relative my-4 rounded-lg overflow-hidden border border-[#3e2723] bg-[#0f0b0a]">
                <div className="flex items-center justify-between px-4 py-2 bg-[#1a110d] border-b border-[#3e2723]">
                   <span className="text-xs text-[#a1887f] font-mono lowercase">
                     {match?.[1] || "code"}
                   </span>
                </div>
                <pre className="p-4 overflow-x-auto bg-[#0f0b0a] text-sm text-[#eaddcf] font-mono scrollbar-thin scrollbar-thumb-[#3e2723] scrollbar-track-transparent">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },

          // Customizing Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#d4af37] pl-4 italic text-[#a1887f] my-6 bg-[#1a110d]/30 py-2 pr-2 rounded-r">
              {children}
            </blockquote>
          ),

          // Customizing Lists
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-[#eaddcf] mb-4 ml-2 marker:text-[#d4af37]">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-[#eaddcf] mb-4 ml-2 marker:text-[#d4af37]">{children}</ol>,
          
          // Customizing Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 border border-[#3e2723] rounded-lg">
               <table className="w-full text-left text-sm text-[#eaddcf]">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#1a110d] text-[#d4af37] font-bold uppercase tracking-wider">{children}</thead>,
          tr: ({ children }) => <tr className="border-b border-[#3e2723] last:border-0 hover:bg-[#1a110d]/50 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-6 py-3">{children}</th>,
          td: ({ children }) => <td className="px-6 py-4">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}