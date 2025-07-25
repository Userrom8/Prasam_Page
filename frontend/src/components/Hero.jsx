import Marquee from "react-fast-marquee";

import { HeroDarkImg, HeroLightImg } from "../assets";
import ThemeContext from "../services/theme";

import { useContext } from "react";

import shots from "../assets/showcase";

const Hero = () => {
  const { dark } = useContext(ThemeContext);

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
              {Object.keys(shots)
                .slice(0, 7) //for showing limited number of pics
                .map((items) => (
                  <div key={items} className="showcase">
                    <img src={shots[items]} alt={items} loading="lazy" />
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
