import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Contact = () => {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/content`)
      .then((res) => res.json())
      .then((data) => {
        if (data.contactEmail) setEmail(data.contactEmail);
        if (data.contactNumber) setNumber(data.contactNumber);
        if (data.linkedinLink) setLinkedinLink(data.linkedinLink);
        if (data.instagramLink) setInstagramLink(data.instagramLink);
        if (data.facebookLink) setFacebookLink(data.facebookLink);
      })
      .catch((err) => console.error("Failed to fetch contact content:", err))
      .finally(() => setLoading(false));
  }, []);

  const SkeletonRow = () => (
    <div className="flex items-center">
      <div className="w-6 h-6 bg-gray-300 dark:bg-neutral-700 rounded-full mr-4 animate-pulse"></div>
      <div className="w-1/2 h-5 bg-gray-300 dark:bg-neutral-700 rounded-md animate-pulse"></div>
    </div>
  );

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
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : (
                <>
                  {email && (
                    <div className="flex items-center">
                      <i className="fas fa-envelope text-sky-500 fa-lg mr-4"></i>
                      <a
                        href={`mailto:${email}`}
                        className="hover:text-sky-400 text-lg truncate"
                      >
                        {email}
                      </a>
                    </div>
                  )}
                  {number && (
                    <div className="flex items-center">
                      <i className="fas fa-phone text-sky-500 fa-lg mr-4"></i>
                      <a
                        href={`tel:${number}`}
                        className="hover:text-sky-400 text-lg truncate"
                      >
                        {number}
                      </a>
                    </div>
                  )}
                  {linkedinLink && (
                    <div className="flex items-center">
                      <i className="fab fa-linkedin text-sky-500 fa-lg mr-4"></i>
                      <a
                        href={linkedinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-400 text-lg"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {instagramLink && (
                    <div className="flex items-center">
                      <i className="fab fa-instagram text-sky-500 fa-lg mr-4"></i>
                      <a
                        href={instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-400 text-lg"
                      >
                        Instagram
                      </a>
                    </div>
                  )}
                  {facebookLink && (
                    <div className="flex items-center">
                      <i className="fab fa-facebook text-sky-500 fa-lg mr-4"></i>
                      <a
                        href={facebookLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-400 text-lg"
                      >
                        Facebook
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
