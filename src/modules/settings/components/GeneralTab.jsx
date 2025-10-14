import React, { useState, useEffect } from "react";

export default function GeneralTab({ initial, onSave, saving }) {
  const [m, setM] = useState({ appName: "", supportEmail: "", logoUrl: "" });

  useEffect(() => {
    setM({
      appName: initial?.appName || "",
      supportEmail: initial?.supportEmail || "",
      logoUrl: initial?.logoUrl || "",
    });
  }, [initial]);

  function submit(e) {
    e.preventDefault();
    onSave?.(m);
  }

  return (
    <form onSubmit={submit} className="card p-5 space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-muted">App name</span>
          <input
            className="input mt-1"
            value={m.appName}
            onChange={(e) => setM({ ...m, appName: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted">Support email</span>
          <input
            className="input mt-1"
            value={m.supportEmail}
            onChange={(e) => setM({ ...m, supportEmail: e.target.value })}
            placeholder="support@ballie.app"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-muted">Logo URL</span>
        <input
          className="input mt-1"
          value={m.logoUrl}
          onChange={(e) => setM({ ...m, logoUrl: e.target.value })}
          placeholder="https://…"
        />
      </label>

      {m.logoUrl && (
        <img
          src={m.logoUrl}
          alt="logo"
          className="h-14 w-14 rounded-xl object-cover"
        />
      )}

      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <button className="btn w-full sm:w-auto" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
