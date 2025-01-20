"use client";
import { useGlobalStore } from "@/store/global-store";
import React, { useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Modal from "./Modal";

export type History = {
  historyId: string;
  email: string;
  prompt: string;
  response: string;
};

/**
 * A component that displays a list of history items from the local history store.
 * The list is displayed in a fixed position on the left side of the screen.
 * The user can click on each item to open a modal dialog with the prompt and response.
 * The user can also click on the left arrow button to close the list.
 */
const HistoryWrapper = ({ history }: { history: History[] }) => {
  /**
   * Whether the list of history items is open or closed.
   * This state is used to control the visibility of the list.
   */
  const [isOpen, setIsOpen] = React.useState(false);

  /**
   * The currently active history item.
   * This state is used to pass the active history item to the Modal component.
   */
  const [activeHistory, setActiveHistory] = React.useState<History | null>(
    null,
  );

  /**
   * The local history store.
   * This store is used to keep track of the user's history of prompts and responses.
   */
  const localHistory = useGlobalStore((state) => state.history);

  /**
   * A function to update the local history store.
   * This function is used to update the local history store with new history items.
   */
  const updateLocalHistory = useGlobalStore((state) => state.updateHistory);

  /**
   * A reference to the modal dialog element.
   * This reference is used to show or hide the modal dialog.
   */
  const modalRef = React.useRef<HTMLDialogElement>(null);

  /**
   * A function to open the modal dialog.
   * This function is used to show the modal dialog when the user clicks on an item in the list.
   */
  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  /**
   * When the component mounts, update the local history store with the new history items.
   */
  useEffect(() => {
    updateLocalHistory(history);
  }, [history]);

  /**
   * A component to open the list of history items.
   * This component is displayed in the top-left corner of the screen.
   */
  const ButtonOpen = () => (
    <button
      className="absolute z-30 btn btn-info left-5"
      onClick={() => setIsOpen(true)}
    >
      <FaArrowRight />
    </button>
  );

  /**
   * A component to close the list of history items.
   * This component is displayed in the top-right corner of the screen.
   */
  const ButtonClose = () => (
    <button
      className="absolute z-30 btn btn-info right-5"
      onClick={() => setIsOpen(false)}
    >
      <FaArrowLeft />
    </button>
  );

  return (
    <div
      className={`fixed left-0 top-20 lg:top-32 lg:max-w-96 ${isOpen ? "w-full" : "w-0"}`}
    >
      {!isOpen ? <ButtonOpen /> : null}
      <div
        className={`h-[500px] bg-base-300 rounded-xl transition-all duration-150 ease-in-out p-5 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <ButtonClose />

        <ul className="h-full py-5 overflow-auto space-y-5">
          {localHistory.map((item, index) => {
            return (
              <li key={index}>
                <button
                  className="text-left"
                  onClick={() => {
                    setIsOpen(false);
                    setActiveHistory(item);
                    openModal();
                  }}
                >
                  {item.prompt}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <Modal modalRef={modalRef} activeHistory={activeHistory} />
    </div>
  );
};

export default HistoryWrapper;
