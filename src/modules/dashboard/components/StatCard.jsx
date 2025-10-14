import React from "react";
import Sparkline from "./Sparkline";

export default function StatCard({
  label,
  value,
  delta = 0,
  trend = [],
  icon = null,
}) {
  const up = delta >= 0;
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted">{label}</div>
        <div className="text-lg font-semibold">
          {Intl.NumberFormat().format(value)}
        </div>
        <div className="text-[10px] mt-0.5">
          <span className={up ? "text-success" : "text-danger"}>
            {up ? "▲" : "▼"} {Math.abs(delta)}%
          </span>{" "}
          vs last period
        </div>
      </div>
      <div className="w-28 text-primary/80">
        <Sparkline data={trend} />
      </div>
    </div>
  );
}
