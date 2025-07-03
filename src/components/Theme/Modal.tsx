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
    <div className="flex gap-5 md:gap-10 flex-wrap items-center">
      {/* A button to open the dialog. */}
      <h2 className="cursor-pointer text-lg mb-1" onClick={openModal}>
        Themes:
      </h2>
      <ThemeChanger closeModal={closeModal} />
    </div>
  );
};

export default Modal;
