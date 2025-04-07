"use client";
import React, { useRef } from "react";
import { Posts } from "@/types/response-handlers";
import Heading from "../../Heading";
import ModalHeader from "./ModalHeader";
import ImageResponseRenderer from "@/components/Gemini/ResponseRenderer/ImageResponseRenderer";
import FilePreview from "@/components/Gemini/ResponseRenderer/FilePreview";
import TextToSpeech from "@/components/TextToSpeech";
import MarkdownRenderer from "@/components/Gemini/ResponseRenderer/MarkdownRender";

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
          <section
            ref={summaryRef}
            className="relative !overflow-auto mt-5 p-3 lg:p-5 lg:mt-0 !pt-5"
          >
            {activePost?.response &&
            activePost?.response.includes("data:image") ? (
              <>
                <ImageResponseRenderer
                  prompt={activePost?.prompt}
                  src={activePost?.response}
                />
              </>
            ) : (
              <div className="w-full px-2.5 py-8 border border-solid border-cyan-300 rounded-lg h-fit">
                {activePost?.filePreview && (
                  <FilePreview
                    filePreview={activePost?.filePreview}
                    prompt={activePost?.prompt}
                    createdAt={activePost?.createdAt}
                    usermail={activePost?.user.email}
                    username={activePost?.user?.name || ""}
                  />
                )}
                <TextToSpeech
                  text={activePost?.response as string}
                  className="absolute lg:right-8 lg:top-8 right-3 top-0"
                />
                <MarkdownRenderer summary={activePost?.response as string} />
              </div>
            )}
          </section>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
