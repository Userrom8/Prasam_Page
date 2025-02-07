import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
const FadeInText = ({ text }) => {
  // eslint-disable-next-line react/prop-types
  const letters = text.split("");

  return (
    <div className="flex overflow-hidden">
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.5,
            ease: "easeOut",
          }}
          className="inline-block"
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
};

export default FadeInText;
