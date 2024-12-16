// import { motion } from "framer-motion";

// interface MainCircleProps {
//   onOptionClick: (option: "debit" | "credit") => void;
//   bankName: string; // Add this line
// }

// const draw = {
//   hidden: { pathLength: 0, opacity: 0 },
//   visible: (i: number) => ({
//     pathLength: 1.01, // Slightly over 1 to ensure complete closure
//     opacity: 1,
//     transition: {
//       pathLength: { delay: i * 0.5, type: "spring", duration: 2, bounce: 0 },
//       opacity: { delay: i * 0.5, duration: 0.01 },
//     },
//   }),
// };

// const MainCircle = ({ onOptionClick, bankName }: MainCircleProps) => {
//   return (
//     <motion.div
//       className="relative w-[400px] h-[400px] flex items-center justify-center"
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//     >
//       {/* Add bank name */}
//       <div className="absolute top-4 text-xl font-bold text-zinc-100">
//         {bankName}
//       </div>

//       <motion.svg
//         width="100%"
//         height="100%"
//         viewBox="0 0 600 600"
//         initial="hidden"
//         animate="visible"
//         className="absolute scale-[0.8]"
//       >
//         <motion.circle
//           cx="300"
//           cy="300"
//           r="250"
//           stroke="#52525b"
//           strokeWidth="6"
//           strokeLinecap="round" // Add this line
//           fill="transparent"
//           variants={draw}
//           custom={1}
//         />
//         <motion.circle
//           cx="174"
//           cy="300"
//           r="90"
//           stroke="#52525b"
//           strokeWidth="2"
//           strokeLinecap="round" // Add this line
//           fill="transparent"
//           variants={draw}
//           custom={2}
//         />
//         <motion.circle
//           cx="426"
//           cy="300"
//           r="90"
//           stroke="#52525b"
//           strokeWidth="2"
//           strokeLinecap="round" // Add this line
//           fill="transparent"
//           variants={draw}
//           custom={2}
//         />
//       </motion.svg>

//       <div className="relative flex items-center justify-between w-[80%] max-w-4xl scale-[0.8]">
//         <motion.button
//           className="w-[120px] h-[120px] rounded-full bg-zinc-800/90 text-zinc-100 font-bold shadow-lg border border-zinc-700 backdrop-blur-md flex items-center justify-center m-4"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.95 }}
//           whileDrag={{ scale: 0.9, rotate: 10 }}
//           drag
//           dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
//           dragElastic={0.4}
//           dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
//           onClick={() => onOptionClick("debit")}
//         >
//           <span className="text-xl">Debit</span>
//         </motion.button>

//         <motion.button
//           className="w-[120px] h-[120px] rounded-full bg-zinc-800/90 text-zinc-100 font-bold shadow-lg border border-zinc-700 backdrop-blur-md flex items-center justify-center m-4"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.95 }}
//           whileDrag={{ scale: 0.9, rotate: -10 }}
//           drag
//           dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
//           dragElastic={0.4}
//           dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
//           onClick={() => onOptionClick("credit")}
//         >
//           <span className="text-xl">Credit</span>
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// };

// export default MainCircle;
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface MainCircleProps {
  onOptionClick: (option: "debit" | "credit") => void;
  bankName: string;
  isCentralBank: boolean;
  onDragUpdate: (newPosition: { x: number; y: number }) => void; // New prop to update position
  debit: number; // Added prop for debit value
  credit: number; // Added prop for credit value
  viewport?: { width: number; height: number };
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1.01,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.5, type: "spring", duration: 2, bounce: 0 },
      opacity: { delay: i * 0.5, duration: 0.01 },
    },
  }),
};

const MainCircle = ({
  onOptionClick,
  bankName,
  isCentralBank,
  onDragUpdate,
  debit,
  credit,
  viewport = { width: 1000, height: 800 },
}: MainCircleProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showDebitTooltip, setShowDebitTooltip] = useState(false);
  const [showCreditTooltip, setShowCreditTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrag = (event: any, info: any) => {
    const newPosition = {
      x: info.point.x,
      y: info.point.y,
    };
    setPosition(newPosition);
    onDragUpdate(newPosition); // Update parent with the new position
  };

  // Determine which button should blink
  const shouldDebitBlink = debit > credit;
  const shouldCreditBlink = credit > debit;

  return mounted ? (
    <motion.div
      className="relative w-[400px] h-[400px] flex items-center justify-center z-10"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      drag
      dragMomentum={false}
      dragConstraints={{
        top: 0,
        left: 0,
        right: viewport.width,
        bottom: viewport.height,
      }}
      onDrag={handleDrag}
      style={{ x: position.x, y: position.y }}
    >
      <div className="absolute top-4 text-xl font-bold text-zinc-100 z-20">
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
          strokeLinecap="round"
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
          strokeLinecap="round"
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
          strokeLinecap="round"
          fill="transparent"
          variants={draw}
          custom={2}
        />
      </motion.svg>

      <div className="relative flex items-center justify-between w-[80%] max-w-4xl scale-[0.8] z-10">
        {/* Debit Button */}
        <div className="relative">
          <motion.button
            className={`w-[120px] h-[120px] rounded-full bg-zinc-800/90 text-zinc-100 font-bold shadow-lg border backdrop-blur-md flex items-center justify-center m-4`}
            whileHover={{ scale: 1.1, backgroundColor: "#dc2626" }} // Change background color on hover
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setShowDebitTooltip(true)}
            onMouseLeave={() => setShowDebitTooltip(false)}
            onClick={() => onOptionClick("debit")}
            style={{
              borderColor: "#dc2626",
            }}
          >
            {shouldDebitBlink && (
              <motion.div
                animate={{
                  borderColor: ["#dc2626", "#ffffff", "#dc2626"], // Blinking effect (red to white)
                }}
                transition={{
                  duration: 1.5, // Duration for one complete blink cycle
                  repeat: Infinity, // Infinite repetition
                }}
                className="absolute inset-0 w-full h-full rounded-full border-2 pointer-events-none"
              />
            )}
            <span className="text-xl">Debit</span>
          </motion.button>

          {isCentralBank
            ? ""
            : showDebitTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white text-black p-1 rounded shadow">
                  <strong>{debit}</strong>
                </div>
              )}
        </div>

        {/* Credit Button */}
        <div className="relative">
          <motion.button
            className={`w-[120px] h-[120px] rounded-full bg-zinc-800/90 text-zinc-100 font-bold shadow-lg border border-green-500 backdrop-blur-md flex items-center justify-center m-4`}
            whileHover={{ scale: 1.1, backgroundColor: "#16a34a" }} // Change background color on hover
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setShowCreditTooltip(true)}
            onMouseLeave={() => setShowCreditTooltip(false)}
            onClick={() => onOptionClick("credit")}
          >
            {shouldCreditBlink && (
              <motion.div
                animate={{
                  borderColor: ["#16a34a", "#ffffff", "#16a34a"], // Blinking effect (green to white)
                }}
                transition={{
                  duration: 1.5, // Duration for one complete blink cycle
                  repeat: Infinity, // Infinite repetition
                }}
                className="absolute inset-0 w-full h-full rounded-full border-2 pointer-events-none"
              />
            )}
            <span className="text-xl">Credit</span>
          </motion.button>

          {isCentralBank
            ? ""
            : showCreditTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white text-black p-1 rounded shadow">
                  <strong>{credit}</strong>
                </div>
              )}
        </div>
      </div>
    </motion.div>
  ) : null;
};

export default MainCircle;
