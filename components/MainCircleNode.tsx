import { Handle, Position } from "reactflow";
import MainCircle from "./MainCircle";

interface MainCircleNodeProps {
  data: {
    bankName: string;
    onOptionClick: (option: "debit" | "credit") => void;
  };
}

const MainCircleNode = ({ data }: MainCircleNodeProps) => {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} />
      <MainCircle bankName={data.bankName} onOptionClick={data.onOptionClick} />
    </div>
  );
};

export default MainCircleNode;
