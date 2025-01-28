"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { FaHamburger } from "react-icons/fa";

/**
 * HeaderWrapper component that provides a responsive header layout with a dynamic background.
 * The header includes a logo and a toggle navigation menu.
 *
 * @param {object} props - The props of the component.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the header.
 * @returns {JSX.Element} The rendered header component.
 */
const HeaderWrapper = ({ children }: { children: React.ReactNode }) => {
  // State to track if the navigation menu is open
  const [isOpen, setIsOpen] = React.useState(false);

  // State to control the background color of the header based on scroll position
  const [headerBg, setHeaderBg] = React.useState("bg-transparent");

  // Reference to the button element to detect outside clicks
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  /**
   * Handles clicks outside the button to close the menu.
   *
   * @param {MouseEvent} event - The mouse event triggered by clicking outside.
   */
  const handleClickOutside = (event: MouseEvent) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  /**
   * Handles scroll events to update the header background color.
   */
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setHeaderBg("bg-slate-900");
    } else {
      setHeaderBg("bg-transparent");
    }
  };

  // Set up event listeners for outside clicks and scrolling
  useEffect(() => {
    const controller = new AbortController();
    document.addEventListener("mousedown", handleClickOutside, {
      signal: controller.signal,
    });
    document.addEventListener("scroll", handleScroll, {
      signal: controller.signal,
    });
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <header
      className={`flex justify-between fixed w-full top-0 z-40 ${headerBg}`}
    >
      <div className="flex justify-between relative z-50 w-full py-5 lg:px-16 px-5">
        <Link href="/">
          <Image
            src="/gemini-zentauri-logo.png"
            alt="logo"
            width={150}
            height={80}
            className="w-32 lg:w-40"
          />
        </Link>
        <button
          className="lg:hidden"
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaHamburger size="1.5rem" className="text-base-content" />
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
