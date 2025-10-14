import React, { useEffect, useMemo, useState } from "react";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./api/users.service";
import UserDrawer from "./components/UserDrawer";
import DeleteConfirm from "./components/DeleteConfirm";
import UserTable from "./components/UserTable";

const LIMIT = 10;

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

  const queryParams = useMemo(
    () => ({ page, limit: LIMIT, q, role, status }),
    [page, q, role, status]
  );

  async function fetchData() {
    setLoading(true);
    try {
      const res = await listUsers(queryParams);
      setRows(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, role, status]);

  function openCreate() {
    setEditing(null);
    setDrawerOpen(true);
  }
  function openEdit(u) {
    setEditing(u);
    setDrawerOpen(true);
  }

  async function handleSubmit(model) {
    if (editing?._id) {
      await updateUser(editing._id, model);
    } else {
      await createUser(model);
      setPage(1);
    }
    await fetchData();
  }

  function askDelete(u) {
    setDelUser(u);
    setDelOpen(true);
  }

  async function confirmDelete() {
    if (!delUser) return;
    await deleteUser(delUser._id);
    setDelOpen(false);
    setDelUser(null);
    // if we deleted last item on page, go back a page if needed
    const newCount = total - 1;
    const lastPage = Math.max(1, Math.ceil(newCount / LIMIT));
    if (page > lastPage) setPage(lastPage);
    await fetchData();
  }

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="block">
              <span className="text-sm text-muted">Search</span>
              <input
                className="input mt-1"
                placeholder="Search name or email…"
                value={q}
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <label className="block">
              <span className="text-sm text-muted">Role</span>
              <select
                className="input mt-1"
                value={role}
                onChange={(e) => {
                  setPage(1);
                  setRole(e.target.value);
                }}
              >
                <option value="">All</option>
                <option value="fan">Fan</option>
                <option value="business">Business</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-muted">Status</span>
              <select
                className="input mt-1"
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

            <div className="flex sm:justify-end items-end">
              <button className="btn w-full sm:w-auto" onClick={openCreate}>
                Add New User
              </button>
            </div>
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
        onEdit={openEdit}
        onDelete={askDelete}
      />

      {/* Drawers & Modals */}
      <UserDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />

      <DeleteConfirm
        open={delOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={confirmDelete}
        name={delUser?.name}
      />
    </div>
  );
}
