import React, { useEffect, useState } from "react";

const ROLES = [
  { value: "fan", label: "Fan" },
  { value: "business", label: "Business" },
  { value: "admin", label: "Admin" },
];

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

export default function UserDrawer({ open, onClose, initial = null, onSubmit }) {
  const isEdit = !!(initial && initial._id);
  const [model, setModel] = useState({
    name: "",
    email: "",
    role: "fan",
    status: "active",
    premium: false,
    language: "en",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setModel({
      name: initial?.name || "",
      email: initial?.email || "",
      role: initial?.role || "fan",
      status: initial?.status || "active",
      premium: !!initial?.premium,
      language: initial?.language || "en",
      notes: initial?.notes || "",
    });
    setErrors({});
  }, [initial, open]);

  if (!open) return null;

  function validate(m) {
    const e = {};
    if (!m.name.trim()) e.name = "Name is required";
    if (!m.email.trim()) e.email = "Email is required";
    if (m.email && !/^\S+@\S+\.\S+$/.test(m.email)) e.email = "Invalid email";
    return e;
    // could add zod/yup easily later
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    const eMap = validate(model);
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    setSaving(true);
    try {
      await onSubmit(model);
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
          <h3 className="text-lg font-semibold">{isEdit ? "Edit User" : "Create User"}</h3>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-muted">Full name</span>
            <input
              className="input mt-1"
              value={model.name}
              onChange={(e) => setModel((m) => ({ ...m, name: e.target.value }))}
              placeholder="John Doe"
            />
            {errors.name && <div className="text-danger text-xs mt-1">{errors.name}</div>}
          </label>

          <label className="block">
            <span className="text-sm text-muted">Email</span>
            <input
              className="input mt-1"
              value={model.email}
              onChange={(e) => setModel((m) => ({ ...m, email: e.target.value }))}
              placeholder="john@example.com"
            />
            {errors.email && <div className="text-danger text-xs mt-1">{errors.email}</div>}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-muted">Role</span>
              <select
                className="input mt-1"
                value={model.role}
                onChange={(e) => setModel((m) => ({ ...m, role: e.target.value }))}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-muted">Status</span>
              <select
                className="input mt-1"
                value={model.status}
                onChange={(e) => setModel((m) => ({ ...m, status: e.target.value }))}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-muted">Language</span>
              <input
                className="input mt-1"
                value={model.language}
                onChange={(e) => setModel((m) => ({ ...m, language: e.target.value }))}
                placeholder="en"
              />
            </label>

            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={model.premium}
                onChange={(e) => setModel((m) => ({ ...m, premium: e.target.checked }))}
              />
              <span className="text-sm">Premium user</span>
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-muted">Notes</span>
            <textarea
              className="input mt-1 min-h-[96px]"
              value={model.notes}
              onChange={(e) => setModel((m) => ({ ...m, notes: e.target.value }))}
              placeholder="Internal notes…"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create user"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
