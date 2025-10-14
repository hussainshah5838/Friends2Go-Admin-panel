import React from "react";

export default function SkeletonStat() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-white/10" />
        <div className="flex-1">
          <div className="h-3 w-20 bg-white/10 rounded mb-2" />
          <div className="h-4 w-28 bg-white/10 rounded mb-1" />
          <div className="h-2 w-24 bg-white/10 rounded" />
        </div>
        <div className="h-8 w-28 bg-white/10 rounded" />
      </div>
    </div>
  );
}
