import React, { useEffect, useState } from "react";

const CATEGORIES = [
  { value: "merch", label: "Merchandise" },
  { value: "voucher", label: "Voucher" },
  { value: "general", label: "General" },
];

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "oos", label: "Out of stock" },
  { value: "archived", label: "Archived" },
];

export default function ProductDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
}) {
  const isEdit = !!(initial && initial._id);
  const [model, setModel] = useState({
    name: "",
    sku: "",
    price: 0,
    stock: 0,
    category: "general",
    status: "draft",
    image: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setModel({
      name: initial?.name || "",
      sku: initial?.sku || "",
      price: Number(initial?.price ?? 0),
      stock: Number(initial?.stock ?? 0),
      category: initial?.category || "general",
      status: initial?.status || "draft",
      image: initial?.image || "",
    });
    setErrors({});
  }, [initial, open]);

  if (!open) return null;

  function validate(m) {
    const e = {};
    if (!m.name.trim()) e.name = "Name is required";
    if (!m.sku.trim()) e.sku = "SKU is required";
    if (isNaN(m.price) || m.price < 0) e.price = "Price must be ≥ 0";
    if (!Number.isInteger(Number(m.stock)) || m.stock < 0)
      e.stock = "Stock must be ≥ 0";
    return e;
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
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h3>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-muted">Name</span>
            <input
              className="input mt-1"
              value={model.name}
              onChange={(e) =>
                setModel((m) => ({ ...m, name: e.target.value }))
              }
              placeholder="Ballie Fan Scarf"
            />
            {errors.name && (
              <div className="text-danger text-xs mt-1">{errors.name}</div>
            )}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-muted">SKU</span>
              <input
                className="input mt-1"
                value={model.sku}
                onChange={(e) =>
                  setModel((m) => ({ ...m, sku: e.target.value }))
                }
                placeholder="SCF-001"
              />
              {errors.sku && (
                <div className="text-danger text-xs mt-1">{errors.sku}</div>
              )}
            </label>

            <label className="block">
              <span className="text-sm text-muted">Category</span>
              <select
                className="input mt-1"
                value={model.category}
                onChange={(e) =>
                  setModel((m) => ({ ...m, category: e.target.value }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-muted">Price</span>
              <input
                type="number"
                step="0.01"
                className="input mt-1"
                value={model.price}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    price: parseFloat(e.target.value || "0"),
                  }))
                }
                placeholder="19.99"
              />
              {errors.price && (
                <div className="text-danger text-xs mt-1">{errors.price}</div>
              )}
            </label>

            <label className="block">
              <span className="text-sm text-muted">Stock</span>
              <input
                type="number"
                className="input mt-1"
                value={model.stock}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    stock: parseInt(e.target.value || "0", 10),
                  }))
                }
                placeholder="100"
              />
              {errors.stock && (
                <div className="text-danger text-xs mt-1">{errors.stock}</div>
              )}
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-muted">Status</span>
            <select
              className="input mt-1"
              value={model.status}
              onChange={(e) =>
                setModel((m) => ({ ...m, status: e.target.value }))
              }
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-muted">Image URL</span>
            <input
              className="input mt-1"
              value={model.image}
              onChange={(e) =>
                setModel((m) => ({ ...m, image: e.target.value }))
              }
              placeholder="https://…"
            />
          </label>

          {model.image && (
            <div className="mt-2">
              <img
                src={model.image}
                alt="preview"
                className="w-full h-40 object-cover rounded-xl border border-border"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
