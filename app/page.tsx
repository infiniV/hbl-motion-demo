"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import BankSelectionModal from "@/components/BankSelectionModal";
import MainCircleNode from "@/components/MainCircleNode";

const banks = ["HBL Bank", "Meezan Bank", "Allied Bank", "Bank Alfalah"];

// Custom node types
const nodeTypes = {
  mainCircle: MainCircleNode,
};

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<
    "debit" | "credit" | null
  >(null);

  // Create initial nodes in a grid layout
  const initialNodes: Node[] = banks.map((bank, index) => ({
    id: `bank-${index}`,
    type: "mainCircle",
    position: {
      x: (index % 2) * 500 + 100,
      y: Math.floor(index / 2) * 500 + 100,
    },
    data: {
      bankName: bank,
      onOptionClick: setSelectedOption,
    },
  }));

  // Create edges connecting the nodes
  const initialEdges: Edge[] = [
    { id: "e1-2", source: "bank-0", target: "bank-1", animated: true },
    { id: "e1-3", source: "bank-0", target: "bank-2", animated: true },
    { id: "e2-4", source: "bank-1", target: "bank-3", animated: true },
    { id: "e3-4", source: "bank-2", target: "bank-3", animated: true },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onInit = useCallback(() => {
    console.log("flow loaded");
  }, []);

  return (
    <main className="h-screen bg-zinc-900">
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          nodeTypes={nodeTypes}
          fitView
          className="bg-zinc-900"
        >
          <Background />
          <Controls className="text-zinc-100" />
          <MiniMap />
        </ReactFlow>
      </div>

      <AnimatePresence>
        {selectedOption && (
          <div className="fixed inset-0 flex items-center justify-center">
            <BankSelectionModal
              type={selectedOption}
              onClose={() => setSelectedOption(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
