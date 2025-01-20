import React from "react";
import Markdown, { ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCopy, FaRegCopy } from "react-icons/fa";

const ResponseRenderer = ({
  summaryRef,
  syntaxHighlighterRef,
  summary,
  loading,
  className,
}: {
  summaryRef: React.RefObject<HTMLDivElement | null>;
  syntaxHighlighterRef: React.RefObject<SyntaxHighlighter | null>;
  summary: string;
  loading?: boolean;
  className?: string;
}) => {
  const [copySuccess, setCopySuccess] = React.useState(false);
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
    <section ref={summaryRef} className={`${className} relative`}>
      {loading && summary && (
        <div className="absolute inset-0 bg-slate-900/30 lg:grid lg:place-items-center h-full">
          <p className="text-2xl lg:text-4xl font-bold text-center text-slate-100 pt-20">
            Refreshing content...
          </p>
        </div>
      )}
      {summary && (
        <div
          className={`w-full p-2.5 border border-solid border-cyan-300 rounded-lg ${
            loading ? "select-none" : ""
          }`}
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(
                props: React.ClassAttributes<HTMLElement> &
                  React.HTMLAttributes<HTMLElement> &
                  ExtraProps,
              ) {
                const { children, className, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <div className="relative">
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() =>
                          handleCopyToClipboard(
                            String(children).replace(/\n$/, ""),
                          )
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
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
            className="prose prose-base w-full max-w-full"
          >
            {summary}
          </Markdown>
        </div>
      )}
    </section>
  );
};

export default ResponseRenderer;
