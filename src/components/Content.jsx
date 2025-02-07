import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { disablePageScroll, enablePageScroll } from "scroll-lock";

import photos from "../assets/showcase";

const Content = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  

  useEffect(() => {
    selectedImage ? disablePageScroll() : enablePageScroll();
  }, [selectedImage]);

  return (
    <div className="w-full flex justify-center bg-gray-200 dark:bg-neutral-800">
      <div className="lg:px-16 md:px-10 px-6 py-20 w-full max-w-7xl">
        <div className="section_header_container">
          <p className="section_header">Gallery</p>
          <p className="section_header_text">
            Memories, I was able to capture in a frame...
          </p>
        </div>
        <div className="grid grid-cols-2 gap-y-40 lg+:grid-cols-4 md:grid-cols-3 pt-20">
          {Object.keys(photos).map((item) => (
            <div key={item} className="flex items-center flex-col">
              <motion.img
                src={photos[item]}
                alt={item}
                className="bg-slate-500 2xl:w-60 lg:w-52 md:w-48 sm:w-60 w-40 h-auto rounded-md cursor-pointer shadow-lg"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedImage(photos[item])}
              />
            </div>
          ))}
        </div>

        {/* Fullscreen Pop-Out */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-opacity-25 backdrop-blur-sm pt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.img
                src={selectedImage}
                alt="Full Image"
                className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Content;
