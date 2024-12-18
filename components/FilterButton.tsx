import { Button } from "./ui/button";
import { Filter } from "lucide-react";
import { motion } from "framer-motion";

interface FilterButtonProps {
  onClick: () => void;
  isOpen: boolean;
  activeFiltersCount: number;
}

export default function FilterButton({
  onClick,
  activeFiltersCount,
}: FilterButtonProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute top-6 right-6 z-40"
    >
      <Button
        variant="outline"
        size="lg"
        className="text-white bg-zinc-900/90 border-zinc-800 hover:bg-zinc-800 backdrop-blur-md"
        onClick={onClick}
      >
        <Filter className="w-5 h-5 mr-2" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="ml-2 bg-zinc-800 text-zinc-100 px-2 py-0.5 rounded-full text-xs">
            {activeFiltersCount}
          </span>
        )}
      </Button>
    </motion.div>
  );
}
