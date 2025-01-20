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

const HistoryWrapper = ({ history }: { history: History[] }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeHistory, setActiveHistory] = React.useState<History | null>(
    null,
  );
  const localHistory = useGlobalStore((state) => state.history);
  const updateLocalHistory = useGlobalStore((state) => state.updateHistory);

  const modalRef = React.useRef<HTMLDialogElement>(null);
  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  useEffect(() => {
    updateLocalHistory(history);
  }, [history]);

  const ButtonOpen = () => (
    <button
      className="absolute z-30 btn btn-info left-5"
      onClick={() => setIsOpen(true)}
    >
      <FaArrowRight />
    </button>
  );

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
