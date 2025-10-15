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
    <form onSubmit={submit} aria-busy={saving ? "true" : "false"} className="card space-y-4 max-w-3xl mx-auto">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="block" htmlFor="appName">
          <span className="text-sm text-muted">App name</span>
          <input
            id="appName"
            name="appName"
            className="input mt-1"
            value={m.appName}
            onChange={(e) => setM({ ...m, appName: e.target.value })}
            placeholder="Your app name"
            autoComplete="organization"
          />
        </label>
        <label className="block" htmlFor="supportEmail">
          <span className="text-sm text-muted">Support email</span>
          <input
            id="supportEmail"
            name="supportEmail"
            type="email"
            className="input mt-1"
            value={m.supportEmail}
            onChange={(e) => setM({ ...m, supportEmail: e.target.value })}
            placeholder="support@ballie.app"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="block" htmlFor="logoUrl">
        <span className="text-sm text-muted">Logo URL</span>
        <input
          id="logoUrl"
          name="logoUrl"
          type="url"
          className="input mt-1"
          value={m.logoUrl}
          onChange={(e) => setM({ ...m, logoUrl: e.target.value })}
          placeholder="https://…"
          inputMode="url"
        />
      </label>

      {m.logoUrl && (
        <img
          src={m.logoUrl}
          alt="Logo preview"
          className="h-14 w-14 rounded-xl object-cover"
          loading="lazy"
          decoding="async"
        />
      )}

      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <button className="btn w-full sm:w-auto" disabled={saving} aria-disabled={saving ? "true" : "false"}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
