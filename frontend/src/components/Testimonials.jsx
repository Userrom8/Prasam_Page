const testimonials = [
  {
    name: "John Doe",
    title: "Incredible Experience!",
    quote:
      "Working with Prasam was an absolute pleasure. The creativity and professionalism brought to the project were outstanding. The final photos exceeded all our expectations!",
    company: "ABC Corp",
  },
  {
    name: "Jane Smith",
    title: "Highly Recommended",
    quote:
      "The attention to detail and the ability to capture the perfect moment is what sets Prasam apart. I would highly recommend their services to anyone.",
    company: "Creative Solutions",
  },
  {
    name: "Sam Wilson",
    title: "A True Professional",
    quote:
      "From start to finish, the process was seamless and professional. The quality of the work is exceptional, and I couldn't be happier with the results.",
    company: "Marketing Gurus",
  },
];

const Testimonials = () => {
  return (
    <div
      id="testimonials"
      className="w-full dark:bg-neutral-900 bg-gray-100 py-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 md:px-10">
        <div className="section_header_container mb-12 text-center">
          <p className="section_header">Testimonials</p>
          <p className="section_header_text">What my clients are saying</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="dark:bg-neutral-800 bg-white p-8 rounded-lg shadow-lg text-center"
            >
              <p className="text-xl italic mb-6">
                &quot;{testimonial.quote}&quot;
              </p>
              <p className="font-bold text-lg">{testimonial.name}</p>
              <p className="text-gray-500 dark:text-gray-400">
                {testimonial.company}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
