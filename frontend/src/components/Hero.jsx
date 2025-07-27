import { useState, useEffect, useContext } from "react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";

import { HeroDarkImg, HeroLightImg } from "../assets";
import ThemeContext from "../services/theme";

const API_URL = import.meta.env.VITE_API_URL;

const Hero = () => {
  const { dark } = useContext(ThemeContext);
  const [latestShots, setLatestShots] = useState([]);
  const [heroText, setHeroText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A function to fetch all necessary data for the hero section
    const fetchHeroData = async () => {
      try {
        const [contentRes, filesRes] = await Promise.all([
          fetch(`${API_URL}/content`),
          fetch(`${API_URL}/files`),
        ]);

        const contentData = await contentRes.json();
        const filesData = await filesRes.json();

        // Set Hero Text
        setHeroText(
          contentData.heroText ||
            "Welcome to my portfolio. This text is editable from the admin panel."
        );

        // Set Latest Shots
        const sortedData = filesData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestShots(sortedData.slice(0, 7));
      } catch (err) {
        console.error("Failed to fetch hero data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const preventContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center md:flex-row flex-col dark:md:gap-0 md:gap-4 gap-16 dark:ml-0 md:ml-4 ml-0 lg:px-16 md:px-10 px-6 py-10 max-w-7xl pb-40">
      <img
        src={dark ? HeroDarkImg : HeroLightImg}
        alt="Full-shot of Prasam"
        loading="lazy"
        className="w-[50%] border-sky-100 border-4 rounded-2xl dark:border-none shadow-black shadow-2xl dark:shadow-none pointer-events-none"
        onContextMenu={preventContextMenu}
        style={{ WebkitTouchCallout: "none" }}
      />

      <div className="flex flex-col gap-20 mt-10 lg:mt-0">
        <div className="relative">
          <p className="dark:text-white text-black font-poppins tracking-wider">
            Hello there. nice to meet you. i am
          </p>
          <p className="font-Rouge leading-none text-sky-500 2xl:text-[16rem] xl:text-[14rem] lg:text-[12rem] md:text-[10rem] text-[7rem]">
            Prasam
          </p>
          {/* Skeleton for Hero Text */}
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full h-6 bg-gray-300 dark:bg-neutral-700 rounded-md animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <p className="dark:text-white text-black font-poppins dark:font-thin font-extralight tracking-wide">
              {heroText}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 xl:max-w-[36rem] lg:max-w-[32rem] md:max-w-[25rem]">
          <div className="flex flex-row justify-between items-baseline ml-4 max-w-[90vw]">
            <p className="tracking-wider">Latest shots</p>
            <Link
              to="/gallery"
              className="text-sm font-extralight cursor-pointer dark:text-blue-400 text-blue-600 tracking-wide md:pr-4 pr-0 transition-transform duration-300 hover:scale-125 hover:text-blue-800 dark:hover:text-blue-600"
            >
              view all
            </Link>
          </div>
          <div className="flex items-center justify-center">
            {/* Skeleton for Marquee */}
            {loading ? (
              <div className="flex items-center justify-center gap-10">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-52 h-72 bg-gray-300 dark:bg-neutral-700 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <Marquee className="flex flex-row md:max-w-[95vw] sm:max-w-[90vw] max-w-[85vw] wrapper_fade">
                {latestShots.map((photo) => (
                  <div key={photo._id} className="showcase">
                    <img
                      src={`${API_URL}/image/${photo.filename}`}
                      alt={photo.filename}
                      loading="lazy"
                      className="pointer-events-none"
                      onContextMenu={preventContextMenu}
                      style={{ WebkitTouchCallout: "none" }}
                    />
                  </div>
                ))}
              </Marquee>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
