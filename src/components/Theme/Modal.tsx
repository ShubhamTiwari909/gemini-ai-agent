"use client";
import React from "react";
import ThemeChanger from "./ThemeChanger";

/**
 * A dialog modal component that allows the user to select a theme.
 * The component consists of a button to open the dialog and a dialog element
 * that contains a header with a title and a close button, and a form with a
 * list of themes to select from.
 *
 * @returns {JSX.Element} The rendered component.
 */
const Modal = () => {
  /**
   * A reference to the dialog element.
   */
  const modalRef = React.useRef<HTMLDialogElement>(null);

  /**
   * A function to open the dialog.
   */
  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  /**
   * A function to close the dialog.
   */
  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };
  return (
    <div className="flex justify-center">
      {/* A button to open the dialog. */}
      <button
        className="btn btn-secondary btn-outline w-full lg:w-fit"
        onClick={openModal}
      >
        Themes
      </button>
      {/* The dialog element. */}
      <dialog ref={modalRef} id="theme-modal" className="modal">
        {/* The dialog box. */}
        <div className="modal-box">
          {/* The header of the dialog. */}
          <div className="flex items-center justify-between mb-5">
            {/* The title of the dialog. */}
            <h3 className="font-bold text-lg">Select a Theme</h3>
            {/* The close button of the dialog. */}
            <div className="modal-action mt-0">
              <form method="dialog">
                <button className="btn btn-error btn-sm">Close</button>
              </form>
            </div>
          </div>
          {/* The form with the list of themes. */}
          <ThemeChanger closeModal={closeModal} />
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
