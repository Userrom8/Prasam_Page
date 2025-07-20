import { useState, useEffect, useContext, useRef } from "react";

import { disablePageScroll, enablePageScroll } from "scroll-lock";

import ThemeContext from "../services/theme";

const Nav = () => {
  const { dark, setDark } = useContext(ThemeContext);

  useEffect(() => {
    localStorage.setItem("darkMode", dark);
    const root = window.document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const modeToggle = () => {
    if (!dark) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide-moon-star"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" />
          <path d="M20 3v4" />
          <path d="M22 5h-4" />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide-sun"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v1" />
          <path d="M12 20v1" />
          <path d="M3 12h1" />
          <path d="M20 12h1" />
          <path d="m18.364 5.636-.707.707" />
          <path d="m6.343 17.657-.707.707" />
          <path d="m5.636 5.636.707.707" />
          <path d="m17.657 17.657.707.707" />
        </svg>
      );
    }
  };

  const [clickedState, setClickState] = useState(0);

  const handleClick = (index) => {
    setClickState(index);
  };

  const links = ["Portfolio", "Blog", "Testimonials", "Contact me"];

  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    openNav ? disablePageScroll() : enablePageScroll();
  }, [openNav]);

  const [navBorder, setNavBorder] = useState(
    window.innerWidth > 768 ? false : true
  );

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 80) {
        setNavBorder(true);
      } else {
        window.innerWidth < 768 ? setNavBorder(true) : setNavBorder(false);
      }
    };

    window.addEventListener("scroll", checkScroll);

    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const [toggleClosingAnimation, setToggleClosingAnimation] = useState(false);

  const delayAnimation = () => {
    setToggleClosingAnimation(true);
    setTimeout(() => {
      setOpenNav(false);
      setToggleClosingAnimation(false);
    }, 90);
  };

  const navLinks = (link, index) => {
    return (
      <a
        key={index}
        className="nav-links"
        onClick={() => {
          handleClick(index);
          if (openNav) delayAnimation();
        }}
        style={{
          color: dark
            ? clickedState === index
              ? "#22d3ee"
              : "white"
            : clickedState === index
            ? "#00b7ff"
            : "black",
          textShadow: dark
            ? "none"
            : clickedState === index
            ? "0px 0px 0px rgba(0,0,0,0.4)"
            : "none",
        }}
      >
        {link}
      </a>
    );
  };

  const AppointmentBtn = () => {
    return (
      <button
        type="button"
        className="dark:bg-stone-300 bg-stone-800 dark:hover:bg-stone-600 hover:bg-stone-400 dark:text-black text-white dark:hover:text-white hover:text-black rounded transition-all dark:active:bg-stone-700 active:bg-stone-300 active:shadow-inner w-[90%]"
      >
        <p className="py-2 px-3">Schedule a call</p>
      </button>
    );
  };

  const SunMoon = () => {
    return (
      <button
        type="button"
        className="nav_button"
        onClick={() => setDark(!dark)}
      >
        {modeToggle()}
      </button>
    );
  };

  useEffect(() => {
    const handleReSize = () => {
      if (window.innerWidth > 768) {
        setNavBorder(false);
        if (openNav) delayAnimation();
      } else setNavBorder(true);
    };

    window.addEventListener("resize", handleReSize);

    return () => {
      window.removeEventListener("resize", handleReSize);
    };
  }, [openNav]);

  const collapsableNavSection = useRef(null);
  const collapsableNav = useRef(null);

  useEffect(() => {
    const handleTargetedClick = (clicked) => {
      if (
        openNav &&
        collapsableNavSection.current &&
        !collapsableNavSection.current.contains(clicked.target) &&
        collapsableNav.current &&
        collapsableNav.current.contains(clicked.target)
      )
        delayAnimation();
    };

    window.addEventListener("click", handleTargetedClick);

    return () => {
      window.removeEventListener("click", handleTargetedClick);
    };
  }, [openNav]);

  return (
    <>
      <nav
        className={`${
          navBorder ? "border-b" : "border-none"
        } w-full h-20 flex items-center justify-center sticky top-0 z-10 backdrop-blur-xl dark:border-gray-700 border-gray-300 lg:px-16 md:px-10 px-6`}
      >
        <div className="max-w-7xl w-full flex items-center justify-between font-Grotesk text-lg">
          <div>Prasam.</div>
          <div className="hidden gap-8 md:flex">
            {links.map((link, index) => navLinks(link, index))}
          </div>
          <div className="flex-row items-center lg:gap-4 gap-2 hidden md:flex">
            <SunMoon />
            <div className="h-4 w-0.5 bg-gray-400"></div>
            <AppointmentBtn />
          </div>
          <button
            type="button"
            className="md:hidden nav_button"
            onClick={() => {
              setOpenNav(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </nav>
      <nav
        className={`${openNav ? "flex animate-fade-into-view" : "hidden"} ${
          toggleClosingAnimation ? "animate-fade-out-from-view" : "animate-none"
        } fixed z-20 top-0 right-0 w-screen h-screen backdrop-blur-sm`}
        ref={collapsableNav}
      >
        <div
          className={`${
            openNav ? "flex animate-slide-in-from-right" : "hidden"
          } ${
            toggleClosingAnimation
              ? "animate-slide-out-to-right"
              : "animate-none"
          } fixed right-0 w-80 h-full transition-all dark:bg-stone-800 bg-stone-200 justify-start items-start flex-col`}
          ref={collapsableNavSection}
        >
          <div className="flex items-center justify-between h-12 border-b dark:border-gray-700 border-gray-400 px-4 py-8 w-full">
            <div>Prasam.</div>
            <button
              type="button"
              className="collapse_nav_button relative z-30"
              onClick={delayAnimation}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="border-b dark:border-gray-700 border-gray-400 flex flex-col w-full gap-2 p-4 text-lg font-semibold">
            {links.map((link, index) => navLinks(link, index))}
          </div>

          <div className="border-b dark:border-gray-700 border-gray-400 flex flex-col items-center justify-evenly w-full gap-2 p-4">
            <div className="flex items-center flex-row justify-between w-[90%]">
              <p>Switch Theme</p>
              <SunMoon />
            </div>
            <AppointmentBtn />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
