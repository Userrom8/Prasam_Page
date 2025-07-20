const Contact = () => {
  return (
    <div id="contact-section" className="w-full dark:bg-neutral-800 bg-gray-200 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 md:px-10 text-center">
        <div className="section_header_container mb-10">
          <p className="section_header">Contact Me</p>
          <p className="section_header_text">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your visions.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
          <div className="space-y-6">
            <div className="flex items-center text-lg">
              <i className="fas fa-envelope text-sky-500 mr-4"></i>
              <a
                href="mailto:prasam.banerjee@example.com"
                className="hover:text-sky-400"
              >
                prasam.banerjee@example.com
              </a>
            </div>
            <div className="flex items-center text-lg">
              <i className="fab fa-linkedin text-sky-500 mr-4"></i>
              <a href="#" className="hover:text-sky-400">
                LinkedIn Profile
              </a>
            </div>
            <div className="flex items-center text-lg">
              <i className="fab fa-twitter text-sky-500 mr-4"></i>
              <a href="#" className="hover:text-sky-400">
                Twitter Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
