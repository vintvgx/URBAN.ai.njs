import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';

interface FormattedContent {
  content: {
    raw: string;
    html: string;
    blocks?: {
      type: string;
      content: string;
    }[];
  };
  metadata: {
    hasCode: boolean;
    codeLanguages: string[];
    format: string;
  };
}

/**
 * File displays content using RichText.
 *  - content is initially displayed html elements, uses blocks if html is not available
 */
const RichTextRenderer = ({ content }: { content: FormattedContent }) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.type === 'tag') {
        // Remove text nodes that only contain whitespace/newlines
        const children = domNode.children?.filter((child: any) => 
          !(child.type === 'text' && child.data.trim() === '')
        );

        switch (domNode.name) {
          case 'h1':
            return (
              <h1 className="text-2xl font-bold">{domToReact(children, options)}</h1>
            );
          case 'h2':
            return (
              <h2 className="text-xl font-semibold">{domToReact(children, options)}</h2>
            );
          case 'ul':
            return (
              <ul className="list-disc list-inside space-y-1">{domToReact(children, options)}</ul>
            );
          case 'li':
            return (
              <li className="ml-4">{domToReact(children, options)}</li>
            );
          case 'pre':
            if (children?.[0]?.name === 'code') {
              const language = children[0].attribs?.class?.replace('language-', '') || 'javascript';
              const codeContent = children[0].children[0]?.data?.trim() || '';
              return (
                <div className="rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    className="text-sm"
                  >
                    {codeContent}
                  </SyntaxHighlighter>
                </div>
              );
            }
            return null;
          case 'p':
            return (
              <p className="text-base">{domToReact(children, options)}</p>
            );
        }
      }
    }
  };

  // Clean up HTML content by removing extra newlines and spaces between tags
  const cleanHtml = content.content.html?.replace(/>\s+</g, '><').trim();

  // If HTML content is available, prefer it over blocks
  if (cleanHtml) {
    return <div className="space-y-4">{parse(cleanHtml, options)}</div>;
  }

  // Fallback to blocks-based rendering if no HTML is available
  return (
    <div className="space-y-4">
      {content.content.blocks?.map((block, index) => {
        switch (block.type) {
          case "heading1":
            return (
              <h1 key={index} className="text-2xl font-bold">
                {block.content.trim()}
              </h1>
            );
          case "heading2":
            return (
              <h2 key={index} className="text-xl font-semibold">
                {block.content.trim()}
              </h2>
            );
          case "code":
            return (
              <div key={index} className="rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language={content.metadata.codeLanguages[0] || "javascript"}
                  style={vscDarkPlus}
                  className="text-sm"
                >
                  {block.content.trim()}
                </SyntaxHighlighter>
              </div>
            );
          case "list":
            return (
              <ul key={index} className="list-disc list-inside space-y-1">
                {block.content.split("\n").map((item, i) => (
                  <li key={i} className="ml-4">
                    {item.replace(/^[*-] /, "").trim()}
                  </li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={index} className="text-base">
                {block.content.trim()}
              </p>
            );
        }
      })}
    </div>
  );
};

export default RichTextRenderer;