import { useState, useEffect } from "react";
import { defaultAvatar } from "../assets";

const API_URL = import.meta.env.VITE_API_URL;

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Fetch testimonials from the backend
    fetch(`${API_URL}/content`)
      .then((res) => res.json())
      .then((data) => {
        if (data.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch((err) =>
        console.error("Failed to fetch testimonials content:", err)
      );
  }, []);

  // If there are no testimonials with content, don't render the section
  if (testimonials.every((t) => !t.name && !t.text)) {
    return null;
  }

  return (
    <div
      id="testimonials"
      className="w-full dark:bg-neutral-900 bg-gray-100 py-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 md:px-10">
        <div className="section_header_container mb-16 text-center">
          <p className="section_header">Testimonials</p>
          <p className="section_header_text">What my clients are saying</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) =>
            // Only render the testimonial card if it has content
            testimonial.name && testimonial.text ? (
              <div
                key={index}
                className="dark:bg-neutral-800 bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center"
              >
                <img
                  // Use the testimonial image if it exists, otherwise fall back to the default avatar
                  src={testimonial.image || defaultAvatar}
                  alt={testimonial.name}
                  className="w-24 h-24 rounded-full object-cover -mt-16 border-4 border-white dark:border-neutral-800 shadow-lg"
                />
                <p className="text-lg italic mt-8 mb-6 text-gray-700 dark:text-gray-300">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="mt-auto">
                  <p className="font-bold text-xl text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
