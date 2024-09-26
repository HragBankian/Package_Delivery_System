"use client";
import omnivoxLogo from "@/public/logos/logo-omnivox.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const dynamic = "force-dynamic";

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const pathName = usePathname();

  //Handles the opening and closing of our chatbox
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    if (isOpen) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", updatePosition);
    updatePosition();
  }, []);

  return (
    <div>
      <div
        className={`omnivoxorange fixed z-30 right-3 bottom-0 flex w-60 flex-col border border-omnivoxorange shadow-2xl transition duration-300 rounded-t-lg ${
          scrollPosition > 10
            ? "bg-omnivoxorange/30 backdrop-blur-xl"
            : "bg-omnivoxorange"
        }`}
      >
        <div className="flex flex-row items-center m-4">
          <p className="text-white">Ask your questions</p>
          <button
            onClick={handleClick}
            aria-label="menu"
            className="ml-auto flex flex-row self-center py-3"
          >
            <span
              className={`block h-0.5 w-6 rounded-sm 
                    transition-all duration-300 ease-out bg-white -rotate-45 translate-x-2 ${
                      isOpen ? "translate-x-4" : ""
                    }`}
            ></span>
            <span
              className={`block h-0.5 w-6 rounded-sm 
                    transition-all duration-300 ease-out bg-white rotate-45 ${
                      isOpen ? "-translate-x-2" : ""
                    }`}
            ></span>
          </button>
        </div>
        <div className={`bg-white ${isOpen ? "" : "hidden"} flex flex-col`}>
          text bubbles
          <form onSubmit={undefined} className="flex flex-row">
            <input type="text" name="name" />
            <button className="bg-omnivoxorange" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
