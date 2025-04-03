"use client";
import React, { useRef } from "react";
import ResponseRenderer from "../../Gemini/ResponseRenderer/ResponseRenderer";
import { History } from "@/types/response-handlers";
import Heading from "../../Heading";
import ModalHeader from "./ModalHeader";

const Modal = ({
  activeHistory,
  modalRef,
}: {
  activeHistory: History | null;
  modalRef: React.RefObject<HTMLDialogElement | null>;
}) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <dialog ref={modalRef} id="history-modal" className="modal">
        <div className="modal-box max-w-7xl relative p-0 !h-120 lg:!h-156">
          <div className="flex items-center justify-between sticky gap-x-3 top-0 bg-base-300 z-10 w-full p-3 lg:p-5">
            <Heading
              prompt={activeHistory?.prompt || ""}
              className="font-bold text-lg text-ellipsis line-clamp-1 flex gap-x-3 text-balance max-w-3xl"
            />
            <ModalHeader activeHistory={activeHistory} modalRef={modalRef} />
          </div>
          <ResponseRenderer
            post={{
              isImageResponse: activeHistory?.responseType === "image",
              filePreview: activeHistory?.filePreview || "",
              summary: activeHistory?.response || "",
            }}
            summaryRef={summaryRef}
            className="p-3 lg:p-5 lg:mt-0 !pt-5"
          />
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
