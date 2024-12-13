import { motion } from "framer-motion";

interface MainCircleProps {
  onOptionClick: (option: "debit" | "credit") => void;
  bankName: string; // Add this line
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1.01, // Slightly over 1 to ensure complete closure
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.5, type: "spring", duration: 2, bounce: 0 },
      opacity: { delay: i * 0.5, duration: 0.01 },
    },
  }),
};

const MainCircle = ({ onOptionClick, bankName }: MainCircleProps) => {
  return (
    <motion.div
      className="relative w-[400px] h-[400px] flex items-center justify-center"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Add bank name */}
      <div className="absolute top-4 text-xl font-bold text-zinc-100">
        {bankName}
      </div>

      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 600 600"
        initial="hidden"
        animate="visible"
        className="absolute scale-[0.8]"
      >
        <motion.circle
          cx="300"
          cy="300"
          r="250"
          stroke="#52525b"
          strokeWidth="6"
          strokeLinecap="round" // Add this line
          fill="transparent"
          variants={draw}
          custom={1}
        />
        <motion.circle
          cx="174"
          cy="300"
          r="90"
          stroke="#52525b"
          strokeWidth="2"
          strokeLinecap="round" // Add this line
          fill="transparent"
          variants={draw}
          custom={2}
        />
        <motion.circle
          cx="426"
          cy="300"
          r="90"
          stroke="#52525b"
          strokeWidth="2"
          strokeLinecap="round" // Add this line
          fill="transparent"
          variants={draw}
          custom={2}
        />
      </motion.svg>

      <div className="relative flex items-center justify-between w-[80%] max-w-4xl scale-[0.8]">
        <motion.button
          className="w-[120px] h-[120px] rounded-full bg-zinc-800/90 text-zinc-100 font-bold shadow-lg border border-zinc-700 backdrop-blur-md flex items-center justify-center m-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          whileDrag={{ scale: 0.9, rotate: 10 }}
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0.4}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          onClick={() => onOptionClick("debit")}
        >
          <span className="text-xl">Debit</span>
        </motion.button>

        <motion.button
          className="w-[120px] h-[120px] rounded-full bg-zinc-800/90 text-zinc-100 font-bold shadow-lg border border-zinc-700 backdrop-blur-md flex items-center justify-center m-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          whileDrag={{ scale: 0.9, rotate: -10 }}
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0.4}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          onClick={() => onOptionClick("credit")}
        >
          <span className="text-xl">Credit</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MainCircle;
