"use client";
import React from "react";
import * as motion from "motion/react-client";
import { useGlobalStore } from "@/store/global-store";

/**
 * A dropdown component that displays a list of items.
 * The user can select an item from the list which will trigger the
 * `onClick` callback with the selected item as an argument.
 * The `setInputText` function can be used to update the input text box
 * with the selected item.
 * The `loading` prop can be used to disable the dropdown during loading.
 * @param {string} title - The title of the dropdown.
 * @param {string[]} itemsList - The list of items to be displayed in the dropdown.
 * @param {function} onClick - The callback function to be triggered when an item is selected.
 * @param {function} setInputText - The function to be used to update the input text box.
 * @param {boolean} loading - Whether the dropdown is loading.
 */
const Dropdown = ({
  title,
  itemsList,
  onClick,
  setInputText,
  loading = false,
  stopSpeech,
}: {
  title: string;
  itemsList: string[];
  onClick: (item: string) => void;
  setInputText?: (text: string) => void;
  loading?: boolean;
  stopSpeech?: () => void;
}) => {
  const dropdownContentRef = React.useRef<HTMLUListElement>(null);
  const setFilePreview = useGlobalStore((state) => state.setFilePreview);
  const tags = useGlobalStore((state) => state.tags);

  /**
   * Scrolls the dropdown content into view when the user focuses on the dropdown.
   */
  const handleFocus = () => {
    stopSpeech?.();
    dropdownContentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <div className="dropdown sample-dropdown">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        tabIndex={0}
        role="button"
        onClick={handleFocus}
        className={`btn btn-sm lg:btn-md btn-outline m-1 !pointer-events-auto disabled:cursor-not-allowed ${tags.length === 0 ? "btn-ghost" : "btn-primary"}`}
        disabled={loading || tags.length === 0}
      >
        {title}
      </motion.button>
      <ul
        ref={dropdownContentRef}
        tabIndex={0}
        className="snap-y dropdown-content menu bg-slate-100 text-slate-900 mt-5 rounded-box z-[1] w-80 p-2 shadow h-80 overflow-scroll flex-nowrap"
      >
        {itemsList.map((item) => (
          <li key={item}>
            <button
              onClick={() => {
                setInputText?.(item);
                onClick(item);
                setFilePreview?.(null);
              }}
              disabled={loading}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
