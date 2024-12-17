import { getBezierPath, Position } from 'reactflow';

interface EdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  style?: React.CSSProperties;
  sourcePosition?: Position;
  targetPosition?: Position;
}

function FloatingEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature: 0.8, // Increased curvature for more pronounced curves
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      style={style}
    />
  );
}

export default FloatingEdge; 