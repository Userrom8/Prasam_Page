import { useEffect, useContext, useRef, useLayoutEffect } from "react";

import { disablePageScroll, enablePageScroll } from "scroll-lock";

import gsap from "gsap";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Content from "./components/Content";
import Footer from "./components/Footer";
import Copyright from "./components/Copyright";
import Reviews from "./components/Reviews";
import AutoPlaySound from "./components/AutoPlaySound";

import ThemeContext from "./services/theme";

import "./App.css";

const App = () => {
  const { dark } = useContext(ThemeContext);

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) root.style.colorScheme = "dark";
    else root.style.colorScheme = "light";
  }, [dark]);

  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const t1 = gsap.timeline();
      t1.from("#intro-slider", {
        onStart: () => {
          disablePageScroll();
        },
        xPercent: "-100",
        duration: 1.3,
        delay: 0.3,
      })
        .from(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: "+=30",
          stagger: 0.5,
        })
        .to(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: "-=30",
          delay: 0.3,
          stagger: 0.5,
        })
        .to("#intro-slider", {
          xPercent: "-100",
          duration: 1.3,
        })
        .from("#welcome", {
          opacity: 0,
          duration: 3.5,
        })
        .to("#outro-slider", {
          xPercent: "-100",
          duration: 0.7,
          onComplete: () => {
            document.getElementById("hide").style.display = "none";
            enablePageScroll();
          },
        });
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <main>
      <AutoPlaySound />

      <div id="hide" className="fixed z-30" ref={comp}>
        <div
          id="intro-slider"
          className="h-screen p-10 dark:bg-zinc-900 bg-zinc-200 absolute top-0 left-0 font-spaceGrotesk z-10 w-screen flex flex-col items-center gap-10 tracking-tight dark:text-white text-black"
        >
          <div className="max-w-7xl">
            <h1 className="intro_text" id="title-1">
              Software Engineer
            </h1>
            <h1 className="intro_text" id="title-2">
              Freelance Photographer
            </h1>
            <h1 className="intro_text" id="title-3">
              Forex Trader
            </h1>
          </div>
        </div>
        <div
          id="outro-slider"
          className="h-screen w-screen flex dark:bg-gray-950 bg-gray-50 justify-center place-items-center"
        >
          <h1
            id="welcome"
            className="md:text-9xl sm:8xl text-7xl font-bold dark:text-gray-100 text-gray-900 font-spaceGrotesk"
          >
            Welcome.
          </h1>
        </div>
      </div>

      <div className="main"></div>

      <div className="app">
        <Nav />
        <Hero />
        <Content />
        <Reviews />
        <Footer />
        <Copyright />
      </div>
    </main>
  );
};

export default App;
