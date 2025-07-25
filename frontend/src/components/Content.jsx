import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

const API_URL = import.meta.env.VITE_API_URL;

const Content = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch all image metadata from the backend
    fetch(`${API_URL}/files`)
      .then((res) => res.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error("Failed to fetch photos:", err));
  }, []);

  useEffect(() => {
    // Lock page scroll when the modal is open
    selectedImage ? disablePageScroll() : enablePageScroll();
  }, [selectedImage]);

  useEffect(() => {
    // Attempt to block screenshots
    const handleKeyDown = (e) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
        alert("Screenshots are disabled on this page.");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Prevent right-click context menu
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
        <div className="grid grid-cols-2 gap-y-40 lg+:grid-cols-4 md:grid-cols-3 pt-20">
          {photos.map((photo) => (
            <div key={photo._id} className="flex items-center flex-col">
              <motion.img
                src={`${API_URL}/image/${photo.filename}`}
                alt={photo.filename}
                loading="lazy"
                className="bg-slate-500 2xl:w-60 lg:w-52 md:w-48 xs:w-40 w-28 h-auto rounded-md cursor-pointer shadow-lg"
                whileHover={{ scale: 1.05 }}
                onClick={() =>
                  handleImageClick(`${API_URL}/image/${photo.filename}`)
                }
                onContextMenu={preventContextMenu}
              />
            </div>
          ))}
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
                style={{ WebkitTouchCallout: 'none' }}
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