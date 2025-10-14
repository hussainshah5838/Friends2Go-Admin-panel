import React from "react";
import SkeletonRow from "./SkeletonRow";

function StatusBadge({ status }) {
  const map = {
    active: "bg-success/20 text-success border border-success/30",
    draft: "bg-warning/20 text-warning border border-warning/30",
    oos: "bg-danger/20 text-danger border border-danger/30",
    archived: "bg-muted/20 text-muted border border-border",
  };
  return <span className={`badge ${map[status] || ""}`}>{status}</span>;
}

function formatCurrency(n) {
  if (Number.isNaN(Number(n))) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(Number(n));
  } catch {
    return `$${Number(n).toFixed(2)}`;
  }
}

export default function ProductsTable({
  loading,
  items,
  page,
  total,
  limit,
  onPrev,
  onNext,
  onEdit,
  onDelete,
}) {
  const hasPrev = page > 1;
  const hasNext = page * limit < total;

  return (
    <div className="card">
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left">
            <tr className="text-muted">
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading &&
              items.map((p) => (
                <tr key={p._id} className="border-t border-border/60">
                  <td className="px-4 py-3">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-10 w-10 rounded-lg object-cover border border-border"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-white/10" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted">
                      {p.category} • Updated{" "}
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.sku}</td>
                  <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button className="btn-ghost" onClick={() => onEdit(p)}>
                        Edit
                      </button>
                      <button className="btn-ghost" onClick={() => onDelete(p)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="sm:hidden">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse p-3 border-b border-border/40">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-lg bg-white/10 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}

        {!loading &&
          items.map((p) => (
            <div key={p._id} className="p-3 border-b border-border/40">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  {p.image && (
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium truncate">{p.name}</div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="text-xs text-muted mt-1 truncate">
                    {p.category} · SKU {p.sku}
                  </div>
                  <div className="text-sm mt-1">
                    {formatCurrency(p.price)} · Stock {p.stock}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="btn-ghost" onClick={() => onEdit(p)}>Edit</button>
                    <button className="btn-ghost" onClick={() => onDelete(p)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {!loading && items.length === 0 && (
          <div className="p-6 text-center text-muted">No products found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
        <div className="text-xs text-muted">
          Page <span className="text-text">{page}</span> of{" "}
          <span className="text-text">
            {Math.max(1, Math.ceil(total / (limit || 1)))}
          </span>{" "}
          — {total} total
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" disabled={!hasPrev} onClick={onPrev}>
            Prev
          </button>
          <button className="btn-ghost" disabled={!hasNext} onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
