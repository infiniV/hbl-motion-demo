"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MainCircle from "@/components/MainCircle";
import BankSelectionModal from "@/components/BankSelectionModal";

const banks = ["HBL Bank", "Meezan Bank", "Allied Bank", "Bank Alfalah"];

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<
    "debit" | "credit" | null
  >(null);

  return (
    <main className="min-h-screen bg-zinc-900 p-12 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 place-items-center max-w-7xl mx-auto">
        {banks.map((bank) => (
          <MainCircle
            key={bank}
            bankName={bank}
            onOptionClick={setSelectedOption}
          />
        ))}
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
