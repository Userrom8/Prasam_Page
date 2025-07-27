import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const SkeletonPhoto = () => (
  <div className="flex items-center justify-center flex-col">
    <div className="bg-gray-300 dark:bg-neutral-700 animate-pulse 2xl:w-60 lg:w-52 md:w-48 sm:w-40 w-32 h-72 rounded-md shadow-lg"></div>
  </div>
);

const Content = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/files`)
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data.slice(0, 20));
      })
      .catch((err) => console.error("Failed to fetch photos:", err))
      .finally(() => setLoading(false));
  }, []);

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
        <div className="grid grid-cols-2 gap-y-10 sm:gap-y-20 md:grid-cols-3 lg:grid-cols-4 pt-20">
          {/* skeleton */}
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <SkeletonPhoto key={index} />
              ))
            : photos.map((photo) => (
                <div
                  key={photo._id}
                  className="flex items-center justify-center flex-col"
                >
                  <motion.img
                    src={`${API_URL}/image/${photo.filename}`}
                    alt={photo.filename}
                    loading="lazy"
                    className="bg-slate-500 2xl:w-60 lg:w-52 md:w-48 sm:w-40 w-32 h-auto rounded-md cursor-pointer shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    onClick={() =>
                      handleImageClick(`${API_URL}/image/${photo.filename}`)
                    }
                    onContextMenu={preventContextMenu}
                  />
                </div>
              ))}
        </div>

        <div className="text-center mt-20">
          <Link
            to="/gallery"
            className="shadow-[inset_0_0_0_2px_#616467] text-black px-8 py-3 rounded-full tracking-wide hover:tracking-widest uppercase font-thin bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition-all duration-500"
          >
            <span>View All Photos</span>
          </Link>
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
      </div>
    </div>
  );
};

export default Content;
