import React, { useEffect, useMemo, useState } from "react";

const STATUS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const DEFAULT_CATEGORIES = ["Announcements", "Guides", "Fixtures", "General"];
const DEFAULT_AUTHORS = ["Editorial", "Ops Team", "Marketing", "Unknown"];

function slugify(v = "") {
  return v
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export default function PostDrawer({
  open,
  onClose,
  initial = null,
  onSubmit,
  categories = DEFAULT_CATEGORIES,
  authors = DEFAULT_AUTHORS,
}) {
  const isEdit = !!(initial && initial._id);
  const [model, setModel] = useState({
    title: "",
    slug: "",
    status: "draft",
    author: authors[0] || "Unknown",
    category: categories[0] || "General",
    tags: [],
    coverImage: "",
    excerpt: "",
    content: "",
    publishedAt: null,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    setModel({
      title: initial?.title || "",
      slug: initial?.slug || "",
      status: initial?.status || "draft",
      author: initial?.author || authors[0] || "Unknown",
      category: initial?.category || categories[0] || "General",
      tags: Array.isArray(initial?.tags) ? initial.tags : [],
      coverImage: initial?.coverImage || "",
      excerpt: initial?.excerpt || "",
      content: initial?.content || "",
      publishedAt: initial?.publishedAt || null,
    });
    setErrors({});
    setSlugTouched(false);
  }, [initial, open, authors, categories]);

  // auto-slug if title changes and slug not manually edited
  useEffect(() => {
    if (!slugTouched) {
      setModel((m) => ({ ...m, slug: slugify(m.title) }));
    }
  }, [model.title, slugTouched]);

  const tagsText = useMemo(() => (model.tags || []).join(", "), [model.tags]);

  if (!open) return null;

  function validate(m) {
    const e = {};
    if (!m.title.trim()) e.title = "Title is required";
    if (!m.slug.trim()) e.slug = "Slug is required";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.slug))
      e.slug = "Slug must be lowercase and use hyphens";
    if (m.status === "published" && !m.publishedAt)
      e.publishedAt = "Published date is required for published posts";
    return e;
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    const eMap = validate(model);
    setErrors(eMap);
    if (Object.keys(eMap).length) return;

    setSaving(true);
    try {
      const payload = {
        ...model,
        tags: (model.tags || []).map((t) => t.trim()).filter(Boolean),
        publishedAt:
          model.status === "published"
            ? model.publishedAt || new Date().toISOString()
            : null,
      };
      await onSubmit(payload);
      onClose?.();
    } finally {
      setSaving(false);
    }
  }
  // moved above conditional return to comply with React Hooks rules

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* full-screen on mobile, slide-in panel on desktop */}
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[28rem] md:w-[32rem] lg:w-[36rem] max-w-full glass p-5 overflow-y-auto rounded-none sm:rounded-l-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Post" : "New Post"}
          </h3>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title / Slug */}
          <div className="grid md:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-muted">Title</span>
              <input
                className="input mt-1"
                value={model.title}
                onChange={(e) =>
                  setModel((m) => ({ ...m, title: e.target.value }))
                }
                placeholder="Write a compelling title…"
              />
              {errors.title && (
                <div className="text-danger text-xs mt-1">{errors.title}</div>
              )}
            </label>

            <label className="block">
              <span className="text-sm text-muted">Slug</span>
              <input
                className="input mt-1"
                value={model.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setModel((m) => ({
                    ...m,
                    slug: e.target.value.toLowerCase(),
                  }));
                }}
                placeholder="auto-generated-from-title"
              />
              {errors.slug && (
                <div className="text-danger text-xs mt-1">{errors.slug}</div>
              )}
            </label>
          </div>

          {/* Meta */}
          <div className="grid md:grid-cols-4 gap-3">
            <label className="block md:col-span-2">
              <span className="text-sm text-muted">Author</span>
              <select
                className="input mt-1"
                value={model.author}
                onChange={(e) =>
                  setModel((m) => ({ ...m, author: e.target.value }))
                }
              >
                {authors.map((a) => (
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
                value={model.category}
                onChange={(e) =>
                  setModel((m) => ({ ...m, category: e.target.value }))
                }
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-muted">Status</span>
              <select
                className="input mt-1"
                value={model.status}
                onChange={(e) =>
                  setModel((m) => ({ ...m, status: e.target.value }))
                }
              >
                {STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Publish date (only for published) */}
          <div className="grid md:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-muted">Published at</span>
              <input
                type="datetime-local"
                className="input mt-1"
                value={
                  model.publishedAt
                    ? new Date(model.publishedAt).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    publishedAt: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  }))
                }
              />
              {errors.publishedAt && (
                <div className="text-danger text-xs mt-1">
                  {errors.publishedAt}
                </div>
              )}
            </label>

            <label className="block">
              <span className="text-sm text-muted">Tags (comma separated)</span>
              <input
                className="input mt-1"
                value={tagsText}
                onChange={(e) =>
                  setModel((m) => ({
                    ...m,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="launch, venues, how-to"
              />
            </label>
          </div>

          {/* Cover / Excerpt */}
          <div className="grid md:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-muted">Cover image URL</span>
              <input
                className="input mt-1"
                value={model.coverImage}
                onChange={(e) =>
                  setModel((m) => ({ ...m, coverImage: e.target.value }))
                }
                placeholder="https://…"
              />
              {model.coverImage && (
                <img
                  src={model.coverImage}
                  alt="cover preview"
                  className="mt-2 h-28 w-full object-cover rounded-xl"
                />
              )}
            </label>

            <label className="block">
              <span className="text-sm text-muted">Excerpt</span>
              <textarea
                className="input mt-1 min-h-[112px]"
                value={model.excerpt}
                onChange={(e) =>
                  setModel((m) => ({ ...m, excerpt: e.target.value }))
                }
                placeholder="Short teaser visible in lists…"
              />
            </label>
          </div>

          {/* Content */}
          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">
                Content (Markdown or plain text)
              </span>
              <span className="text-xs text-muted">
                {(model.content || "").length} chars
              </span>
            </div>
            <textarea
              className="input mt-1 min-h-[220px]"
              value={model.content}
              onChange={(e) =>
                setModel((m) => ({ ...m, content: e.target.value }))
              }
              placeholder="Write your article content here…"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={saving}>
              {saving
                ? "Saving…"
                : isEdit
                ? "Save changes"
                : "Publish / Save draft"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
