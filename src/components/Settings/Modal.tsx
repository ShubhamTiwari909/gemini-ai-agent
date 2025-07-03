"use client";
import React from "react";
import { MdClose } from "react-icons/md";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const modalRef = React.useRef<HTMLDialogElement>(null);
  return (
    <div>
      <button
        className="btn btn-error"
        onClick={() => modalRef.current?.showModal()}
      >
        Delete Account
      </button>
      <dialog id="account-delete" className="modal" ref={modalRef}>
        <div className="modal-box relative">
          <h3 className="font-bold text-lg mb-2">
            Are you sure you want to delete your account?
          </h3>
          <p className="mb-5">
            This action cannot be undone and will permanently delete your
            account and data.
          </p>
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
