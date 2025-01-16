"use client";
import React from "react";

const Dropdown = ({
  title,
  itemsList,
  onClick,
  setInputText,
  loading,
}: {
  title: string;
  itemsList: string[];
  onClick?: () => void;
  setInputText?: (text: string) => void;
  loading?: boolean;
}) => {
  const dropdownContentRef = React.useRef<HTMLUListElement>(null);
  const handleFocus = () => {
    console.log("Click")
    dropdownContentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <div className="dropdown">
      <button tabIndex={0} role="button" onClick={handleFocus} className="btn btn-outline btn-info m-1">
        {title}
      </button>
      <ul
        ref={dropdownContentRef}
        tabIndex={0}
        className="dropdown-content menu bg-slate-100 text-slate-900 mt-5 rounded-box z-[1] w-80 p-2 shadow h-80 overflow-scroll flex-nowrap"
      >
        {itemsList.map((item) => (
          <li key={item}>
            <button
              onClick={() => {
                setInputText?.(item);
                onClick?.();
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
