import React from "react";
import SkeletonRow from "./SkeletonRow";

function RoleBadge({ role }) {
  const map = {
    fan: "bg-primary/20 text-primary border border-primary/30",
    business: "bg-warning/20 text-warning border border-warning/30",
    admin: "bg-success/20 text-success border border-success/30",
  };
  return (
    <span
      className={`badge inline-flex items-center gap-1 px-2 py-0.5 text-[11px] md:text-xs rounded-full whitespace-nowrap ${
        map[role] || ""
      }`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: "bg-success/20 text-success border border-success/30",
    suspended: "bg-danger/20 text-danger border border-danger/30",
  };
  return (
    <span
      className={`badge inline-flex items-center gap-1 px-2 py-0.5 text-[11px] md:text-xs rounded-full whitespace-nowrap ${
        map[status] || ""
      }`}
    >
      {status}
    </span>
  );
}

export default function UserTable({
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
  const totalPages = Math.max(1, Math.ceil(total / (limit || 1)));

  return (
    <div className="card">
      {/* Desktop / Tablet table (md+) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left">
            <tr className="text-muted">
              <th className="px-4 py-3 font-medium w-[28%]">Name</th>
              <th className="px-4 py-3 font-medium w-[28%]">Email</th>
              <th className="px-4 py-3 font-medium w-[14%]">Role</th>
              <th className="px-4 py-3 font-medium w-[14%]">Status</th>
              <th className="px-4 py-3 font-medium w-[10%] hidden lg:table-cell">Premium</th>
              <th className="px-4 py-3 font-medium text-right w-[16%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading &&
              items.map((u) => (
                <tr key={u._id} className="border-t border-border/60">
                  <td className="px-4 py-3 align-top min-w-[220px]">
                    <div className="font-medium truncate max-w-[260px]" title={u.name}>
                      {u.name}
                    </div>
                    <div className="text-xs text-muted whitespace-nowrap">
                      Joined {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-4 py-3 align-top min-w-[220px]">
                    <div className="truncate max-w-[280px]" title={u.email}>{u.email}</div>
                  </td>

                  <td className="px-4 py-3 align-top">
                    <RoleBadge role={u.role} />
                  </td>

                  <td className="px-4 py-3 align-top">
                    <StatusBadge status={u.status} />
                  </td>

                  <td className="px-4 py-3 align-top hidden lg:table-cell">
                    {u.premium ? (
                      <span className="badge px-2 py-0.5 text-[11px] md:text-xs">Premium</span>
                    ) : (
                      <span className="text-muted text-xs">Free</span>
                    )}
                  </td>

                  <td className="px-4 py-3 align-top text-right">
                    <div className="inline-flex flex-wrap gap-2 justify-end">
                      <button
                        className="btn-ghost px-2 py-1 text-xs md:text-sm"
                        onClick={() => onEdit(u)}
                        aria-label={`Edit ${u.name}`}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-ghost px-2 py-1 text-xs md:text-sm"
                        onClick={() => onDelete(u)}
                        aria-label={`Delete ${u.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile list ( < md ) */}
      <div className="md:hidden">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse p-3 border-b border-border/40">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}

        {!loading &&
          items.map((u) => (
            <div key={u._id} className="p-3 border-b border-border/40">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate" title={u.name}>{u.name}</div>
                  <div className="text-xs text-muted truncate" title={u.email}>{u.email}</div>

                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <RoleBadge role={u.role} />
                    <StatusBadge status={u.status} />
                    {u.premium ? (
                      <span className="badge px-2 py-0.5 text-[11px]">Premium</span>
                    ) : (
                      <span className="text-xs text-muted">Free</span>
                    )}
                  </div>

                  <div className="text-xs text-muted mt-1">
                    Joined {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    className="btn-ghost px-2 py-1 text-xs"
                    onClick={() => onEdit(u)}
                    aria-label={`Edit ${u.name}`}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-ghost px-2 py-1 text-xs"
                    onClick={() => onDelete(u)}
                    aria-label={`Delete ${u.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

        {!loading && items.length === 0 && (
          <div className="p-6 text-center text-muted">No users found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 pt-4">
        <div className="text-xs text-muted order-2 md:order-1">
          Page <span className="text-text">{page}</span> of {" "}
          <span className="text-text">{totalPages}</span> — {" "}
          {total} total
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
