import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FilterData } from "@/utils/csvParser";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { X } from "lucide-react";

interface FilterPanelProps {
  filters: FilterData;
  enabled: {
    accountTypes: string[];
    customerTypes: string[];
    beneficiaryBanks: string[];
    regions: string[];
    areas: string[];
  };
  onToggleFilter: (category: string, value: string) => void;
  onClose: () => void;
  isOpen: boolean;
  onClearFilters: () => void;
}

export default function FilterPanel({
  filters,
  enabled,
  onToggleFilter,
  onClearFilters,
  onClose,
  isOpen,
}: FilterPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Count active filters per category
  const getActiveCount = (category: keyof typeof enabled) =>
    enabled[category].length;

  const filterItems = (items: string[]) => {
    return items.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // New function to get active filter summary
  const getActiveFiltersSummary = () => {
    const summary = Object.entries(enabled)
      .map(([category, values]) => {
        if (values.length === 0) return null;
        return {
          category: category.replace(/([A-Z])/g, " $1").trim(), // Convert camelCase to spaces
          count: values.length,
          items: values.slice(0, 2), // Show only first 2 items
          hasMore: values.length > 2,
        };
      })
      .filter(Boolean);

    return summary;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-20 right-6 z-50"
        >
          <Card className="w-[800px] shadow-2xl shadow-black/20 bg-zinc-900/90 backdrop-blur-md border-zinc-800">
            <CardHeader className="px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-zinc-100">
                    Filters
                  </h2>
                  {Object.values(enabled).some((arr) => arr.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearFilters}
                      className="text-zinc-400 hover:text-zinc-100 text-sm"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-zinc-400 hover:text-zinc-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 bg-zinc-800/50 rounded-lg p-3">
                <Search className="w-5 h-5 text-zinc-400" />
                <Input
                  placeholder="Search filters..."
                  className="bg-transparent border-none focus-visible:ring-0 text-zinc-100 placeholder:text-zinc-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="accountTypes">
                <TabsList className="grid grid-cols-5 bg-zinc-800/50  mb-6">
                  {Object.entries({
                    accountTypes: "Account Types",
                    customerTypes: "Customer Types",
                    beneficiaryBanks: "Banks",
                    regions: "Regions",
                    areas: "Areas",
                  }).map(([key, label]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="data-[state=active]:bg-zinc-700 py-2 px-4"
                    >
                      <span className="mr-2">{label}</span>
                      {getActiveCount(key as keyof typeof enabled) > 0 && (
                        <span className="bg-zinc-800 text-zinc-100 px-2 py-0.5 rounded-full text-xs">
                          {getActiveCount(key as keyof typeof enabled)}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.keys(filters).map((category) => (
                  <TabsContent key={category} value={category} className="mt-2">
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="grid grid-cols-2 gap-2">
                        {filterItems(filters[category as keyof FilterData]).map(
                          (item) => (
                            <label
                              key={item}
                              className="flex items-center space-x-3 p-3 rounded-lg 
                              hover:bg-zinc-800/50 cursor-pointer transition-colors
                              border border-transparent hover:border-zinc-700"
                            >
                              <Checkbox
                                checked={enabled[
                                  category as keyof typeof enabled
                                ].includes(item)}
                                onCheckedChange={() =>
                                  onToggleFilter(category, item)
                                }
                                className="border-zinc-600 rounded-[4px] h-5 w-5"
                              />
                              <span className="text-sm text-zinc-200 font-medium flex-1">
                                {item}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>

              {/* Active Filters Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 pt-4 border-t border-zinc-800"
              >
                <div className="flex flex-wrap gap-2">
                  {getActiveFiltersSummary().map(
                    (summary) =>
                      summary && (
                        <div
                          key={summary.category}
                          className="text-xs text-zinc-400"
                        >
                          <span className="font-medium text-zinc-300">
                            {summary.category}:
                          </span>{" "}
                          {summary.items.join(", ")}
                          {summary.hasMore && ` +${summary.count - 2} more`}
                          {" • "}
                        </div>
                      )
                  )}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
