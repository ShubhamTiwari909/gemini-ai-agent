"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  // Reference to the button element to detect outside clicks
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const pathname = usePathname();

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

  // Set up event listeners for outside clicks and scrolling
  useEffect(() => {
    const controller = new AbortController();
    document.addEventListener("mousedown", handleClickOutside, {
      signal: controller.signal,
    });
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <header
      className={`flex justify-between items-center fixed w-full top-0 z-100 ${pathname !== "/login" ? "bg-base-content" : ""}`}
    >
      <div className="flex justify-between relative z-50 w-full py-3 lg:px-16 px-5">
        <Link href="/">
          <Image
            src="/gemini-zentauri-logo.png"
            alt="logo"
            width={50}
            height={50}
            className="w-16"
          />
        </Link>
        <button
          className="lg:hidden"
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaHamburger
            size="1.5rem"
            className={isOpen ? "text-base-content" : "text-base-100"}
          />
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
