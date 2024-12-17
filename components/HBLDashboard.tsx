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
} from "reactflow";
import "reactflow/dist/style.css";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import FloatingEdge from './FloatingEdge';

// Add detailed transaction type
interface Transaction {
  amount: number;
  accountType: string;
  customerType: string;
  region: string;
  area: string;
}

// Enhanced bank data structure
interface BankData {
  name: string;
  credit: Transaction[];
  debit: Transaction[];
}

// Expanded PARTNER_BANKS data
const PARTNER_BANKS: BankData[] = [
  {
    name: "Meezan Bank",
    credit: [
      { amount: 2000000, accountType: "Savings", customerType: "Individual", region: "North", area: "Urban" },
      { amount: 3000000, accountType: "Current", customerType: "Corporate", region: "South", area: "Metropolitan" },
    ],
    debit: [
      { amount: 1500000, accountType: "Fixed Deposit", customerType: "SME", region: "East", area: "Rural" },
      { amount: 1500000, accountType: "Foreign Currency", customerType: "Government", region: "West", area: "Suburban" },
    ],
  },
  {
    name: "Allied Bank",
    credit: [
      { amount: 2500000, accountType: "Current", customerType: "Corporate", region: "South", area: "Metropolitan" },
      { amount: 2000000, accountType: "Savings", customerType: "Individual", region: "North", area: "Urban" },
    ],
    debit: [
      { amount: 1800000, accountType: "Fixed Deposit", customerType: "SME", region: "West", area: "Rural" },
      { amount: 1000000, accountType: "Foreign Currency", customerType: "Government", region: "East", area: "Suburban" },
    ],
  },
  {
    name: "Bank Alfalah",
    credit: [
      { amount: 1800000, accountType: "Savings", customerType: "Individual", region: "East", area: "Urban" },
      { amount: 2000000, accountType: "Current", customerType: "Corporate", region: "North", area: "Metropolitan" },
    ],
    debit: [
      { amount: 1500000, accountType: "Fixed Deposit", customerType: "SME", region: "South", area: "Rural" },
      { amount: 1000000, accountType: "Foreign Currency", customerType: "Government", region: "Central", area: "Suburban" },
    ],
  },
  {
    name: "UBL",
    credit: [
      { amount: 2200000, accountType: "Current", customerType: "Corporate", region: "West", area: "Metropolitan" },
      { amount: 2000000, accountType: "Savings", customerType: "Individual", region: "Central", area: "Urban" },
    ],
    debit: [
      { amount: 2000000, accountType: "Fixed Deposit", customerType: "SME", region: "North", area: "Rural" },
      { amount: 1200000, accountType: "Foreign Currency", customerType: "Government", region: "South", area: "Suburban" },
    ],
  },
  {
    name: "MCB",
    credit: [
      { amount: 1900000, accountType: "Savings", customerType: "Individual", region: "South", area: "Urban" },
      { amount: 1600000, accountType: "Current", customerType: "Corporate", region: "East", area: "Metropolitan" },
    ],
    debit: [
      { amount: 1700000, accountType: "Fixed Deposit", customerType: "SME", region: "Central", area: "Rural" },
      { amount: 1200000, accountType: "Foreign Currency", customerType: "Government", region: "West", area: "Suburban" },
    ],
  },
  {
    name: "Standard Chartered",
    credit: [
      { amount: 2800000, accountType: "Current", customerType: "Corporate", region: "Central", area: "Metropolitan" },
      { amount: 1500000, accountType: "Foreign Currency", customerType: "Individual", region: "South", area: "Urban" },
      { amount: 900000, accountType: "Savings", customerType: "SME", region: "North", area: "Suburban" },
    ],
    debit: [
      { amount: 2100000, accountType: "Fixed Deposit", customerType: "Government", region: "East", area: "Metropolitan" },
      { amount: 1300000, accountType: "Current", customerType: "Corporate", region: "West", area: "Rural" },
      { amount: 700000, accountType: "Savings", customerType: "Individual", region: "Central", area: "Urban" },
    ],
  }
];

interface Filter {
  accountTypes: string[];
  customerTypes: string[];
  regions: string[];
  areas: string[];
  enabled: {
    accountTypes: string[];
    customerTypes: string[];
    regions: string[];
    areas: string[];
  };
}

const INITIAL_FILTERS: Filter = {
  accountTypes: ["Savings", "Current", "Fixed Deposit", "Foreign Currency"],
  customerTypes: ["Individual", "Corporate", "SME", "Government"],
  regions: ["North", "South", "East", "West", "Central"],
  areas: ["Urban", "Rural", "Metropolitan", "Suburban"],
  enabled: {
    accountTypes: [],
    customerTypes: [],
    regions: [],
    areas: [],
  },
};

// Enhanced BankNode component with filtered totals
const BankNode = ({ data }: NodeProps) => {
  const getFilteredAmounts = () => {
    if (!data.isHBL) {
      return {
        credit: data.credit.reduce((acc: number, t: Transaction) => acc + t.amount, 0),
        debit: data.debit.reduce((acc: number, t: Transaction) => acc + t.amount, 0),
      };
    }

    // Filter transactions based on enabled filters
    const filterTransaction = (t: Transaction) => {
      const filters = data.filters.enabled;
      const matchesFilters = (
        (filters.accountTypes.length === 0 || filters.accountTypes.includes(t.accountType)) &&
        (filters.customerTypes.length === 0 || filters.customerTypes.includes(t.customerType)) &&
        (filters.regions.length === 0 || filters.regions.includes(t.region)) &&
        (filters.areas.length === 0 || filters.areas.includes(t.area))
      );
      return matchesFilters;
    };

    const filteredCredit = data.allTransactions.credit
      .filter(filterTransaction)
      .reduce((acc: number, t: Transaction) => acc + t.amount, 0);

    const filteredDebit = data.allTransactions.debit
      .filter(filterTransaction)
      .reduce((acc: number, t: Transaction) => acc + t.amount, 0);

    return { credit: filteredCredit, debit: filteredDebit };
  };

  const { credit: displayCredit, debit: displayDebit } = getFilteredAmounts();

  return (
    <div 
      className={`rounded-full bg-zinc-800/90 border-2 border-zinc-700 flex items-center justify-center ${
        data.isHBL ? 'w-[400px] h-[400px]' : 'w-[200px] h-[200px]'
      }`}
    >
      {/* Credit handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="credit"
        style={{ top: '40%', background: '#22c55e' }}
      />
      {/* Debit handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="debit"
        style={{ top: '60%', background: '#ef4444' }}
      />
      
      <div className="text-center p-4">
        <h3 className={`font-bold text-zinc-100 ${data.isHBL ? 'text-4xl mb-4' : 'text-xl'}`}>
          {data.label}
        </h3>
        {data.isHBL ? (
          <div className="mt-6">
            <p className="text-green-400 text-2xl mb-3">
              Total Credit: ${displayCredit.toLocaleString()}
            </p>
            <p className="text-red-400 text-2xl">
              Total Debit: ${displayDebit.toLocaleString()}
            </p>
            {data.filters.enabled.accountTypes.length > 0 && (
              <p className="text-sm text-zinc-400 mt-2">
                Filtered by: {data.filters.enabled.accountTypes.join(", ")}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-green-400">
              Credit: ${displayCredit.toLocaleString()}
            </p>
            <p className="text-red-400">
              Debit: ${displayDebit.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  bankNode: BankNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

// Add type for connect params
// interface ConnectParams {
//   source: string;
//   target: string;
//   sourceHandle: string;
//   targetHandle: string;
// }

export default function HBLDashboard() {
  const [filters, setFilters] = useState<Filter>(INITIAL_FILTERS);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Handle filter changes
  const toggleFilter = (category: keyof Filter['enabled'], value: string) => {
    setFilters(prev => ({
      ...prev,
      enabled: {
        ...prev.enabled,
        [category]: prev.enabled[category].includes(value)
          ? prev.enabled[category].filter(v => v !== value)
          : [...prev.enabled[category], value]
      }
    }));
  };

  // Calculate totals
  const totalCredit = PARTNER_BANKS.reduce((acc, bank) => acc + bank.credit.reduce((acc, t) => acc + t.amount, 0), 0);
  const totalDebit = PARTNER_BANKS.reduce((acc, bank) => acc + bank.debit.reduce((acc, t) => acc + t.amount, 0), 0);

  // Update onConnect type to match ReactFlow's Connection type
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        setEdges((eds) => addEdge({ ...connection, type: 'floating' }, eds));
      }
    },
    [setEdges]
  );

  // Update dimensions and initialize flow elements
  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 600;

    // Aggregate all transactions for HBL node
    const allTransactions = {
      credit: PARTNER_BANKS.flatMap(bank => bank.credit),
      debit: PARTNER_BANKS.flatMap(bank => bank.debit),
    };

    // Create HBL node with all transactions
    const hblNode: Node = {
      id: "hbl",
      type: "bankNode",
      position: { x: centerX - 200, y: centerY - 200 },
      data: {
        label: "HBL Bank",
        isHBL: true,
        totalCredit,
        totalDebit,
        filters,
        allTransactions, // Add aggregated transactions
      },
      draggable: false,
    };

    // Create partner nodes
    const partnerNodes: Node[] = PARTNER_BANKS.map((bank, index) => {
      const angle = (index * (360 / PARTNER_BANKS.length) - 90) * (Math.PI / 180);
      const x = centerX + radius * Math.cos(angle) - 100;
      const y = centerY + radius * Math.sin(angle) - 100;

      return {
        id: bank.name,
        type: "bankNode",
        position: { x, y },
        data: {
          label: bank.name,
          credit: bank.credit,
          debit: bank.debit,
          filters,
        },
        draggable: true,
      };
    });

    setNodes([hblNode, ...partnerNodes]);

    // Create edges with floating edge type
    const flowEdges = PARTNER_BANKS.flatMap((bank) => {
      const sourceNode = partnerNodes.find(n => n.id === bank.name);
      const targetNode = hblNode;
      
      if (!sourceNode) return [];

      const sourceX = sourceNode.position.x + 100; // Half of partner node width
      const sourceY = sourceNode.position.y + 100;
      const targetX = targetNode.position.x + 200; // Half of HBL node width
      const targetY = targetNode.position.y + 200;

      return [
        // Credit line (green)
        {
          id: `${bank.name}-credit`,
          source: bank.name,
          target: "hbl",
          sourceX,
          sourceY,
          targetX,
          targetY,
          type: 'floating',
          animated: true,
          style: {
            stroke: "#22c55e",
            strokeWidth: getEdgeThickness(bank.credit.reduce((acc, t) => acc + t.amount, 0), totalCredit),
            opacity: 0.8,
          },
          data: { amount: bank.credit.reduce((acc, t) => acc + t.amount, 0) },
        },
        // Debit line (red)
        {
          id: `${bank.name}-debit`,
          source: "hbl",
          target: bank.name,
          sourceX: targetX,
          sourceY: targetY,
          targetX: sourceX,
          targetY: sourceY,
          type: 'floating',
          animated: true,
          style: {
            stroke: "#ef4444",
            strokeWidth: getEdgeThickness(bank.debit.reduce((acc, t) => acc + t.amount, 0), totalDebit),
            opacity: 0.8,
          },
          data: { amount: bank.debit.reduce((acc, t) => acc + t.amount, 0) },
        },
      ];
    });

    setEdges(flowEdges);

    // Simplified window resize handler
    const handleResize = () => {
      // Recalculate node positions on resize
      const newCenterX = window.innerWidth / 2;
      const newCenterY = window.innerHeight / 2;

      setNodes(nodes => nodes.map(node => {
        if (node.id === 'hbl') {
          return {
            ...node,
            position: { x: newCenterX - 200, y: newCenterY - 200 },
          };
        }
        
        const index = PARTNER_BANKS.findIndex(bank => bank.name === node.id);
        const angle = (index * (360 / PARTNER_BANKS.length) - 90) * (Math.PI / 180);
        return {
          ...node,
          position: {
            x: newCenterX + radius * Math.cos(angle) - 100,
            y: newCenterY + radius * Math.sin(angle) - 100,
          },
        };
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setNodes, setEdges, totalCredit, totalDebit, filters]);

  return (
    <div className="relative w-full h-screen bg-zinc-900">
      {/* Filters Panel */}
      <Card className="absolute left-4 top-4 w-64 z-10 bg-zinc-900/90 backdrop-blur-sm border-zinc-800">
        <CardHeader>
          <h2 className="text-xl font-bold text-zinc-100">Filters</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(filters).map(([category, items]) => {
            if (category === 'enabled') return null;
            return (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-300 capitalize">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <div className="space-y-2">
                  {items.map((item: string) => (
                    <div
                      key={item}
                      className="flex items-center space-x-2 text-zinc-400"
                    >
                      <Checkbox 
                        id={item}
                        checked={filters.enabled[category as keyof Filter['enabled']].includes(item)}
                        onCheckedChange={() => toggleFilter(category as keyof Filter['enabled'], item)}
                      />
                      <label htmlFor={item}>{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

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
        <Controls />
      </ReactFlow>
    </div>
  );
}

// Helper function for edge thickness
const getEdgeThickness = (amount: number, total: number): number => {
  const minThickness = 2;
  const maxThickness = 20;
  const ratio = Math.pow(amount / total, 0.5);
  return minThickness + (maxThickness - minThickness) * ratio;
};
