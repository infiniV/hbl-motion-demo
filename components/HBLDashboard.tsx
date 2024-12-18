"use client";

import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Node,
  Background,
  Controls,
  NodeProps,
  Handle,
  Position,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import FloatingEdge from "./FloatingEdge";
import FilterPanel from "./FilterPanel";
import { parseCSVData, FilterData, TransactionData } from "@/utils/csvParser";
import FilterButton from "./FilterButton";

// Types
// interface Transaction {
//   amount: number;
//   accountType: string;
//   customerType: string;
//   region: string;
//   area: string;
// }

interface BankData {
  name: string;
  inflow: number; // Money coming into HBL
  outflow: number; // Money going out from HBL
}

interface Filter {
  accountTypes: string[];
  customerTypes: string[];
  beneficiaryBanks: string[];
  regions: string[];
  areas: string[];
  enabled: {
    accountTypes: string[];
    customerTypes: string[];
    beneficiaryBanks: string[];
    regions: string[];
    areas: string[];
  };
}

interface NodeData {
  label: string;
  isHBL?: boolean;
  inflow?: number;
  outflow?: number;
  filters?: Filter;
  transactions?: TransactionType[];
}

// Constants
// const PARTNER_BANKS: BankData[] = [
//   { name: "Meezan Bank", inflow: 5000000, outflow: 3000000 },
//   { name: "Allied Bank", inflow: 4500000, outflow: 2800000 },
//   { name: "Bank Alfalah", inflow: 3800000, outflow: 2500000 },
//   { name: "UBL", inflow: 4200000, outflow: 3200000 },
//   { name: "MCB", inflow: 3500000, outflow: 2900000 },
//   { name: "Standard Chartered", inflow: 5200000, outflow: 4100000 },
// ];

// Add HBL's internal transactions
type TransactionType = {
  amount: number;
  accountType: string;
  customerType: string;
  region: string;
  area: string;
};

// const HBL_TRANSACTIONS: {
//   credit: TransactionType[];
//   debit: TransactionType[];
// } = {
//   credit: [
//     {
//       amount: 5000000,
//       accountType: "Savings",
//       customerType: "Individual",
//       region: "North",
//       area: "Urban",
//     },
//     {
//       amount: 8000000,
//       accountType: "Current",
//       customerType: "Corporate",
//       region: "South",
//       area: "Metropolitan",
//     },
//     {
//       amount: 3000000,
//       accountType: "Fixed Deposit",
//       customerType: "SME",
//       region: "East",
//       area: "Rural",
//     },
//     {
//       amount: 4000000,
//       accountType: "Foreign Currency",
//       customerType: "Government",
//       region: "West",
//       area: "Suburban",
//     },
//     {
//       amount: 6000000,
//       accountType: "Current",
//       customerType: "Corporate",
//       region: "Central",
//       area: "Metropolitan",
//     },
//     {
//       amount: 2500000,
//       accountType: "Savings",
//       customerType: "Individual",
//       region: "North",
//       area: "Rural",
//     },
//   ],
//   debit: [
//     {
//       amount: 4500000,
//       accountType: "Current",
//       customerType: "Corporate",
//       region: "South",
//       area: "Metropolitan",
//     },
//     {
//       amount: 3000000,
//       accountType: "Savings",
//       customerType: "Individual",
//       region: "North",
//       area: "Urban",
//     },
//     {
//       amount: 2500000,
//       accountType: "Fixed Deposit",
//       customerType: "SME",
//       region: "East",
//       area: "Rural",
//     },
//     {
//       amount: 3500000,
//       accountType: "Foreign Currency",
//       customerType: "Government",
//       region: "West",
//       area: "Suburban",
//     },
//     {
//       amount: 5000000,
//       accountType: "Current",
//       customerType: "Corporate",
//       region: "Central",
//       area: "Metropolitan",
//     },
//     {
//       amount: 2000000,
//       accountType: "Savings",
//       customerType: "Individual",
//       region: "South",
//       area: "Urban",
//     },
//   ],
// };

// Bank Node Component
const BankNode = ({ data }: NodeProps<NodeData>) => {
  const getFilteredAmounts = () => {
    if (!data.isHBL) {
      return {
        inflow: data.inflow || 0,
        outflow: data.outflow || 0,
      };
    }

    // Return accumulated amounts for HBL
    return {
      inflow: data.inflow || 0,
      outflow: data.outflow || 0,
    };
  };

  const { inflow, outflow } = getFilteredAmounts();

  return (
    <div
      className={`relative rounded-full bg-zinc-800/90 border-2 border-zinc-700 flex items-center justify-center 
      transition-all duration-300 hover:shadow-lg hover:shadow-zinc-800/50 
      ${
        data.isHBL
          ? "w-[500px] h-[500px]"
          : "w-[220px] h-[220px] hover:scale-105"
      }`}
    >
      {/* Glowing handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="inflow"
        style={{
          top: "40%",
          width: data.isHBL ? "15px" : "10px",
          height: data.isHBL ? "15px" : "10px",
          background: "#22c55e",
          border: "2px solid #16a34a",
          boxShadow: "0 0 10px #22c55e",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="outflow"
        style={{
          top: "60%",
          width: data.isHBL ? "15px" : "10px",
          height: data.isHBL ? "15px" : "10px",
          background: "#ef4444",
          border: "2px solid #dc2626",
          boxShadow: "0 0 10px #ef4444",
        }}
      />

      {/* Inner content */}
      <div className="text-center p-8">
        <h3
          className={`font-bold text-zinc-100 mb-4 ${
            data.isHBL ? "text-5xl" : "text-2xl"
          }`}
        >
          {data.label}
        </h3>
        <div className={`flex flex-col gap-4 ${data.isHBL ? "mt-6" : "mt-3"}`}>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
              <p
                className={`text-green-400 ${
                  data.isHBL ? "text-3xl" : "text-xl"
                }`}
              >
                ${inflow.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
              <p
                className={`text-red-400 ${
                  data.isHBL ? "text-3xl" : "text-xl"
                }`}
              >
                ${outflow.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background glow effect */}
      {data.isHBL && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/5 to-red-500/5 -z-10" />
      )}
    </div>
  );
};

// Node Types
const nodeTypes = {
  bankNode: BankNode,
};

// Edge Types
const edgeTypes = {
  floating: FloatingEdge,
};

// Main Component
export default function HBLDashboard() {
  const [filterData, setFilterData] = useState<FilterData | null>(null);
  const [banksData, setBanksData] = useState<Map<string, BankData>>(new Map());
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [filters, setFilters] = useState<Filter>({
    accountTypes: [],
    customerTypes: [],
    beneficiaryBanks: [],
    regions: [],
    areas: [],
    enabled: {
      accountTypes: [],
      customerTypes: [],
      beneficiaryBanks: [],
      regions: [],
      areas: [],
    },
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load CSV data
  useEffect(() => {
    parseCSVData().then(({ filters, banks, transactions }) => {
      setFilterData(filters);
      setBanksData(banks);
      setTransactions(transactions);
      setFilters((prev) => ({
        ...prev,
        ...filters,
      }));
    });
  }, []);

  // Handle filter changes
  const toggleFilter = useCallback((category: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      enabled: {
        ...prev.enabled,
        [category]: prev.enabled[category as keyof Filter["enabled"]].includes(
          value
        )
          ? prev.enabled[category as keyof Filter["enabled"]].filter(
              (v) => v !== value
            )
          : [...prev.enabled[category as keyof Filter["enabled"]], value],
      },
    }));
  }, []);

  // Add clear filters function
  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      enabled: {
        accountTypes: [],
        customerTypes: [],
        beneficiaryBanks: [],
        regions: [],
        areas: [],
      },
    }));
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Calculate totals
  // const totalInflow = PARTNER_BANKS.reduce((acc, bank) => acc + bank.inflow, 0);
  // const totalOutflow = PARTNER_BANKS.reduce(
  //   (acc, bank) => acc + bank.outflow,
  //   0
  // );

  // Handle connections
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: "floating" }, eds));
    },
    [setEdges]
  );

  // Calculate dynamic radius based on number of banks
  const calculateRadius = (numBanks: number) => {
    return Math.max(700, numBanks * 100); // Increase radius for more banks
  };

  // Get filtered transactions based on current filters
  const getFilteredTransactions = useCallback(() => {
    return transactions.filter((t) => {
      const { enabled } = filters;
      return (
        (enabled.accountTypes.length === 0 ||
          enabled.accountTypes.includes(t.accountType)) &&
        (enabled.customerTypes.length === 0 ||
          enabled.customerTypes.includes(t.customerType)) &&
        (enabled.beneficiaryBanks.length === 0 ||
          enabled.beneficiaryBanks.includes(t.beneficiaryBank)) &&
        (enabled.regions.length === 0 || enabled.regions.includes(t.region)) &&
        (enabled.areas.length === 0 || enabled.areas.includes(t.area))
      );
    });
  }, [transactions, filters]);

  // // Calculate HBL amounts based on filtered transactions
  // const getHBLAmounts = useCallback(() => {
  //   const filteredTransactions = getFilteredTransactions();
  //   const credit = filteredTransactions
  //     .filter((t) => t.type === "CREDIT")
  //     .reduce((sum, t) => sum + t.amount, 0);
  //   const debit = filteredTransactions
  //     .filter((t) => t.type === "DEBIT")
  //     .reduce((sum, t) => sum + t.amount, 0);
  //   return { credit, debit };
  // }, [getFilteredTransactions]);

  // Get visible banks based on filters
  const getVisibleBanks = useCallback(() => {
    const selectedBanks = filters.enabled.beneficiaryBanks;
    if (selectedBanks.length === 0) {
      return Array.from(banksData.entries());
    }
    return Array.from(banksData.entries()).filter(([name]) =>
      selectedBanks.includes(name)
    );
  }, [banksData, filters.enabled.beneficiaryBanks]);

  // Calculate totals for HBL from all transactions
  const calculateHBLTotals = useCallback(
    (filteredTransactions: TransactionData[]) => {
      return filteredTransactions.reduce(
        (acc, t) => {
          if (t.type === "CREDIT") {
            acc.inflow += t.amount;
          } else {
            acc.outflow += t.amount;
          }
          return acc;
        },
        { inflow: 0, outflow: 0 }
      );
    },
    []
  );

  // Initialize and update nodes/edges
  useEffect(() => {
    if (!banksData.size) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const visibleBanks = getVisibleBanks();
    const radius = calculateRadius(visibleBanks.length);

    // Get filtered transactions and calculate HBL totals
    const filteredTransactions = getFilteredTransactions();
    const hblTotals = calculateHBLTotals(filteredTransactions);

    // Create HBL node with accumulated totals
    const hblNode: Node<NodeData> = {
      id: "hbl",
      type: "bankNode",
      position: { x: centerX - 250, y: centerY - 250 },
      data: {
        label: "HBL Bank",
        isHBL: true,
        inflow: hblTotals.inflow,
        outflow: hblTotals.outflow,
      },
      draggable: false,
    };

    // Create partner nodes dynamically
    const bankEntries = Array.from(banksData.entries());
    const partnerNodes: Node<NodeData>[] = bankEntries.map(
      ([name, data], index) => {
        const angle =
          (index * (360 / bankEntries.length) - 90) * (Math.PI / 180);
        const x = centerX + radius * Math.cos(angle) - 110;
        const y = centerY + radius * Math.sin(angle) - 110;

        return {
          id: name,
          type: "bankNode",
          position: { x, y },
          data: {
            label: name,
            inflow: data.inflow,
            outflow: data.outflow,
          },
          draggable: true,
        };
      }
    );

    setNodes([hblNode, ...partnerNodes]);

    // Update edges with actual transaction amounts
    const flowEdges: Edge[] = visibleBanks.flatMap(([name]) => {
      const bankTransactions = filteredTransactions.filter(
        (t) => t.beneficiaryBank === name
      );
      const bankTotals = calculateHBLTotals(bankTransactions);

      return [
        {
          id: `${name}-inflow`,
          source: name,
          target: "hbl",
          type: "floating",
          animated: true,
          style: {
            stroke: "#22c55e",
            strokeWidth: getEdgeThickness(bankTotals.inflow, hblTotals.inflow),
          },
        },
        {
          id: `${name}-outflow`,
          source: "hbl",
          target: name,
          type: "floating",
          animated: true,
          style: {
            stroke: "#ef4444",
            strokeWidth: getEdgeThickness(
              bankTotals.outflow,
              hblTotals.outflow
            ),
          },
        },
      ];
    });

    setEdges(flowEdges);
  }, [
    banksData,
    filters,
    getFilteredTransactions,
    calculateHBLTotals,
    getVisibleBanks,
    setNodes,
    setEdges,
  ]);

  // Calculate total active filters
  const activeFiltersCount = Object.values(filters.enabled).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        connectionMode={ConnectionMode.Loose}
      >
        <Background color="#27272a" gap={20} />
        <Controls className="!bg-zinc-900/90 !border-zinc-800" />
      </ReactFlow>

      <FilterButton
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        isOpen={isFilterOpen}
        activeFiltersCount={activeFiltersCount}
      />

      {filterData && (
        <FilterPanel
          filters={filterData}
          enabled={filters.enabled}
          onToggleFilter={toggleFilter}
          onClearFilters={clearFilters}
          onClose={() => setIsFilterOpen(false)}
          isOpen={isFilterOpen}
        />
      )}
    </div>
  );
}

// Helper function
const getEdgeThickness = (amount: number, total: number): number => {
  const minThickness = 2;
  const maxThickness = 20;
  const ratio = Math.pow(amount / total, 0.5);
  return minThickness + (maxThickness - minThickness) * ratio;
};
