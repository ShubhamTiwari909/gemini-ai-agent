"use client";
import { useGlobalStore } from "@/store/global-store";
import React, { useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import * as motion from "motion/react-client";
import Modal from "./Modal";
import Search from "./Search";
import { AnimatePresence } from "motion/react";

export type History = {
  historyId: string;
  email: string;
  prompt: string;
  response: string;
  filePreview?: string;
};

/**
 * A component that displays a list of history items from the local history store.
 * The list is displayed in a fixed position on the left side of the screen.
 * The user can click on each item to open a modal dialog with the prompt and response.
 * The user can also click on the left arrow button to close the list.
 */
const HistoryWrapper = ({
  history,
}: {
  history: History[] | { message: string };
}) => {
  /**
   * Whether the list of history items is open or closed.
   * This state is used to control the visibility of the list.
   */
  const [isOpen, setIsOpen] = React.useState(false);

  /**
   * The search query entered by the user.
   * This state is used to filter the list of history items based on the user's search query.
   */
  const [search, setSearch] = React.useState("");

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
   * A function to set the speech synthesis pause state.
   * This function is used to pause or resume the speech synthesis when the user interacts with the history list.
   */
  const setIsPaused = useGlobalStore((state) => state.setIsSpeechPaused);

  /**
   * Retrieves the current rate limit message from the global store.
   * This message indicates any rate limiting applied to the user.
   */
  const rateLimitMessage = useGlobalStore((state) => state.rateLimitMessage);

  /**
   * Updates the rate limit message in the global store.
   * This function is used to set a new rate limit message when required.
   */
  const setRateLimitMessage = useGlobalStore(
    (state) => state.setRateLimitMessage,
  );

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
    if ("message" in history) {
      setRateLimitMessage(history.message);
      updateLocalHistory([]);
    } else {
      updateLocalHistory(history);
    }
  }, [history]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  /**
   * A component to open the list of history items.
   * This component is displayed in the top-left corner of the screen.
   */
  const handleButtonOpen = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPaused(true);
    setIsOpen(true);
    if (window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    }
  };
  const ButtonOpen = () => (
    <button
      className="absolute z-30 btn btn-info left-5"
      onClick={handleButtonOpen}
    >
      <FaArrowRight />
    </button>
  );

  /**
   * A component to close the list of history items.
   * This component is displayed in the top-right corner of the screen.
   */
  const handleButtonClosec = () => {
    setIsOpen(false);
    setSearch("");
    if (window.innerWidth < 1024) {
      document.body.style.overflow = "auto";
    }
  };
  const ButtonClose = () => (
    <button className="btn btn-info" onClick={handleButtonClosec}>
      <FaArrowLeft />
    </button>
  );

  const RateLimitMessage = () => {
    useEffect(() => {
      setTimeout(() => {
        setRateLimitMessage("");
      }, 2000);
    }, [rateLimitMessage]);
    return (
      <div className="z-50 fixed w-full mx-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-slate-900/50">
        <div className="alert alert-error max-w-2xl grid-cols-none justify-center">
          <p className="text-center">{rateLimitMessage}</p>
        </div>
      </div>
    );
  };

  const LocationHistory = () => {
    const filterSearchHistory = localHistory.filter((item) =>
      item.prompt.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    );
    return (
      <ul className="h-full py-5 overflow-auto space-y-7">
        {filterSearchHistory.length === 0 ? (
          <p>No history found for the search</p>
        ) : (
          filterSearchHistory.map((item, index) => {
            return (
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileInView={{ opacity: 1 }}
                key={index}
                className="border-b border-solid border-b-base-content pb-2"
              >
                <button
                  className="text-left line-clamp-2 text-ellipsis"
                  onClick={() => {
                    setIsOpen(false);
                    setActiveHistory(item);
                    openModal();
                  }}
                >
                  {item.prompt}
                </button>
              </motion.li>
            );
          })
        )}
      </ul>
    );
  };

  return (
    <div
      className={`fixed left-0 top-20 lg:top-32 ${isOpen ? "w-full" : "w-0"}`}
    >
      {!isOpen ? <ButtonOpen /> : null}
      <motion.div
        initial={{ translateX: "-100%" }}
        animate={{
          translateX: isOpen ? 0 : "-100%",
        }}
        exit={{ translateX: "-100%" }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
          when: "afterChildren",
        }}
        className="lg:max-w-96"
      >
        <AnimatePresence initial={false}>
          <motion.div
            initial={{ translateX: "-100%" }}
            animate={{ translateX: isOpen ? 0 : "-100%" }}
            exit={{ translateX: "-100%" }}
            transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
              when: "afterChildren",
            }}
            className={`h-[500px] 2xl:h-[800px] pb-20 2xl:pb-52 bg-base-300 rounded-xl p-5`}
          >
            {isOpen ? (
              <div className="flex items-center justify-between gap-x-8 mb-5 lg:mb-8">
                <Search setSearch={setSearch} />
                <ButtonClose />
              </div>
            ) : null}

            <LocationHistory />
          </motion.div>
        </AnimatePresence>

        <Modal modalRef={modalRef} activeHistory={activeHistory} />
      </motion.div>
      {rateLimitMessage !== "" ? <RateLimitMessage /> : null}
    </div>
  );
};

export default HistoryWrapper;
