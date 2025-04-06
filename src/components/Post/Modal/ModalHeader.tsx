import { useGlobalStore } from "@/store/global-store";
import React, { useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import ModalOptions from "./ModalOptions";
import { Posts } from "@/types/response-handlers";
import { BsThreeDotsVertical } from "react-icons/bs";

const ModalHeader = ({
  activePost,
  modalRef,
}: {
  activePost: Posts | null;
  modalRef: React.RefObject<HTMLDialogElement | null>;
}) => {
  const setIsPaused = useGlobalStore((state) => state.setIsSpeechPaused);

  const optionsRef = useRef<HTMLDivElement>(null);
  const [dropdown, setDropdown] = React.useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  return (
    <div className="modal-action mt-0 gap-x-3 lg:gap-x-4 items-center">
      <div className="relative" ref={optionsRef}>
        <button
          role="button"
          className="!pointer-events-auto cursor-pointer"
          onClick={() => setDropdown(!dropdown)}
        >
          <BsThreeDotsVertical size="1.25rem" />
        </button>
        {dropdown && <ModalOptions activePost={activePost} />}
      </div>
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
  );
};
export default ModalHeader;
