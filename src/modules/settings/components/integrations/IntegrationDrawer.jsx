import React, { useEffect, useRef, useState } from "react";

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

  const asideRef = useRef(null);

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

  useEffect(() => {
    if (open && asideRef.current) asideRef.current.focus();
  }, [open]);

  const nameErrId = errors.name ? "integration-name-error" : undefined;
  const keyErrId = errors.apiKey ? "integration-key-error" : undefined;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <aside
        ref={asideRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="integration-drawer-title"
        className="absolute right-0 top-0 h-full w-full sm:w-[28rem] md:w-[32rem] lg:w-[36rem] max-w-full glass p-5 overflow-y-auto rounded-none sm:rounded-l-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 id="integration-drawer-title" className="text-lg font-semibold">
            {isEdit ? "Edit Integration" : "Add Integration"}
          </h3>
          <button className="btn-ghost" onClick={onClose} aria-label="Close dialog">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block" htmlFor="provider">
            <span className="text-sm text-muted">Provider</span>
            <select
              id="provider"
              name="provider"
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

          <label className="block" htmlFor="integrationName">
            <span className="text-sm text-muted">Name</span>
            <input
              id="integrationName"
              name="name"
              className="input mt-1"
              value={m.name}
              onChange={(e) => setM({ ...m, name: e.target.value })}
              placeholder="Stripe (Prod)"
              autoFocus
              aria-invalid={!!errors.name}
              aria-describedby={nameErrId}
            />
            {errors.name && (
              <div id="integration-name-error" className="text-danger text-xs mt-1">{errors.name}</div>
            )}
          </label>

          <label className="block" htmlFor="apiKey">
            <span className="text-sm text-muted">API key / Secret</span>
            <input
              id="apiKey"
              name="apiKey"
              className="input mt-1"
              value={m.apiKey}
              onChange={(e) => setM({ ...m, apiKey: e.target.value })}
              placeholder="sk_live_***"
              aria-invalid={!!errors.apiKey}
              aria-describedby={keyErrId}
              autoComplete="off"
            />
            {errors.apiKey && (
              <div id="integration-key-error" className="text-danger text-xs mt-1">{errors.apiKey}</div>
            )}
          </label>

          <label className="block" htmlFor="status">
            <span className="text-sm text-muted">Status</span>
            <select
              id="status"
              name="status"
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
            <button type="submit" className="btn" disabled={saving} aria-disabled={saving ? "true" : "false"}>
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
