"use client";
import React, { useEffect } from "react";
import { FaHamburger } from "react-icons/fa";

const HeaderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <header className="relative">
      <div className="lg:hidden flex justify-end pr-5 pt-3 relative z-50">
        <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
          <FaHamburger size="1.5rem" />
        </button>
      </div>
      <div
        className={`absolute lg:static lg:h-fit lg:py-5 lg:px-10 lg:bg-transparent top-0 z-40 bg-base-300 flex flex-col lg:flex-row lg:justify-end gap-5 h-0 w-full overflow-hidden transition-all duration-100 ease-linear ${isOpen ? "py-14 px-10 h-screen overflow-auto" : ""}`}
      >
        {children}
      </div>
    </header>
  );
};

export default HeaderWrapper;
