import React, { useEffect, useMemo, useState } from "react";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api/products.service";
import ProductsTable from "./components/ProductsTable";
import ProductDrawer from "./components/ProductDrawer";
import DeleteConfirm from "../users/components/DeleteConfirm";

const LIMIT = 10;

export default function ShopData() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [delOpen, setDelOpen] = useState(false);
  const [delItem, setDelItem] = useState(null);

  const params = useMemo(
    () => ({ page, limit: LIMIT, q, category, status }),
    [page, q, category, status]
  );

  async function fetchData() {
    setLoading(true);
    try {
      const res = await listProducts(params);
      setRows(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, category, status]);

  function openCreate() {
    setEditing(null);
    setDrawerOpen(true);
  }
  function openEdit(p) {
    setEditing(p);
    setDrawerOpen(true);
  }

  async function handleSubmit(model) {
    if (editing?._id) {
      await updateProduct(editing._id, model);
    } else {
      await createProduct(model);
      setPage(1);
    }
    await fetchData();
  }

  function askDelete(p) {
    setDelItem(p);
    setDelOpen(true);
  }
  async function confirmDelete() {
    if (!delItem) return;
    await deleteProduct(delItem._id);
    setDelOpen(false);
    setDelItem(null);
    const newCount = total - 1;
    const lastPage = Math.max(1, Math.ceil(newCount / LIMIT));
    if (page > lastPage) setPage(lastPage);
    await fetchData();
  }

  return (
    <div className="space-y-5">
      {/* Filters / actions */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="block">
              <span className="text-sm text-muted">Search</span>
              <input
                className="input mt-1"
                placeholder="Search name or SKU…"
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
              <span className="text-sm text-muted">Category</span>
              <select
                className="input mt-1"
                value={category}
                onChange={(e) => {
                  setPage(1);
                  setCategory(e.target.value);
                }}
              >
                <option value="">All</option>
                <option value="merch">Merchandise</option>
                <option value="voucher">Voucher</option>
                <option value="general">General</option>
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
                <option value="draft">Draft</option>
                <option value="oos">Out of stock</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <div className="flex sm:justify-end items-end">
              <button className="btn w-full sm:w-auto" onClick={openCreate}>
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <ProductsTable
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

      {/* Drawer / Modal */}
      <ProductDrawer
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
