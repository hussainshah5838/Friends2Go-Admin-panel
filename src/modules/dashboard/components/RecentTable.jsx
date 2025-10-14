import React from "react";
import SkeletonRow from "./SkeletonRow";

export function RecentUsersTable({ loading, items }) {
  return (
    <div className="card">
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="font-semibold">Recent Users</div>
          <div className="text-xs text-muted">Latest signups</div>
        </div>
      </div>
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left">
            <tr className="text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={4} />
              ))}
            {!loading &&
              items.map((u) => (
                <tr key={u._id} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">
                  No users yet.
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
            <div key={i} className="animate-pulse p-3 border-t border-border/40">
              <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        {!loading &&
          items.map((u) => (
            <div key={u._id} className="p-3 border-t border-border/40">
              <div className="font-medium truncate">{u.name}</div>
              <div className="text-xs text-muted truncate">{u.email}</div>
              <div className="text-xs text-muted mt-1 capitalize">{u.role} · {new Date(u.createdAt).toLocaleString()}</div>
            </div>
          ))}
        {!loading && items.length === 0 && (
          <div className="p-6 text-center text-muted">No users yet.</div>
        )}
      </div>
    </div>
  );
}

export function RecentOrdersTable({ loading, items }) {
  function StatusBadge({ status }) {
    const map = {
      paid: "bg-success/20 text-success border border-success/30",
      refunded: "bg-danger/20 text-danger border border-danger/30",
      pending: "bg-warning/20 text-warning border border-warning/30",
    };
    return <span className={`badge ${map[status] || ""}`}>{status}</span>;
  }

  return (
    <div className="card">
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="font-semibold">Recent Orders</div>
          <div className="text-xs text-muted">Latest transactions</div>
        </div>
      </div>
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left">
            <tr className="text-muted">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} cols={5} />
              ))}
            {!loading &&
              items.map((o) => (
                <tr key={o._id} className="border-t border-border/60">
                  <td className="px-4 py-3">{o.product}</td>
                  <td className="px-4 py-3">{o.sku}</td>
                  <td className="px-4 py-3">${o.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No orders yet.
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
            <div key={i} className="animate-pulse p-3 border-t border-border/40">
              <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        {!loading &&
          items.map((o) => (
            <div key={o._id} className="p-3 border-t border-border/40">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium truncate">{o.product}</div>
                <span className="text-xs">${o.amount.toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted truncate">SKU {o.sku}</div>
              <div className="flex items-center justify-between mt-1">
                <StatusBadge status={o.status} />
                <span className="text-xs text-muted">{new Date(o.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        {!loading && items.length === 0 && (
          <div className="p-6 text-center text-muted">No orders yet.</div>
        )}
      </div>
    </div>
  );
}
