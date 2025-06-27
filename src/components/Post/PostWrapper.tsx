"use client";
import { useGlobalStore } from "@/store/global-store";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import * as motion from "motion/react-client";
import Modal from "./Modal/Modal";
import Search from "./Search";
import { AnimatePresence } from "motion/react";
import { Posts } from "@/types/response-handlers";
import Heading from "../Heading";

type Data = {
  data: Posts[];
  currentPage: number;
  hasMore: boolean;
  message?: string;
};

/**
 * A component that displays a list of posts items from the local posts store.
 * The list is displayed in a fixed position on the left side of the screen.
 * The user can click on each item to open a modal dialog with the prompt and response.
 * The user can also click on the left arrow button to close the list.
 */
const PostWrapper = ({
  posts,
  userId,
}: {
  posts: Data;
  userId: string | null | undefined;
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(posts.hasMore);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Whether the list of posts items is open or closed.
   * This state is used to control the visibility of the list.
   */
  const [isOpen, setIsOpen] = React.useState(false);

  /**
   * The search query entered by the user.
   * This state is used to filter the list of posts items based on the user's search query.
   */
  const [search, setSearch] = React.useState("");

  /**
   * The currently active posts item.
   * This state is used to pass the active posts item to the Modal component.
   */
  const [activePost, setActivePost] = React.useState<Posts | null>(null);

  const localPosts = useGlobalStore((state) => state.posts);
  /**
   * A function to update the local posts store.
   * This function is used to update the local posts store with new posts items.
   */
  const updateLocalPosts = useGlobalStore((state) => state.updatePosts);

  /**
   * A function to set the speech synthesis pause state.
   * This function is used to pause or resume the speech synthesis when the user interacts with the posts list.
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
   * When the component mounts, update the local posts store with the new posts items.
   */
  useEffect(() => {
    if ("message" in posts) {
      setRateLimitMessage(posts.message as string);
      updateLocalPosts([]);
    } else {
      updateLocalPosts(posts.data);
    }
  }, []);

  const handleFetchPost = () => {
    fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/posts/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        userId,
        limit: 10,
        page: page + 1,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        setPage((prevPage) => prevPage + 1);
        updateLocalPosts([...localPosts, ...result.data]);
        setHasMore(result.hasMore);
      });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !search) {
          setLoading(true);
          handleFetchPost();
        }
      },
      { rootMargin: "10px" },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page, hasMore, search, localPosts, observerRef]); // Ensure effect runs when page updates

  /**
   * Resets the search query to an empty string when the list of posts items is closed.
   */
  useEffect(() => {
    if (!isOpen) {
      // Reset the search query to an empty string when the list is closed
      setSearch("");
    }
  }, [isOpen]);

  /**
   * A component to open the list of posts items.
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

  /**
   * A component to close the list of posts items.
   * This component is displayed in the top-right corner of the screen.
   */
  const handleButtonClose = () => {
    setIsOpen(false);
    setSearch("");
    if (window.innerWidth < 1024) {
      document.body.style.overflow = "auto";
    }
  };

  return (
    <div
      className={`fixed left-0 top-20 lg:top-32 z-99 ${isOpen ? "w-full" : "w-0"}`}
    >
      {!isOpen ? <ButtonOpen handleButtonOpen={handleButtonOpen} /> : null}
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
                <ButtonClose handleButtonClose={handleButtonClose} />
              </div>
            ) : null}

            <LocalPost
              search={search}
              setActivePost={setActivePost}
              openModal={openModal}
              setIsOpen={setIsOpen}
              history={localPosts}
              observerRef={observerRef}
            />
            <p className="text-center">{loading && "Loading..."}</p>
          </motion.div>
        </AnimatePresence>

        <Modal modalRef={modalRef} activePost={activePost} />
      </motion.div>
      {rateLimitMessage !== "" ? (
        <RateLimitMessage
          rateLimitMessage={rateLimitMessage}
          setRateLimitMessage={setRateLimitMessage}
        />
      ) : null}
    </div>
  );
};

export default PostWrapper;

const ButtonOpen = ({ handleButtonOpen }: { handleButtonOpen: () => void }) => (
  <button
    className="absolute z-30 btn btn-sm lg:btn-md btn-outline left-5 top-5"
    onClick={handleButtonOpen}
  >
    <FaArrowRight className="size-4 lg:size-6" />
  </button>
);

const ButtonClose = ({
  handleButtonClose,
}: {
  handleButtonClose: () => void;
}) => (
  <button className="btn btn-outline" onClick={handleButtonClose}>
    <FaArrowLeft className="size-4 lg:size-6" />
  </button>
);

/**
 * A component that displays the user's local posts.
 * It takes in the user's local posts, a search string, a function to set the active posts,
 * a function to open the modal and a function to set the modal open state.
 * It filters the local posts based on the search string and displays the results
 * as a list of posts items.
 * Each posts item is a button that when clicked, sets the active posts and opens the modal.
 * The component uses the `motion` library to animate the list items.
 */
const LocalPost = ({
  search,
  setActivePost,
  openModal,
  setIsOpen,
  history,
  observerRef,
}: {
  search: string;
  setActivePost: (posts: Posts) => void;
  openModal: () => void;
  setIsOpen: (isOpen: boolean) => void;
  history: Posts[];
  observerRef?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const filterSearchPosts = history.filter((item) =>
    item.prompt.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
  return (
    <div className="h-full py-5 overflow-auto space-y-10">
      {filterSearchPosts.length === 0 ? (
        <p>No posts found for the search</p>
      ) : (
        filterSearchPosts.map((item, index) => {
          return (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileInView={{ opacity: 1 }}
              key={index}
              className="border-b border-solid border-b-base-content pb-3 text-left font-bold line-clamp-1 text-ellipsis cursor-pointer w-full transition-colors duration-200 ease-in-out flex items-center justify-between focus-within:text-white hover:text-white"
              ref={index === history.length - 1 ? observerRef : null} // Attach ref to last item
              onClick={() => {
                setIsOpen(false);
                setActivePost(item);
                openModal();
              }}
            >
              <Heading prompt={item.prompt || ""} />
              <FaArrowRight className="inline-block ml-2" />
            </motion.button>
          );
        })
      )}
    </div>
  );
};

/**
 * A component that displays a message when the user has exceeded the rate limit.
 * It displays a message with the text that is passed as a prop.
 * The message is displayed for 2 seconds before it is removed.
 * It is displayed in the center of the screen.
 * The component is used by the `usePost` hook.
 */
const RateLimitMessage = ({
  rateLimitMessage,
  setRateLimitMessage,
}: {
  rateLimitMessage: string;
  setRateLimitMessage: (message: string) => void;
}) => {
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
