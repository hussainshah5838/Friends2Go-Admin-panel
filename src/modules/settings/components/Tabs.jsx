import React, { useCallback, useEffect, useMemo, useRef } from "react";

/**
 * Accessible, keyboard-navigable tabs with optional icons.
 * items: Array<{ value: string; label: React.ReactNode; icon?: React.ReactNode; hideIconOnMobile?: boolean }>
 */
function Tabs({ value, onChange, items, className = "" }) {
  const idx = useMemo(() => items.findIndex((i) => i.value === value), [items, value]);
  const listRef = useRef(null);

  const onKeyDown = useCallback(
    (e) => {
      if (!items || items.length === 0) return;
      let next = idx;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = (idx + 1) % items.length;
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = (idx - 1 + items.length) % items.length;
          e.preventDefault();
          break;
        case "Home":
          next = 0;
          e.preventDefault();
          break;
        case "End":
          next = items.length - 1;
          e.preventDefault();
          break;
        default:
          return;
      }
      onChange?.(items[next].value);
    },
    [idx, items, onChange]
  );

  // Ensure the active tab is scrolled into view on narrow screens
  useEffect(() => {
    const activeEl = listRef.current?.querySelector('[data-active="true"]');
    if (activeEl && listRef.current) {
      activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      {/* Scroll container */}
      <div
        ref={listRef}
        role="tablist"
        aria-label="Settings tabs"
        aria-orientation="horizontal"
        className="glass p-1 rounded-2xl flex gap-1 overflow-x-auto whitespace-nowrap w-full max-w-full snap-x snap-mandatory scroll-px-2"
      >
        {items.map((it) => {
          const active = value === it.value;
          const hasIcon = !!it.icon;
          return (
            <button
              key={it.value}
              id={`tab-${it.value}`}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${it.value}`}
              tabIndex={active ? 0 : -1}
              type="button"
              onKeyDown={onKeyDown}
              onClick={() => onChange(it.value)}
              data-active={active ? "true" : undefined}
              className={`group px-3 py-1.5 text-[13px] sm:px-4 sm:py-2 sm:text-sm rounded-xl transition shrink-0 snap-start outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
                active
                  ? "bg-primary/20 text-text border border-primary/30 shadow-neon-sm"
                  : "text-muted hover:text-text"
              }`}
            >
              <span className="inline-flex items-center gap-2 max-w-[56vw] sm:max-w-none">
                {/* Icon (hidden on mobile by default if requested) */}
                {hasIcon && (
                  <span
                    className={`${it.hideIconOnMobile !== false ? "hidden sm:inline-flex" : "inline-flex"} items-center justify-center w-4 h-4 sm:w-5 sm:h-5 flex-none`}
                    aria-hidden="true"
                  >
                    {it.icon}
                  </span>
                )}
                {/* Label (truncate on tiny screens to keep buttons inside viewport) */}
                <span className="truncate">{it.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Optional: subtle gradient edges to hint scrollability on mobile */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-background to-transparent rounded-l-2xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-background to-transparent rounded-r-2xl" />
    </div>
  );
}

export default React.memo(Tabs);
