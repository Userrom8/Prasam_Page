import {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import gsap from "gsap";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import AutoPlaySound from "../components/AutoPlaySound";
import ThemeContext from "../services/theme";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroText, setHeroText] = useState("");

  useEffect(() => {
    // Fetch both content and files here, in the parent component
    const fetchData = async () => {
      setLoading(true);
      try {
        const [contentRes, filesRes] = await Promise.all([
          fetch(`${API_URL}/content`),
          fetch(`${API_URL}/files`),
        ]);

        const contentData = await contentRes.json();
        const filesData = await filesRes.json();

        // Set the hero text
        setHeroText(
          contentData.heroText || "Default welcome text from HomePage."
        );

        // Sort the photos once and store them
        const sortedPhotos = filesData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPhotos(sortedPhotos);
      } catch (err) {
        console.error("Failed to fetch data in HomePage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { dark } = useContext(ThemeContext);

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) root.style.colorScheme = "dark";
    else root.style.colorScheme = "light";
  }, [dark]);

  const comp = useRef(null);

  useLayoutEffect(() => {
    // Check if the intro has already been seen in this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");

    if (hasSeenIntro) {
      // If the intro has been seen, hide the animation elements immediately
      const hideElement = document.getElementById("hide");
      if (hideElement) {
        hideElement.style.display = "none";
      }
      enablePageScroll();
      return; // Exit the effect to prevent the animation from running
    }

    // If the intro has not been seen, run the animation
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
            const hideElement = document.getElementById("hide");
            if (hideElement) {
              hideElement.style.display = "none";
            }
            enablePageScroll();
            // --- SET THE FLAG ---
            // After the animation is complete, set the flag in sessionStorage
            sessionStorage.setItem("hasSeenIntro", "true");
          },
        });
    }, comp);

    return () => ctx.revert();
  }, []); // The empty dependency array ensures this runs only once on component mount

  return (
    <main>
      {!sessionStorage.getItem("hasSeenIntro") && <AutoPlaySound />}

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
            className="md:text-9xl sm:8xl xs:text-7xl xs+:text-6xl text-5xl font-bold dark:text-gray-100 text-gray-900 font-spaceGrotesk"
          >
            Welcome.
          </h1>
        </div>
      </div>

      <div className="main"></div>

      <div className="app">
        <Nav />
        <Hero
          latestShots={photos.slice(0, 7)}
          loading={loading}
          heroText={heroText}
        />
        <Content photos={photos.slice(0, 20)} loading={loading} />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </main>
  );
};

export default HomePage;
