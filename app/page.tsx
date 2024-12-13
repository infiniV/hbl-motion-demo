"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
// import { motion } from "framer-motion";
import MainCircle from "@/components/MainCircle";
import BankSelectionModal from "@/components/BankSelectionModal";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<
    "debit" | "credit" | null
  >(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 overflow-hidden">
      <div className="fixed inset-50 flex items-center justify-center w-[600px] h-[600px]">
        <MainCircle onOptionClick={setSelectedOption} />
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
