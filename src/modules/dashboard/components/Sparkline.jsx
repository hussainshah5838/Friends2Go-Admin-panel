import React, { useMemo } from "react";

// tiny responsive sparkline using SVG – no external libs
export default function Sparkline({
  data = [],
  width = 120,
  height = 32,
  strokeWidth = 2,
}) {
  const path = useMemo(() => {
    if (!data || data.length === 0) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1 || 1);
    let p = "";
    data.forEach((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      p += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });
    return p;
  }, [data, width, height]);

  if (!path) return <div className="h-[32px]" />;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[32px]">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={0.9}
      />
    </svg>
  );
}
