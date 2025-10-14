import React, { useEffect, useMemo, useState } from "react";
import {
  listPosts,
  createPost,
  updatePost,
  deletePost,
} from "./api/blog.service";
import PostsTable from "./components/PostsTable";
import PostDrawer from "./components/PostDrawer";
import DeleteConfirm from "../users/components/DeleteConfirm";

const LIMIT = 10;
const CATEGORIES = ["Announcements", "Guides", "Fixtures", "General"];
const AUTHORS = ["Editorial", "Ops Team", "Marketing", "Unknown"];

export default function BlogData() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [delOpen, setDelOpen] = useState(false);
  const [delItem, setDelItem] = useState(null);

  const params = useMemo(
    () => ({ page, limit: LIMIT, q, status, author, category }),
    [page, q, status, author, category]
  );

  async function fetchData() {
    setLoading(true);
    try {
      const res = await listPosts(params);
      setRows(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, status, author, category]);

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
      await updatePost(editing._id, model);
    } else {
      await createPost(model);
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
    await deletePost(delItem._id);
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block sm:col-span-2">
            <span className="text-sm text-muted">Search</span>
            <input
              className="input mt-1"
              placeholder="Search title, slug, or content…"
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
              className="input mt-1"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-muted">Author</span>
            <select
              className="input mt-1"
              value={author}
              onChange={(e) => {
                setPage(1);
                setAuthor(e.target.value);
              }}
            >
              <option value="">All</option>
              {AUTHORS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>

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
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button className="btn" onClick={openCreate}>
            New Post
          </button>
        </div>
      </div>

      {/* Table */}
      <PostsTable
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
      <PostDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
        categories={CATEGORIES}
        authors={AUTHORS}
      />

      <DeleteConfirm
        open={delOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={confirmDelete}
        name={delItem?.title}
      />
    </div>
  );
}
