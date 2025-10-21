"use client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./api/users.service";
import UserDrawer from "./components/UserDrawer";
import DeleteConfirm from "./components/DeleteConfirm";
import UserTable from "./components/UserTable";

/* ---------------------- Constants ---------------------- */
const LIMIT = 10;

/* ---------------------- View Modal ---------------------- */
function ViewUserModal({ open, onClose, user }) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[26rem] md:w-[30rem] lg:w-[34rem] glass p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">User Details</h3>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.profileImage}
              alt={user.fullName}
              className="w-16 h-16 rounded-full border border-border/40 object-cover"
            />
            <div>
              <div className="font-semibold text-lg">{user.fullName}</div>
              <div className="text-sm text-muted">{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <div>
              <div className="text-xs text-muted uppercase">Auth Type</div>
              <div className="text-sm">{user.authType}</div>
            </div>
            <div>
              <div className="text-xs text-muted uppercase">Role</div>
              <div className="text-sm capitalize">{user.role}</div>
            </div>
            <div>
              <div className="text-xs text-muted uppercase">Status</div>
              <div className="text-sm capitalize">{user.status}</div>
            </div>
            <div>
              <div className="text-xs text-muted uppercase">Created</div>
              <div className="text-sm">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : "—"}
              </div>
            </div>
          </div>

          {user.bio && (
            <div>
              <div className="text-xs text-muted uppercase mb-1">Bio</div>
              <p className="text-sm whitespace-pre-line">{user.bio}</p>
            </div>
          )}

          {user.fcmToken && (
            <div>
              <div className="text-xs text-muted uppercase mb-1">FCM Token</div>
              <textarea
                readOnly
                className="input text-xs h-[90px] resize-none"
                value={user.fcmToken}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Main Component ---------------------- */
export default function UsersList() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [delOpen, setDelOpen] = useState(false);
  const [delUser, setDelUser] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  const queryParams = useMemo(
    () => ({ page, limit: LIMIT, q, role, status }),
    [page, q, role, status]
  );

  /* ---------------------- Data Fetching ---------------------- */
  async function fetchData() {
    setLoading(true);
    try {
      const res = await listUsers(queryParams);
      // Client-side pagination to match LIMIT + page
      const totalCount = res.total || (res.items?.length ?? 0);
      const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

      // If current page is out of range (e.g., after delete), snap to last page
      if (page > totalPages) {
        setPage(totalPages);
        return; // will refetch on next effect tick
      }

      const start = (page - 1) * LIMIT;
      const end = start + LIMIT;
      const pageItems = (res.items || []).slice(start, end);

      setRows(pageItems);
      setTotal(totalCount);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, role, status]);

  /* ---------------------- Drawer Handlers ---------------------- */
  function openCreate() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function openEdit(u) {
    setEditing(u);
    setDrawerOpen(true);
  }

  async function handleSubmit(model) {
    try {
      if (editing?._id) {
        await updateUser(editing._id, model);
        // Optimistically update local table for snappier UX
        setRows((rs) => rs.map((r) => (r._id === editing._id ? { ...r, ...model } : r)));
        toast.success("User updated");
      } else {
        await createUser(model);
        toast.success("User created");
        setPage(1);
      }
      // Refresh in the background (ensures server truth wins)
      setTimeout(() => {
        fetchData().catch((err) => {
          console.error(err);
          toast.error("Failed to refresh users");
        });
      }, 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save user");
      throw err; // let drawer stop spinner correctly
    }
  }

  /* ---------------------- Delete Handlers ---------------------- */
  function askDelete(u) {
    setDelUser(u);
    setDelOpen(true);
  }

  async function confirmDelete() {
    if (!delUser) return;
    try {
      await deleteUser(delUser._id);
      toast.success("User deleted");
      setDelOpen(false);
      setDelUser(null);
      const newCount = total - 1;
      const lastPage = Math.max(1, Math.ceil(newCount / LIMIT));
      if (page > lastPage) setPage(lastPage);
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  }

  /* ---------------------- View Handler ---------------------- */
  function openView(u) {
    setViewUser(u);
    setViewOpen(true);
  }

  /* ---------------------- Render ---------------------- */
  return (
    <div className="space-y-5">
      {/* Header / Filters */}
      <div className="card p-4">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <label className="block sm:col-span-2 lg:col-span-2">
            <span className="text-sm text-muted">Search</span>
            <input
              className="input mt-1 w-full"
              placeholder="Search by name or email…"
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
            />
          </label>

          <label className="block">
            <span className="text-sm text-muted">Status</span>
            <select
              className="input mt-1 w-full"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>

          <div className="sm:col-span-2 lg:col-span-1 flex sm:justify-end">
            {/* <button className="btn w-full sm:w-auto" onClick={openCreate}>
              Add New User
            </button> */}
          </div>
        </div>
      </div>

      {/* Table */}
      <UserTable
        loading={loading}
        items={rows}
        page={page}
        total={total}
        limit={LIMIT}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
        onView={openView}
        onEdit={openEdit}
        onDelete={askDelete}
      />

      {/* Drawer (Create/Edit) */}
      <UserDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />

      {/* View Modal */}
      <ViewUserModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        user={viewUser}
      />

      {/* Delete Confirm */}
      <DeleteConfirm
        open={delOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={confirmDelete}
        name={delUser?.fullName}
      />
    </div>
  );
}
