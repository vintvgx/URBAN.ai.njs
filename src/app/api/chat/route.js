/* eslint-disable @typescript-eslint/no-unused-vars */
import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { marked } from "marked"; // For parsing markdown
import DOMPurify from "isomorphic-dompurify"; // For sanitizing HTML

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { userMessage, conversationHistory } = await request.json();

    // Enhanced system message to request structured responses
    // TODO: Fix chat request (messages are not responding using urban slang)
    // TODO: Update implementation to use structured content (blocks) while using urban slang
    const systemMessage = {
      role: "system",
      content: "You respond to queries using urban slang",
    };

    // {
    //   role: "system",
    //   content: `You are an AI that responds to queries using urban slang while maintaining clear structure.
    //             Format your responses using markdown when appropriate:
    //             - Use # for main headings
    //             - Use ## for subheadings
    //             - Use *** for emphasis
    //             - Use \`\`\` for code blocks (specify language)
    //             - Use > for quotes or important points
    //             - Use - or * for bullet points
    //             - Use numbered lists when sequence matters

    //             Always structure longer responses with headings and appropriate formatting.
    //             When sharing code, always specify the language and use proper code blocks.`,
    // };

    const messages = [
      systemMessage,
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      temperature: 0.7,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
    });

    const rawContent = response.choices[0].message.content;

    // Parse the markdown and extract different content types
    const parsedContent = await parseAndFormatContent(rawContent);

    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function parseAndFormatContent(rawContent) {
  // Parse markdown to HTML
  const html = DOMPurify.sanitize(marked(rawContent));

  // Detect code blocks and languages
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const codeMatches = [...rawContent.matchAll(codeBlockRegex)];
  const codeLanguages = codeMatches.map((match) => match[1]).filter(Boolean);

  // Parse content into blocks
  const blocks = parseContentBlocks(rawContent);

  return {
    content: {
      raw: rawContent, // Original markdown
      html: html, // Sanitized HTML
      blocks: blocks, // Structured blocks
    },
    metadata: {
      hasCode: codeLanguages.length > 0,
      codeLanguages: codeLanguages,
      format: "markdown",
    },
  };
}

function parseContentBlocks(content) {
  const blocks = [];
  const lines = content.split("\n");
  let currentBlock = null;

  for (const line of lines) {
    // Detect block type based on markdown syntax
    if (line.startsWith("# ")) {
      if (currentBlock)
        blocks.push({
          type: currentBlock.type,
          content: currentBlock.content.join("\n"),
        });
      currentBlock = { type: "heading1", content: [line.substring(2)] };
    } else if (line.startsWith("## ")) {
      if (currentBlock)
        blocks.push({
          type: currentBlock.type,
          content: currentBlock.content.join("\n"),
        });
      currentBlock = { type: "heading2", content: [line.substring(3)] };
    } else if (line.startsWith("```")) {
      if (currentBlock?.type === "code") {
        blocks.push({ type: "code", content: currentBlock.content.join("\n") });
        currentBlock = null;
      } else {
        if (currentBlock)
          blocks.push({
            type: currentBlock.type,
            content: currentBlock.content.join("\n"),
          });
        currentBlock = { type: "code", content: [] };
      }
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      if (currentBlock?.type !== "list") {
        if (currentBlock)
          blocks.push({
            type: currentBlock.type,
            content: currentBlock.content.join("\n"),
          });
        currentBlock = { type: "list", content: [line] };
      } else {
        currentBlock.content.push(line);
      }
    } else {
      if (!currentBlock) {
        currentBlock = { type: "paragraph", content: [line] };
      } else if (line.trim() === "" && currentBlock.type !== "code") {
        blocks.push({
          type: currentBlock.type,
          content: currentBlock.content.join("\n"),
        });
        currentBlock = null;
      } else {
        currentBlock.content.push(line);
      }
    }
  }

  if (currentBlock) {
    blocks.push({
      type: currentBlock.type,
      content: currentBlock.content.join("\n"),
    });
  }

  return blocks;
}
