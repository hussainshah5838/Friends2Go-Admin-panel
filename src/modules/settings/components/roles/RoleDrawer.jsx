import React, { useEffect, useState } from "react";

const PERM_KEYS = [
  ["usersRead", "Users: read"],
  ["usersWrite", "Users: write"],
  ["postsWrite", "Posts: write"],
  ["billingManage", "Billing: manage"],
  ["venuesVerify", "Venues: verify"],
];

export default function RoleDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!(initial && initial._id);
  const [m, setM] = useState({
    name: "",
    description: "",
    perms: {
      usersRead: false,
      usersWrite: false,
      postsWrite: false,
      billingManage: false,
      venuesVerify: false,
    },
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setM({
      name: initial?.name || "",
      description: initial?.description || "",
      perms: {
        usersRead: false,
        usersWrite: false,
        postsWrite: false,
        billingManage: false,
        venuesVerify: false,
        ...(initial?.perms || {}),
      },
    });
    setErrors({});
  }, [initial, open]);

  if (!open) return null;

  function validate(x) {
    const e = {};
    if (!x.name.trim()) e.name = "Name is required";
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

  function toggle(k) {
    setM((cur) => ({ ...cur, perms: { ...cur.perms, [k]: !cur.perms[k] } }));
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[28rem] md:w-[32rem] lg:w-[36rem] max-w-full glass p-5 overflow-y-auto rounded-none sm:rounded-l-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Role" : "Create Role"}
          </h3>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-muted">Role name</span>
            <input
              className="input mt-1"
              value={m.name}
              onChange={(e) => setM({ ...m, name: e.target.value })}
              placeholder="admin / moderator / custom"
            />
            {errors.name && (
              <div className="text-danger text-xs mt-1">{errors.name}</div>
            )}
          </label>

          <label className="block">
            <span className="text-sm text-muted">Description</span>
            <textarea
              className="input mt-1 min-h-[96px]"
              value={m.description}
              onChange={(e) => setM({ ...m, description: e.target.value })}
              placeholder="What can users with this role do?"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PERM_KEYS.map(([k, label]) => (
              <label key={k} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!m.perms[k]}
                  onChange={() => toggle(k)}
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create role"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
