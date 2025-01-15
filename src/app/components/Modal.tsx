"use client";
import React from "react";
import ThemeChanger from "./ThemeChanger";

const Modal = () => {
  const modalRef = React.useRef<HTMLDialogElement>(null);
  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  }
  return (
    <div className="fixed top-0 right-1/2 translate-x-1/2 lg:translate-x-0 lg:top-5 lg:right-5">
      <button className="btn" onClick={openModal}>
        Themes
      </button>
      <dialog ref={modalRef} id="my_modal_1" className="modal">
        <div className="modal-box">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg">Select a Theme</h3>
            <div className="modal-action mt-0">
              <form method="dialog">
                <button className="btn btn-error btn-sm">Close</button>
              </form>
            </div>
          </div>
          <ThemeChanger closeModal={closeModal} />
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
