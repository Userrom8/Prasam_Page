import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Footer = () => {
  const { pathname } = useLocation();

  const [linkedinLink, setLinkedinLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/content`)
      .then((res) => res.json())
      .then((data) => {
        if (data.linkedinLink) setLinkedinLink(data.linkedinLink);
        if (data.instagramLink) setInstagramLink(data.instagramLink);
        if (data.facebookLink) setFacebookLink(data.facebookLink);
      })
      .catch((err) => console.error("Failed to fetch contact email:", err));
  }, []);

  const socialLinks = [
    { name: "Facebook", url: `${facebookLink}`, icon: "fab fa-facebook-f" },
    { name: "Instagram", url: `${instagramLink}`, icon: "fab fa-instagram" },
    { name: "LinkedIn", url: `${linkedinLink}`, icon: "fab fa-linkedin-in" },
  ];

  return (
    <footer className="w-full dark:bg-neutral-900 bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Prasam Banerjee</h3>
            <p className="text-gray-400">
              Freelance photographer based in Kolkata, specializing in portrait
              and landscape photography.
            </p>
          </div>

          {pathname === "/" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#target-section" className="hover:text-sky-400">
                    Gallery
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-sky-400">
                    Client Reviews
                  </a>
                </li>
                <li>
                  <a href="#contact-section" className="hover:text-sky-400">
                    Contact Me
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Me</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  className="text-gray-400 hover:text-white"
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Coded and designed with love by
            userrom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
