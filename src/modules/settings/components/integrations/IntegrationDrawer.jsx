import React, { useEffect, useState } from "react";

const PROVIDERS = ["stripe", "paypal", "firebase", "custom"];
const STATUS = ["active", "disabled"];

export default function IntegrationDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!(initial && initial._id);
  const [m, setM] = useState({
    provider: "stripe",
    name: "",
    apiKey: "",
    status: "active",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setM({
      provider: initial?.provider || "stripe",
      name: initial?.name || "",
      apiKey: initial?.apiKey || "",
      status: initial?.status || "active",
    });
    setErrors({});
  }, [initial, open]);

  if (!open) return null;

  function validate(x) {
    const e = {};
    if (!x.name.trim()) e.name = "Name is required";
    if (!x.apiKey.trim()) e.apiKey = "API key is required";
    return e;
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    const eMap = validate(m);
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    setSaving(true);
    try {
      await onSubmit(m);
      onClose?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[28rem] md:w-[32rem] lg:w-[36rem] max-w-full glass p-5 overflow-y-auto rounded-none sm:rounded-l-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Integration" : "Add Integration"}
          </h3>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-muted">Provider</span>
            <select
              className="input mt-1"
              value={m.provider}
              onChange={(e) => setM({ ...m, provider: e.target.value })}
            >
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-muted">Name</span>
            <input
              className="input mt-1"
              value={m.name}
              onChange={(e) => setM({ ...m, name: e.target.value })}
              placeholder="Stripe (Prod)"
            />
            {errors.name && (
              <div className="text-danger text-xs mt-1">{errors.name}</div>
            )}
          </label>

          <label className="block">
            <span className="text-sm text-muted">API key / Secret</span>
            <input
              className="input mt-1"
              value={m.apiKey}
              onChange={(e) => setM({ ...m, apiKey: e.target.value })}
              placeholder="sk_live_***"
            />
            {errors.apiKey && (
              <div className="text-danger text-xs mt-1">{errors.apiKey}</div>
            )}
          </label>

          <label className="block">
            <span className="text-sm text-muted">Status</span>
            <select
              className="input mt-1"
              value={m.status}
              onChange={(e) => setM({ ...m, status: e.target.value })}
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={saving}>
              {saving
                ? "Saving…"
                : isEdit
                ? "Save changes"
                : "Create integration"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
