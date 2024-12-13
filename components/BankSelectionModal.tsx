import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import BankDetails from "./BankDetails";

interface BankSelectionModalProps {
  type: "debit" | "credit";
  onClose: () => void;
  className?: string;
}

const BankSelectionModal = ({
  type,
  onClose,
  className = "",
}: BankSelectionModalProps) => {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const banks = [
    "Region 1 - Defense",
    "Region 2 - Gulberg",
    "Region 3 - Johar Town",
    "Region 4 - Model Town",
    "Region 5 - Garden Town",
    "Region 6 - Gulshan-e-Ravi",
  ];

  return (
    <motion.div
      className={`flex items-center ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <LayoutGroup>
        <div className="relative flex gap-8">
          <motion.div layout className="relative">
            <Card className="w-[320px] bg-zinc-900 border-zinc-800 text-zinc-100">
              <CardHeader>
                <h2 className="text-xl font-bold">
                  {type.toUpperCase()} - Select Bank
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {banks.map((bank) => (
                    <motion.div
                      key={bank}
                      layout
                      onClick={() => setSelectedBank(bank)}
                      className="relative flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-800 cursor-pointer"
                    >
                      <Checkbox
                        id={bank}
                        checked={selectedBank === bank}
                        className="border-zinc-600"
                      />
                      <label htmlFor={bank} className="text-zinc-200 flex-1">
                        {bank}
                      </label>
                      {selectedBank === bank && (
                        <motion.div
                          layoutId="highlight"
                          className="absolute inset-0 bg-zinc-800 rounded-lg -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700"
                >
                  Close
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {selectedBank && (
              <BankDetails
                key="details"
                bank={selectedBank}
                type={type}
                onBack={() => setSelectedBank(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </motion.div>
  );
};

export default BankSelectionModal;
