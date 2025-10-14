import React, { useEffect, useMemo, useState } from "react";
import {
  listRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../api/settings.service";
import RolesTable from "./RolesTable";
import RoleDrawer from "./RoleDrawer";
import DeleteConfirm from "../../../users/components/DeleteConfirm";

const LIMIT = 10;

export default function RolesTab() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [delOpen, setDelOpen] = useState(false);
  const [delItem, setDelItem] = useState(null);

  const params = useMemo(() => ({ page, limit: LIMIT }), [page]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await listRoles(params);
      setRows(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(); /* eslint-disable-next-line */
  }, [page]);

  function openCreate() {
    setEditing(null);
    setDrawerOpen(true);
  }
  function openEdit(r) {
    setEditing(r);
    setDrawerOpen(true);
  }

  async function handleSubmit(model) {
    if (editing?._id) await updateRole(editing._id, model);
    else await createRole(model);
    setPage(1);
    await fetchData();
  }

  function askDelete(r) {
    setDelItem(r);
    setDelOpen(true);
  }
  async function confirmDelete() {
    if (!delItem) return;
    await deleteRole(delItem._id);
    setDelOpen(false);
    setDelItem(null);
    const newCount = total - 1;
    const last = Math.max(1, Math.ceil(newCount / LIMIT));
    if (page > last) setPage(last);
    await fetchData();
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-sm text-muted">
            Manage admin roles & permissions
          </div>
          <div className="text-xs text-muted">
            Affect access across the dashboard
          </div>
        </div>
        <button className="btn" onClick={openCreate}>
          Create Role
        </button>
      </div>

      <RolesTable
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

      <RoleDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />

      <DeleteConfirm
        open={delOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={confirmDelete}
        name={delItem?.name}
      />
    </div>
  );
}
