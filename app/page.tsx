// "use client";

// import { useState, useCallback } from "react";
// import { AnimatePresence } from "framer-motion";
// import ReactFlow, {
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   Node,
//   Edge,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import BankSelectionModal from "@/components/BankSelectionModal";
// import MainCircleNode from "@/components/MainCircleNode";

// const banks = ["HBL Bank", "Meezan Bank", "Allied Bank", "Bank Alfalah"];

// // Custom node types
// const nodeTypes = {
//   mainCircle: MainCircleNode,
// };

// export default function Home() {
//   const [selectedOption, setSelectedOption] = useState<
//     "debit" | "credit" | null
//   >(null);

//   // Create initial nodes in a grid layout
//   const initialNodes: Node[] = banks.map((bank, index) => ({
//     id: `bank-${index}`,
//     type: "mainCircle",
//     position: {
//       x: (index % 2) * 500 + 100,
//       y: Math.floor(index / 2) * 500 + 100,
//     },
//     data: {
//       bankName: bank,
//       onOptionClick: setSelectedOption,
//     },
//   }));

//   // Create edges connecting the nodes
//   const initialEdges: Edge[] = [
//     { id: "e1-2", source: "bank-0", target: "bank-1", animated: true },
//     { id: "e1-3", source: "bank-0", target: "bank-2", animated: true },
//     { id: "e2-4", source: "bank-1", target: "bank-3", animated: true },
//     { id: "e3-4", source: "bank-2", target: "bank-3", animated: true },
//   ];

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onInit = useCallback(() => {
//     console.log("flow loaded");
//   }, []);

//   return (
//     <main className="h-screen bg-zinc-900">
//       <div className="w-full h-full">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onInit={onInit}
//           nodeTypes={nodeTypes}
//           fitView
//           className="bg-zinc-900"
//         >
//           <Background />
//           <Controls className="text-zinc-100" />
//           <MiniMap />
//         </ReactFlow>
//       </div>

//       <AnimatePresence>
//         {selectedOption && (
//           <div className="fixed inset-0 flex items-center justify-center">
//             <BankSelectionModal
//               type={selectedOption}
//               onClose={() => setSelectedOption(null)}
//             />
//           </div>
//         )}
//       </AnimatePresence>
//     </main>
//   );
// }
"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import MainCircle from "@/components/MainCircle";
import BankSelectionModal from "@/components/BankSelectionModal";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const calculateBorderPoint = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  radius: number,
  buffer: number = 15 // Adjusted buffer for better alignment
) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return { x: from.x, y: from.y };

  const factor = (radius + buffer) / distance;
  return {
    x: from.x + dx * factor,
    y: from.y + dy * factor,
  };
};

const ArrowLayer = ({
  arrows,
  width,
  height,
}: {
  arrows: Array<{
    from: { x: number; y: number };
    to: { x: number; y: number };
    color: string;
    width: number;
  }>;
  width: number;
  height: number;
}) => (
  <svg
    className="absolute top-0 left-0 w-full h-full pointer-events-none"
    viewBox={`0 0 ${width} ${height}`}
  >
    <defs>
      {arrows.map((arrow, index) => (
        <marker
          id={`arrowhead-${index}`}
          key={`marker-${index}`}
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <polygon points="0 0, 5 2.5, 0 5" fill={arrow.color} />
        </marker>
      ))}
    </defs>
    {arrows.map((arrow, index) => (
      <Arrow
        key={index}
        from={arrow.from}
        to={arrow.to}
        color={arrow.color}
        strokeWidth={arrow.width}
        markerId={`arrowhead-${index}`}
        // delay={index * 0.2} // Add a delay for each arrow to stagger the pulses
      />
    ))}
  </svg>
);

const Arrow = ({
  from,
  to,
  color,
  strokeWidth,
  markerId,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  strokeWidth: number;
  markerId: string;
}) => (
  <motion.line
    x1={from.x}
    y1={from.y}
    x2={to.x}
    y2={to.y}
    stroke={color}
    strokeWidth={strokeWidth}
    markerEnd={`url(#${markerId})`}
    strokeLinecap="round"
    initial={{
      scale: 1, // Start at normal size
      strokeOpacity: 0, // Start invisible
    }}
    animate={{
      scale: [1, 1, 1], // Pulse effect, scaling up and back down
      strokeOpacity: 1, // Fade in
    }}
    transition={{
      scale: {
        repeat: Infinity, // Repeat the pulse infinitely
        repeatType: "loop", // Loop the scaling effect
        duration: 1, // Duration of one pulse cycle
        ease: "easeInOut", // Smooth easing
      },
      strokeOpacity: { duration: 0 }, // Fade-in duration
    }}
  />
);

const Home = () => {
  const [selectedOption, setSelectedOption] = useState<
    "debit" | "credit" | null
  >(null);
  const [newBankName, setNewBankName] = useState("");
  const [showBankInput, setShowBankInput] = useState(false);

  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // Set initial dimensions
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const circleRadius = 200;

  const [surroundingBanks, setSurroundingBanks] = useState(() => [
    { name: "Meezan Bank", position: { x: 0, y: 0 }, debit: 500, credit: 600 },
    { name: "Allied Bank", position: { x: 0, y: 0 }, debit: 800, credit: 700 },
    { name: "Bank Alfalah", position: { x: 0, y: 0 }, debit: 200, credit: 100 },
    { name: "UBL Bank", position: { x: 0, y: 0 }, debit: 400, credit: 550 },
  ]);

  useEffect(() => {
    if (windowDimensions.width && windowDimensions.height) {
      const initialPositions = [
        {
          x: windowDimensions.width / 2 - 300,
          y: windowDimensions.height / 2 - 260,
        },
        {
          x: windowDimensions.width / 2 + 300,
          y: windowDimensions.height / 2 - 260,
        },
        {
          x: windowDimensions.width / 2 - 300,
          y: windowDimensions.height / 2 + 260,
        },
        {
          x: windowDimensions.width / 2 + 300,
          y: windowDimensions.height / 2 + 260,
        },
      ];

      setSurroundingBanks((prevBanks) =>
        prevBanks.map((bank, index) => ({
          ...bank,
          position: initialPositions[index],
        }))
      );
    }
  }, [windowDimensions]);

  const centralBank = useMemo(
    () => ({
      x: windowDimensions.width / 2,
      y: windowDimensions.height / 2,
    }),
    [windowDimensions]
  );

  const updateBankPosition = (
    bankName: string,
    newPosition: { x: number; y: number }
  ) => {
    setSurroundingBanks((prevBanks) =>
      prevBanks.map((bank) =>
        bank.name === bankName ? { ...bank, position: newPosition } : bank
      )
    );
  };

  const arrows = useMemo(() => {
    return surroundingBanks.map((bank) => {
      // Determine the direction of the arrow based on debit and credit
      const isDebitHigher = bank.debit > bank.credit;

      return {
        from: isDebitHigher
          ? calculateBorderPoint(bank.position, centralBank, circleRadius, 40) // Debit higher, points to HBL
          : calculateBorderPoint(centralBank, bank.position, circleRadius, 40), // Credit higher, points away from HBL
        to: isDebitHigher
          ? calculateBorderPoint(centralBank, bank.position, circleRadius, 40) // Debit higher, points to HBL
          : calculateBorderPoint(bank.position, centralBank, circleRadius, 40), // Credit higher, points away from HBL
        color:
          bank.name === "Allied Bank" || bank.name === "Bank Alfalah"
            ? "#d63031"
            : "#00b894", // Red for Allied/Alfalah, Green for others
        width: 2,
      };
    });
  }, [surroundingBanks, centralBank]);

  const handleAddBank = () => {
    if (newBankName.trim() === "") return;

    const angle = (Math.PI * 2) / (surroundingBanks.length + 1);
    const newPosition = {
      x:
        centralBank.x +
        Math.cos(angle * surroundingBanks.length) * (circleRadius + 150),
      y:
        centralBank.y +
        Math.sin(angle * surroundingBanks.length) * (circleRadius + 150),
    };

    setSurroundingBanks((prevBanks) => {
      const newBanks = [
        ...prevBanks,
        { name: newBankName, position: newPosition, debit: 0, credit: 0 }, // New Bank
      ];

      // Recalculate positions for all banks to maintain alignment
      return newBanks.map((bank, index) => {
        const newAngle = ((Math.PI * 2) / newBanks.length) * index; // evenly spread out
        return {
          ...bank,
          position: {
            x: centralBank.x + Math.cos(newAngle) * (circleRadius + 150),
            y: centralBank.y + Math.sin(newAngle) * (circleRadius + 150),
          },
        };
      });
    });

    setNewBankName("");
    setShowBankInput(false);
  };

  return (
    <main className="relative min-h-screen bg-zinc-900 overflow-hidden">
      {mounted && (
        <>
          <ArrowLayer
            arrows={arrows}
            width={windowDimensions.width || 1000}
            height={windowDimensions.height || 800}
          />

          <div className="relative w-full h-screen flex items-center justify-center">
            {/* Central Bank */}
            <div
              className="absolute z-10"
              style={{
                top: centralBank.y - circleRadius,
                left: centralBank.x - circleRadius,
              }}
            >
              <MainCircle
                key="HBL Bank"
                bankName="HBL Bank"
                onOptionClick={setSelectedOption}
                isCentralBank={true}
                onDragUpdate={() => {}}
                debit={0}
                credit={0}
                viewport={windowDimensions}
              />
            </div>

            {/* Surrounding Banks */}
            {surroundingBanks.map((bank) => (
              <div
                key={bank.name}
                className="absolute"
                style={{
                  top: bank.position.y - circleRadius,
                  left: bank.position.x - circleRadius,
                }}
              >
                <MainCircle
                  bankName={bank.name}
                  onOptionClick={setSelectedOption}
                  isCentralBank={false}
                  onDragUpdate={(newPosition) =>
                    updateBankPosition(bank.name, newPosition)
                  }
                  debit={bank.debit}
                  credit={bank.credit}
                  viewport={windowDimensions}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Bank Button */}
      <Button
        onClick={() => setShowBankInput(!showBankInput)}
        className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full"
      >
        Add Bank
      </Button>

      {/* Bank Input Form */}
      {showBankInput && (
        <div className="absolute top-20 right-4 bg-white p-4 rounded-lg shadow-md">
          <input
            type="text"
            value={newBankName}
            onChange={(e) => setNewBankName(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            placeholder="Enter Bank Name"
          />
          <button
            onClick={handleAddBank}
            className="mt-2 bg-green-500 text-white p-2 rounded"
          >
            Add Bank
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedOption && (
          <BankSelectionModal
            type={selectedOption}
            onClose={() => setSelectedOption(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default Home;
