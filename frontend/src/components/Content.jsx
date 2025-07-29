/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Photo = ({ photo, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageUrl = `${API_URL}/image/${photo.filename}`;

  const preventContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    // This container sets the final dimensions from the start, preventing layout shifts.
    // It's positioned relatively to anchor the absolutely positioned image.
    <div className="relative 2xl:w-60 lg:w-52 md:w-48 sm:w-40 w-32 md:h-72 sm:h-60 h-44">
      {/* The skeleton is a simple div that fills the container. */}
      <div className="bg-gray-300 dark:bg-neutral-700 animate-pulse w-full h-full rounded-md shadow-lg"></div>

      {/* The image is positioned absolutely to layer on top of the skeleton. */}
      <motion.img
        src={imageUrl}
        alt={photo.filename}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0 }} // Fades in when loaded
        className="absolute inset-0 w-full h-full object-cover rounded-md cursor-pointer shadow-lg transition-opacity duration-500 ease-in-out"
        whileHover={{ scale: 1.05 }}
        onClick={() => onClick(imageUrl)}
        onContextMenu={preventContextMenu}
      />
    </div>
  );
};

const Content = ({ photos, loading }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    selectedImage ? disablePageScroll() : enablePageScroll();
  }, [selectedImage]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const preventContextMenu = (e) => {
    e.preventDefault();
  };

  // Helper component for the loading state skeleton grid
  const SkeletonGrid = () => (
    <>
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 dark:bg-neutral-700 animate-pulse 2xl:w-60 lg:w-52 md:w-48 sm:w-40 w-32 md:h-72 sm:h-60 h-44 rounded-md shadow-lg"
        ></div>
      ))}
    </>
  );

  return (
    <div
      id="target-section"
      className="w-full flex justify-center bg-gray-200 dark:bg-neutral-800"
    >
      <div className="lg:px-16 md:px-10 px-6 py-20 w-full max-w-7xl">
        <div className="section_header_container">
          <p className="section_header">Gallery</p>
          <p className="section_header_text">
            Memories, I was able to capture in a frame...
          </p>
        </div>
        <div className="grid grid-cols-2 place-items-center gap-y-10 sm:gap-y-20 md:grid-cols-3 lg:grid-cols-4 pt-20">
          {loading ? (
            <SkeletonGrid />
          ) : (
            photos.map((photo) => (
              <Photo key={photo._id} photo={photo} onClick={handleImageClick} />
            ))
          )}
        </div>

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-25 backdrop-blur-sm pt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              onContextMenu={preventContextMenu}
            >
              <motion.img
                src={selectedImage}
                alt="Full Size"
                loading="lazy"
                className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl pointer-events-none"
                style={{ WebkitTouchCallout: "none" }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onContextMenu={preventContextMenu}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mt-20">
          <Link
            to="/gallery"
            className="shadow-[inset_0_0_0_2px_#616467] text-black px-8 py-3 rounded-full tracking-wide hover:tracking-widest uppercase font-thin bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition-all duration-500"
          >
            <span>View All Photos</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Content;
