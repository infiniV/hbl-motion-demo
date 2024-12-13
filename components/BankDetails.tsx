import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface BankDetailsProps {
  bank: string;
  type: "debit" | "credit";
  onBack: () => void;
}

const BankDetails = ({ bank, onBack }: BankDetailsProps) => {
  const x = useMotionValue(0);
  const xInput = [-100, 0, 100];
  const opacity = useTransform(x, xInput, [0, 1, 0]);
  const scale = useTransform(x, xInput, [0.8, 1, 0.8]);
  const background = useTransform(x, xInput, [
    "linear-gradient(180deg, #18181b 0%, #27272a 100%)",
    "linear-gradient(180deg, #18181b 0%, #18181b 100%)",
    "linear-gradient(180deg, #27272a 0%, #18181b 100%)",
  ]);

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      onBack();
    }
  };

  const branches = ["Main Branch", "City Branch", "Downtown"];
  const randomAmount = Math.floor(Math.random() * 1000000);
  const volume = Math.floor(Math.random() * 1000000);

  return (
    <motion.div
      layout
      style={{ x, opacity, scale }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div style={{ background }}>
        <Card className="w-[320px] bg-zinc-900/50 backdrop-blur-sm border-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-zinc-400 hover:text-zinc-100"
            >
              <ArrowLeft size={20} />
            </Button>
            <motion.h2 layoutId={`bank-${bank}`} className="text-xl font-bold">
              {bank} Details
            </motion.h2>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <h3 className="text-zinc-400">Available Branches</h3>
                  {branches.map((branch) => (
                    <div key={branch} className="p-2 bg-zinc-800 rounded-lg">
                      {branch}
                    </div>
                  ))}
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="border-t border-zinc-800 pt-4"
                >
                  <p className="text-zinc-400">Transaction Limit</p>
                  <p className="text-2xl font-bold">
                    ${randomAmount.toLocaleString()}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="border-t border-zinc-800 pt-4"
                >
                  <p className="text-zinc-400">Transaction Volume</p>
                  <p className="text-2xl font-bold">
                    ${volume.toLocaleString()}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700"
            >
              Back
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BankDetails;
