import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Contact = () => {
  const [email, setEmail] = useState("your-email@example.com");

  useEffect(() => {
    fetch(`${API_URL}/content`)
      .then((res) => res.json())
      .then((data) => {
        if (data.contactEmail) setEmail(data.contactEmail);
      })
      .catch((err) => console.error("Failed to fetch contact email:", err));
  }, []);

  return (
    <div id="contact-section" className="w-full py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 md:px-10">
        <div className="section_header_container mb-12 text-center">
          <p className="section_header">Let&apos;s Create Together</p>
          <p className="section_header_text">
            Have a project in mind? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Personal Message */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold mb-4">Let&apos;s Connect</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              I&apos;m passionate about capturing moments and telling stories
              through my lens. If you&apos;re looking for a photographer who is
              dedicated, creative, and easy to work with, I&apos;m your person.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Whether you have a question about my work, want to collaborate, or
              just want to say hello, feel free to reach out.
            </p>
          </div>

          {/* Right Column: Contact Details */}
          <div className="dark:bg-neutral-800 bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Contact Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-center">
                <i className="fas fa-envelope text-sky-500 fa-lg mr-4"></i>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-sky-400 text-lg"
                >
                  {email}
                </a>
              </div>
              <div className="flex items-center">
                <i className="fab fa-linkedin text-sky-500 fa-lg mr-4"></i>
                <a href="#" className="hover:text-sky-400 text-lg">
                  LinkedIn
                </a>
              </div>
              <div className="flex items-center">
                <i className="fab fa-instagram text-sky-500 fa-lg mr-4"></i>
                <a href="#" className="hover:text-sky-400 text-lg">
                  Instagram
                </a>
              </div>
              <div className="flex items-center">
                <i className="fab fa-twitter text-sky-500 fa-lg mr-4"></i>
                <a href="#" className="hover:text-sky-400 text-lg">
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
