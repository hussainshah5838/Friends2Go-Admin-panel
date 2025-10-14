import React, { useEffect, useMemo, useState } from "react";
import {
  listIntegrations,
  createIntegration,
  updateIntegration,
  deleteIntegration,
} from "../../api/settings.service";
import IntegrationsTable from "./IntegrationsTable";
import IntegrationDrawer from "./IntegrationDrawer";
import DeleteConfirm from "../../../users/components/DeleteConfirm";

const LIMIT = 10;

export default function IntegrationsTab() {
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
      const res = await listIntegrations(params);
      // defensive: ensure rows is always an array
      setRows(Array.isArray(res?.items) ? res.items : []);
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
  function openEdit(it) {
    setEditing(it);
    setDrawerOpen(true);
  }

  async function handleSubmit(model) {
    if (editing?._id) await updateIntegration(editing._id, model);
    else await createIntegration(model);
    setPage(1);
    await fetchData();
  }

  function askDelete(it) {
    setDelItem(it);
    setDelOpen(true);
  }
  async function confirmDelete() {
    if (!delItem) return;
    await deleteIntegration(delItem._id);
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
            Connect payment gateways & services
          </div>
          <div className="text-xs text-muted">
            Stripe, PayPal, Firebase, custom
          </div>
        </div>
        <button className="btn" onClick={openCreate}>
          Add Integration
        </button>
      </div>

      <IntegrationsTable
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

      <IntegrationDrawer
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
