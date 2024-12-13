import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

interface BankCardProps {
  bank: string;
  onClose: () => void;
}

const BankCard = ({ bank, onClose }: BankCardProps) => {
  const [branch] = bank.split("-");
  const volume = Math.floor(Math.random() * 1000000); // Random transaction volume

  return (
    <motion.div
      className="absolute top-0 left-[calc(100%+1rem)] w-full"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="w-[400px] bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <h2 className="text-xl font-bold">{bank}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <span className="text-zinc-400">Branch</span>
            <span className="text-zinc-100">{branch}</span>
          </div>
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <span className="text-zinc-400">Volume</span>
            <span className="text-zinc-100">${volume.toLocaleString()}</span>
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
  );
};

export default BankCard;
