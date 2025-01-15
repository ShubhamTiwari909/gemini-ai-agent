"use client";
import { useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ContentSummarizer = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const syntaxHighlighterRef = useRef<SyntaxHighlighter>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/summarizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error summarizing content:", error);
      setSummary("An error occurred while summarizing.");
    } finally {
      setLoading(false);
      summaryRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste your text here..."
        rows={10}
        className="text-pretty textarea textarea-info w-full mb-6 lg:mb-10"
        disabled={loading}
      />
      <div className="text-center">
        <button
          onClick={handleSummarize}
          disabled={loading || !inputText}
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-10 py-3 text-lg font-medium text-white backdrop-blur-3xl">
            {loading ? (
              <p className="text-white flex items-center gap-x-3">
                Generating
                <span className="inline-block size-5 animate-spin rounded-full border-4 border-r-transparent border-solid border-current"></span>
              </p>
            ) : (
              "Generate"
            )}
          </span>
        </button>
      </div>
      <div ref={summaryRef}>
        {summary && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
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
      </div>
    </div>
  );
};

export default ContentSummarizer;
