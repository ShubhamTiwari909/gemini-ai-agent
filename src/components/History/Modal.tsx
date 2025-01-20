"use client";
import React, { useRef } from "react";
import ResponseRenderer from "../Gemini/ResponseRenderer";
import SyntaxHighlighter from "react-syntax-highlighter";
import { History } from "./HistoryWrapper";

const Modal = ({
  activeHistory,
  modalRef,
}: {
  activeHistory: History | null;
  modalRef: React.RefObject<HTMLDialogElement | null>;
}) => {
  const syntaxHighlighterRef = useRef<SyntaxHighlighter>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <dialog ref={modalRef} id="history-modal" className="modal">
        <div className="modal-box max-w-7xl relative p-0">
          <div className="flex items-center justify-between mb-5 sticky top-0 bg-base-300 z-10 w-full p-3 lg:p-5">
            <h3 className="font-bold text-lg text-ellipsis line-clamp-1">
              {activeHistory?.prompt}
            </h3>
            <div className="modal-action mt-0">
              <form method="dialog">
                <button className="btn btn-error btn-sm">Close</button>
              </form>
            </div>
          </div>
          <ResponseRenderer
            summaryRef={summaryRef}
            syntaxHighlighterRef={syntaxHighlighterRef}
            summary={activeHistory?.response || ""}
            className="p-3 lg:p-5"
          />
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
