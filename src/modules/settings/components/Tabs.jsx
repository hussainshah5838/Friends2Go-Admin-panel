import React from "react";

export default function Tabs({ value, onChange, items }) {
  return (
    <div className="glass p-1 rounded-2xl flex gap-1 overflow-x-auto whitespace-nowrap w-full max-w-full snap-x snap-mandatory">
      {items.map((it) => {
        const active = value === it.value;
        return (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            className={`px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-xl transition shrink-0 snap-start ${
              active
                ? "bg-primary/20 text-text border border-primary/30 shadow-neon-sm"
                : "text-muted hover:text-text"
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
