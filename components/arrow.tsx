interface ArrowProps {
    from: { x: number; y: number };
    to: { x: number; y: number };
  }
  
  const Arrow = ({ from, to }: ArrowProps) => {
    return (
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="#ff0000"
        strokeWidth="3"
        markerEnd="url(#arrowhead)" // Optional: Adds an arrowhead
      />
    );
  };
  