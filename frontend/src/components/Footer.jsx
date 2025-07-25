const Footer = () => {
  const socialLinks = [
    { name: "Facebook", url: "#", icon: "fab fa-facebook-f" },
    { name: "Twitter", url: "#", icon: "fab fa-twitter" },
    { name: "Instagram", url: "#", icon: "fab fa-instagram" },
    { name: "LinkedIn", url: "#", icon: "fab fa-linkedin-in" },
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

          {/* Quick Links */}
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

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Me</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
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
