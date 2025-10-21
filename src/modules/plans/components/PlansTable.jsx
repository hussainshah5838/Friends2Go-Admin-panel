import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import SkeletonRow from "./SkeletonRow";

function ActionsMenu({ plan, onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex justify-end w-full">
      <button
        className="btn-ghost p-1.5"
        onClick={() => setOpen((o) => !o)}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-neutral-800 border border-border/40 rounded-md shadow-lg z-50">
          <button
            onClick={() => {
              setOpen(false);
              onView?.(plan);
            }}
            className="block w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            View
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onEdit?.(plan);
            }}
            className="block w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete?.(plan);
            }}
            className="block w-full text-left px-3 py-1.5 text-danger hover:bg-danger/10"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function PlansTable({
  loading = false,
  data = [],
  page = 1,
  total = 0,
  limit = 10,
  onPrev,
  onNext,
  onView,
  onEdit,
  onDelete,
}) {
  const hasPrev = page > 1;
  const hasNext = page * (limit || 1) < total;
  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));

  return (
    <div className="card">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left">
            <tr className="text-muted">
              <th className="px-4 py-3 font-medium w-[28%]">Title</th>
              <th className="px-4 py-3 font-medium w-[18%]">Category</th>
              <th className="px-4 py-3 font-medium w-[24%]">Location</th>
              <th className="px-4 py-3 font-medium w-[12%]">Status</th>
              <th className="px-4 py-3 font-medium text-right w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading &&
              data.map((p) => (
                <tr key={p._id} className="border-t border-border/60">
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium truncate max-w-[340px]" title={p.title}>
                      {p.title}
                    </div>
                    {p.description && (
                      <div
                        className="text-xs text-muted truncate max-w-[420px]"
                        title={p.description}
                      >
                        {p.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">{p.category || "—"}</td>
                  <td className="px-4 py-3 align-top">{p.location || "—"}</td>
                  <td className="px-4 py-3 align-top capitalize">{p.status || "—"}</td>
                  <td className="px-4 py-3 align-top text-right">
                    <ActionsMenu plan={p} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                  </td>
                </tr>
              ))}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-border/50 bg-white/5 animate-pulse h-24"
            />
          ))}

        {!loading &&
          data.map((p) => (
            <div
              key={p._id}
              className="p-4 rounded-lg border border-border/50 bg-white/5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-base">{p.title}</h3>
                  {p.category && (
                    <p className="text-xs text-muted capitalize">{p.category}</p>
                  )}
                </div>
                <ActionsMenu plan={p} onView={onView} onEdit={onEdit} onDelete={onDelete} />
              </div>

              {p.description && (
                <p className="text-sm text-muted line-clamp-2">{p.description}</p>
              )}

              <div className="flex flex-wrap justify-between mt-3 text-xs text-muted">
                <span>📍 {p.location || "Unknown"}</span>
                <span className="capitalize">Status: {p.status || "—"}</span>
              </div>
            </div>
          ))}

        {!loading && data.length === 0 && (
          <div className="text-center text-muted py-8">No plans found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 pt-4">
        <div className="text-xs text-muted order-2 md:order-1">
          Page <span className="text-text">{page}</span> of <span className="text-text">{totalPages}</span> — {total} total
        </div>
        <div className="flex gap-2 order-1 md:order-2">
          <button className="btn-ghost px-3 py-1.5 text-sm" disabled={!hasPrev} onClick={onPrev}>
            Prev
          </button>
          <button className="btn-ghost px-3 py-1.5 text-sm" disabled={!hasNext} onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
