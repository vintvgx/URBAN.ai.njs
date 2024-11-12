import { FormattedContent } from "@/lib/chat/types";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const RichTextRenderer = ({ content }: { content: FormattedContent }) => {
  return (
    <div className="space-y-4">
      {content.content.blocks?.map((block, index) => {
        switch (block.type) {
          case "heading1":
            return (
              <h1 key={index} className="text-2xl font-bold">
                {block.content}
              </h1>
            );
          case "heading2":
            return (
              <h2 key={index} className="text-xl font-semibold">
                {block.content}
              </h2>
            );
          case "code":
            return (
              <div key={index} className="rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language={content.metadata.codeLanguages[0] || "javascript"}
                  style={vscDarkPlus}
                  className="text-sm">
                  {block.content}
                </SyntaxHighlighter>
              </div>
            );
          case "list":
            return (
              <ul key={index} className="list-disc list-inside space-y-1">
                {block.content.split("\n").map((item, i) => (
                  <li key={i}>{item.replace(/^[*-] /, "")}</li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={index} className="text-base">
                {block.content}
              </p>
            );
        }
      })}
    </div>
  );
};

export default RichTextRenderer;
