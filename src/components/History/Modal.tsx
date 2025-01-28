"use client";
import React, { useRef } from "react";
import ResponseRenderer from "../Gemini/ResponseRenderer";
import { History } from "./HistoryWrapper";
import { useGlobalStore } from "@/store/global-store";
import {
  MdArrowOutward,
  MdClose,
  MdFileCopy,
  MdOutlineFileCopy,
} from "react-icons/md";
import Link from "next/link";

const Modal = ({
  activeHistory,
  modalRef,
}: {
  activeHistory: History | null;
  modalRef: React.RefObject<HTMLDialogElement | null>;
}) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const setIsPaused = useGlobalStore((state) => state.setIsSpeechPaused);
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.href}history/${activeHistory?._id}`,
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div>
      <dialog ref={modalRef} id="history-modal" className="modal">
        <div className="modal-box max-w-7xl relative p-0 !h-120 lg:!h-156">
          <div className="flex items-center justify-between sticky top-0 bg-base-300 z-10 w-full p-3 lg:p-5">
            <h3 className="font-bold text-lg text-ellipsis line-clamp-1 flex gap-x-3">
              <span className="line-clamp-2 text-balance max-w-3xl">
                {activeHistory?.prompt}
              </span>
            </h3>
            <div className="modal-action mt-0 gap-x-5 items-center">
              <Link
                className="btn btn-sm lg:btn-md btn-bordered btn-info"
                href={`/history/${activeHistory?._id}`}
              >
                <MdArrowOutward
                  color="text-base-content !size-4 lg:!size-5"
                  size="1.25rem"
                />
              </Link>
              <button onClick={handleCopyLink}>
                {copied ? (
                  <div className="flex items-center gap-x-1">
                    <MdFileCopy size="1.25rem" className="size-4 lg:size-5" />
                    Copied...
                  </div>
                ) : (
                  <MdOutlineFileCopy
                    size="1.25rem"
                    className="size-4 lg:size-5"
                  />
                )}
              </button>
              <form method="dialog">
                <button
                  onClick={() => {
                    const synth = window.speechSynthesis;
                    synth.cancel();
                    setIsPaused(true);
                  }}
                  className="btn btn-error btn-sm"
                >
                  <MdClose size="1.25rem" className="size-4 lg:size-5" />
                </button>
              </form>
            </div>
          </div>
          <ResponseRenderer
            filePreview={activeHistory?.filePreview || ""}
            summaryRef={summaryRef}
            summary={activeHistory?.response || ""}
            className="p-3 lg:p-5 mt-10 lg:mt-0"
          />
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
