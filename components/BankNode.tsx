import { motion } from "framer-motion";

interface BankNodeProps {
  bank: {
    name: string;
    inflow: number;
    outflow: number;
  };
  angle: number;
  distance: number;
}

export default function BankNode({ bank, angle, distance }: BankNodeProps) {
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        x: x,
        y: y,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: angle / 360 }}
    >
      <div className="w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-800/90 border border-zinc-700 backdrop-blur-md p-4 flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-zinc-100">{bank.name}</h3>
        <div className="mt-2 text-center">
          <p className="text-green-400">
            Inflow: ${bank.inflow.toLocaleString()}
          </p>
          <p className="text-red-400">
            Outflow: ${bank.outflow.toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
