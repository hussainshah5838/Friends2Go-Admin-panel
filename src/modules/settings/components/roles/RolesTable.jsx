import React from "react";
import SkeletonRow from "./SkeletonRow";

export default function RolesTable({
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
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Permissions</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            {!loading &&
              items.map((r) => (
                <tr key={r._id} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">
                    {r.description || <span className="text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(r.perms)
                        .filter(([, v]) => !!v)
                        .map(([k]) => (
                          <span key={k} className="badge">
                            {k}
                          </span>
                        ))}
                      {Object.values(r.perms).every((v) => !v) && (
                        <span className="text-muted">No permissions</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button className="btn-ghost" onClick={() => onEdit(r)}>
                        Edit
                      </button>
                      <button className="btn-ghost" onClick={() => onDelete(r)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">
                  No roles.
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
              <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}

        {!loading &&
          items.map((r) => {
            const permCount = Object.values(r.perms || {}).filter(Boolean).length;
            return (
              <div key={r._id} className="p-3 border-b border-border/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{r.name}</div>
                    <div className="text-xs text-muted mt-1 truncate">
                      {r.description || <span className="text-muted">—</span>}
                    </div>
                    <div className="text-xs text-muted mt-1">
                      {permCount > 0 ? `${permCount} perms` : 'No permissions'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button className="btn-ghost" onClick={() => onEdit(r)}>Edit</button>
                    <button className="btn-ghost" onClick={() => onDelete(r)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}

        {!loading && items.length === 0 && (
          <div className="p-6 text-center text-muted">No roles.</div>
        )}
      </div>

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
