"use client";
import Image from "next/image";
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
    <header className="relative flex justify-between">
      <div className="flex justify-between relative z-50 w-full py-5 lg:px-16 px-5">
        <Image
          src="/gemini-zentauri-logo.png"
          alt="logo"
          width={150}
          height={80}
          className="w-28 lg:w-40"
        />
        <button
          className="lg:hidden"
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaHamburger size="1.5rem" />
        </button>
      </div>
      <div
        className={`absolute lg:static lg:h-fit lg:py-5 lg:pr-16 lg:bg-transparent top-0 z-40 bg-base-300 flex flex-col lg:flex-row lg:justify-end gap-5 h-0 w-full overflow-hidden transition-all duration-100 ease-linear ${isOpen ? "pt-28 pb-14 px-10 h-screen overflow-auto" : ""}`}
      >
        {children}
      </div>
    </header>
  );
};

export default HeaderWrapper;
