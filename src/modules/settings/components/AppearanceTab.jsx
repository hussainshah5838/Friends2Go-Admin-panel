import React, { useEffect, useState } from "react";

export default function AppearanceTab({ initial, onSave, saving }) {
  const [m, setM] = useState({ themeMode: "dark", primaryColor: "#a8ff1a" });

  useEffect(() => {
    setM({
      themeMode: initial?.themeMode || "dark",
      primaryColor: initial?.primaryColor || "#a8ff1a",
    });
  }, [initial]);

  function submit(e) {
    e.preventDefault();
    onSave?.(m);
  }

  return (
    <form onSubmit={submit} className="card p-5 space-y-4">
      <label className="block">
        <span className="text-sm text-muted">Theme mode</span>
        <select
          className="input mt-1"
          value={m.themeMode}
          onChange={(e) => setM({ ...m, themeMode: e.target.value })}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-muted">Primary color</span>
        <input
          type="color"
          className="input mt-1 h-12"
          value={m.primaryColor}
          onChange={(e) => setM({ ...m, primaryColor: e.target.value })}
        />
      </label>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <button className="btn w-full sm:w-auto" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
