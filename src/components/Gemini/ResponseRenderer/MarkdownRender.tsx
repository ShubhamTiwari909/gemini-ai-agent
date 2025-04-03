import React, { useRef } from "react";
import { FaCopy, FaRegCopy } from "react-icons/fa";
import Markdown, { ExtraProps } from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { childClasses } from "./ResponseRenderer";

const MarkdownRenderer = ({ summary }: { summary: string }) => {
  const [copySuccess, setCopySuccess] = React.useState(false);
  const syntaxHighlighterRef = useRef<SyntaxHighlighter>(null);

  const handleCopyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
  };
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Render a code block with syntax highlighting and a copy button
        code(
          props: React.ClassAttributes<HTMLElement> &
            React.HTMLAttributes<HTMLElement> &
            ExtraProps,
        ) {
          const { children, className, ...rest } = props;
          // Extract the language from the className
          const match = /language-(\w+)/.exec(className || "");

          return match ? (
            <div className="relative">
              <div className="absolute top-2 right-2">
                <button
                  onClick={() =>
                    handleCopyToClipboard(String(children).replace(/\n$/, ""))
                  }
                >
                  {copySuccess ? (
                    <div className="flex items-center gap-1">
                      <FaCopy size="1.5rem" /> Copied...
                    </div>
                  ) : (
                    <FaRegCopy size="1.5rem" />
                  )}
                </button>
              </div>
              {/* Use SyntaxHighlighter to display the code with styling */}
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                language={match[1]}
                style={atomDark}
                ref={syntaxHighlighterRef}
                showLineNumbers
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            // Render a plain code element if no language is specified
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
        a: ({ className, children, ...props }) => {
          return (
            <a
              {...props}
              className={className}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
      }}
      className={childClasses.markdown}
    >
      {summary}
    </Markdown>
  );
};

export default MarkdownRenderer;
