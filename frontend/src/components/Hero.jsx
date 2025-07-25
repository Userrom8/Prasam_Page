import { useState, useEffect, useContext } from "react";
import Marquee from "react-fast-marquee";

import { HeroDarkImg, HeroLightImg } from "../assets";
import ThemeContext from "../services/theme";

const API_URL = import.meta.env.VITE_API_URL;

const Hero = () => {
  const { dark } = useContext(ThemeContext);
  const [latestShots, setLatestShots] = useState([]);

  useEffect(() => {
    // Fetch all image metadata from the backend
    fetch(`${API_URL}/files`)
      .then((res) => res.json())
      .then((data) => {
        // Sort by creation date and take the 7 most recent
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestShots(sortedData.slice(0, 7));
      })
      .catch((err) => console.error("Failed to fetch latest shots:", err));
  }, []);

  return (
    <div className="flex items-center justify-center md:flex-row flex-col dark:md:gap-0 md:gap-4 gap-16 dark:ml-0 md:ml-4 ml-0 lg:px-16 md:px-10 px-6 py-10 max-w-7xl pb-40">
      <img
        src={dark ? HeroDarkImg : HeroLightImg}
        alt="Full-shot of Prasam"
        loading="lazy"
        className="w-[50%] border-sky-100 border-4 rounded-2xl dark:border-none shadow-black shadow-2xl dark:shadow-none"
      />

      <div className="flex flex-col gap-20 mt-10 lg:mt-0">
        <div className="relative">
          <p className="dark:text-white text-black font-poppins tracking-wider">
            Hello there. nice to meet you. i am
          </p>
          <p className="font-Rouge leading-none text-sky-500 2xl:text-[16rem] xl:text-[14rem] lg:text-[12rem] md:text-[10rem] text-[7rem]">
            Prasam
          </p>
          <p className="dark:text-white text-black font-poppins dark:font-thin font-extralight tracking-wide">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia quo
            error expedita cum, doloremque cumque assumenda ipsam, doloribus,
            asperiores itaque mollitia? Alias vero obcaecati quas doloribus
            culpa sint voluptatum? Nobis.
          </p>
        </div>
        <div className="flex flex-col gap-2 xl:max-w-[36rem] lg:max-w-[32rem] md:max-w-[25rem]">
          <div className="flex flex-row justify-between items-baseline ml-4 max-w-[90vw]">
            <p className="tracking-wider">Latest shots</p>
            <a
              href="#target-section"
              className="text-sm font-extralight cursor-pointer dark:text-blue-400 text-blue-600 tracking-wide md:pr-4 pr-0 transition-transform duration-300 hover:scale-125 hover:text-blue-800 dark:hover:text-blue-600"
            >
              view all
            </a>
          </div>
          <div className="flex items-center justify-center">
            <Marquee className="flex flex-row md:max-w-[95vw] sm:max-w-[90vw] max-w-[85vw] wrapper_fade">
              {latestShots.map((photo) => (
                <div key={photo._id} className="showcase">
                  <img
                    src={`${API_URL}/image/${photo.filename}`}
                    alt={photo.filename}
                    loading="lazy"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
