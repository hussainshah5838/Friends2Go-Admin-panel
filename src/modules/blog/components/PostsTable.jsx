import React from "react";
import SkeletonRow from "./SkeletonRow";

function StatusBadge({ status }) {
  const map = {
    published: "bg-success/20 text-success border border-success/30",
    draft: "bg-warning/20 text-warning border border-warning/30",
    archived: "bg-danger/20 text-danger border border-danger/30",
  };
  return <span className={`badge ${map[status] || ""}`}>{status}</span>;
}

export default function PostsTable({
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
      {/* Desktop table (hidden on small screens) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left">
            <tr className="text-muted">
              <th className="px-4 py-3 font-medium">Cover</th>
              <th className="px-4 py-3 font-medium">Title & Excerpt</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading &&
              items.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-border/60 align-middle"
                >
                  <td className="px-4 py-3">
                    {p.coverImage ? (
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="h-10 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-16 rounded-lg bg-white/10" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted">{p.excerpt || "—"}</div>
                    <div className="text-[10px] text-muted mt-1">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">{p.author}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    {p.publishedAt ? (
                      new Date(p.publishedAt).toLocaleDateString()
                    ) : (
                      <span className="text-muted">—</span>
                    )}
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
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile list (visible on small screens) */}
      <div className="sm:hidden">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse p-3 border-b border-border/40"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-16 rounded-lg bg-white/10 flex-shrink-0" />
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
                <div className="h-12 w-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  {p.coverImage ? (
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm truncate">
                      {p.title}
                    </div>
                    <div className="text-xs text-muted">{p.author}</div>
                  </div>
                  <div className="text-xs text-muted mt-1 line-clamp-2">
                    {p.excerpt || "—"}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-[11px] text-muted">
                      {p.publishedAt
                        ? new Date(p.publishedAt).toLocaleDateString()
                        : "—"}
                    </div>
                    <div className="inline-flex gap-2">
                      <button className="btn-ghost" onClick={() => onEdit(p)}>
                        Edit
                      </button>
                      <button className="btn-ghost" onClick={() => onDelete(p)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {!loading && items.length === 0 && (
          <div className="p-4 text-center text-muted">No posts found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
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
