"use client";
import React, { useRef } from "react";
import ResponseRenderer from "../../Gemini/ResponseRenderer/ResponseRenderer";
import { Posts } from "@/types/response-handlers";
import Heading from "../../Heading";
import ModalHeader from "./ModalHeader";

const Modal = ({
  activePost,
  modalRef,
}: {
  activePost: Posts | null;
  modalRef: React.RefObject<HTMLDialogElement | null>;
}) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <dialog ref={modalRef} id="post-modal" className="modal">
        <div className="modal-box max-w-7xl relative p-0 !h-120 lg:!h-156">
          <div className="flex items-center justify-between sticky gap-x-3 top-0 bg-base-300 z-10 w-full p-3 lg:p-5">
            <Heading
              prompt={activePost?.prompt || ""}
              className="font-bold text-lg text-ellipsis line-clamp-1 flex gap-x-3 text-balance max-w-3xl"
            />
            <ModalHeader activePost={activePost} modalRef={modalRef} />
          </div>
          <ResponseRenderer
            post={{
              filePreview: activePost?.filePreview || "",
              summary: activePost?.response || "",
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
