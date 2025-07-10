"use client";
import React from "react";
import { MdClose } from "react-icons/md";

const Modal = ({
  children,
  buttonText,
}: {
  children: React.ReactNode;
  buttonText: string;
}) => {
  const modalRef = React.useRef<HTMLDialogElement>(null);
  return (
    <div className="z-90">
      <button
        className="btn btn-error"
        onClick={() => modalRef.current?.showModal()}
      >
        {buttonText}
      </button>
      <dialog id="account-delete" className="modal" ref={modalRef}>
        <div className="modal-box relative">
          {children}
          <button
            onClick={() => modalRef.current?.close()}
            className="absolute top-3 right-3 cursor-pointer"
          >
            <MdClose />
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Modal;
