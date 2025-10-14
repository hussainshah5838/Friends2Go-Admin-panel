// Use mock when VITE_USE_MOCK=1 or when no VITE_API_URL is configured (makes dev easier)
import axios from "axios";

const _env = import.meta?.env || {};
const USE_MOCK = _env.VITE_USE_MOCK === "1" || !_env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta?.env?.VITE_API_URL || "/api",
  withCredentials: true,
});

// normalize
const mapPost = (p) => ({
  _id: p._id || p.id,
  title: p.title || "",
  slug: (p.slug || "").toLowerCase(),
  status: p.status || "draft", // draft | published | archived
  author: p.author || "Unknown",
  category: p.category || "General",
  tags: Array.isArray(p.tags) ? p.tags : [],
  coverImage: p.coverImage || "",
  excerpt: p.excerpt || "",
  content: p.content || "",
  publishedAt: p.publishedAt || null,
  createdAt: p.createdAt || new Date().toISOString(),
  updatedAt: p.updatedAt || new Date().toISOString(),
});

// ------- mock data -------
let MOCK = [
  {
    _id: "b1",
    title: "Welcome to Ballie — Match Discovery 101",
    slug: "welcome-to-ballie",
    status: "published",
    author: "Editorial",
    category: "Announcements",
    tags: ["launch", "fans"],
    coverImage:
      "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1200&auto=format&fit=crop",
    excerpt:
      "Ballie helps you find live football at nearby venues and streams.",
    content: "## Hello world\nBallie connects fans to venues and live streams.",
    publishedAt: "2025-10-05T08:30:00.000Z",
    createdAt: "2025-10-04T15:00:00.000Z",
    updatedAt: "2025-10-11T10:00:00.000Z",
  },
  {
    _id: "b2",
    title: "Venue Guidelines for Match Posting",
    slug: "venue-guidelines",
    status: "draft",
    author: "Ops Team",
    category: "Guides",
    tags: ["venues", "compliance"],
    coverImage: "",
    excerpt: "How to post, tag, and keep your listings accurate.",
    content: "Step-by-step guide for venue owners...",
    publishedAt: null,
    createdAt: "2025-10-08T12:00:00.000Z",
    updatedAt: "2025-10-12T09:40:00.000Z",
  },
  {
    _id: "b3",
    title: "October Schedule: Top Matches to Watch",
    slug: "october-schedule-top-matches",
    status: "archived",
    author: "Editorial",
    category: "Fixtures",
    tags: ["schedules"],
    coverImage: "",
    excerpt: "This month’s must-see fixtures across Europe.",
    content: "List of matches...",
    publishedAt: "2025-10-01T09:00:00.000Z",
    createdAt: "2025-09-28T10:00:00.000Z",
    updatedAt: "2025-10-02T10:00:00.000Z",
  },
];

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

function mockFilter(data, { q, status, author, category }) {
  return data.filter((p) => {
    const qn = (q || "").trim().toLowerCase();
    const hitQ =
      !qn ||
      p.title.toLowerCase().includes(qn) ||
      p.slug.toLowerCase().includes(qn) ||
      p.excerpt.toLowerCase().includes(qn) ||
      p.content.toLowerCase().includes(qn);
    const hitStatus = !status || p.status === status;
    const hitAuthor = !author || p.author === author;
    const hitCat = !category || p.category === category;
    return hitQ && hitStatus && hitAuthor && hitCat;
  });
}

// ------- public API -------
export async function listPosts({
  page = 1,
  limit = 10,
  q = "",
  status = "",
  author = "",
  category = "",
} = {}) {
  if (USE_MOCK) {
    await delay();
    const filtered = mockFilter(MOCK, { q, status, author, category });
    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);
    return { items, total, page, limit };
  }
  const res = await api.get("/blog/posts", {
    params: { page, limit, q, status, author, category },
  });
  const items = (res.data?.items || []).map(mapPost);
  return {
    items,
    total: res.data?.total || items.length,
    page: res.data?.page || page,
    limit: res.data?.limit || limit,
  };
}

export async function getPost(id) {
  if (USE_MOCK) {
    await delay();
    return MOCK.find((p) => p._id === id);
  }
  const res = await api.get(`/blog/posts/${id}`);
  return mapPost(res.data);
}

export async function createPost(payload) {
  if (USE_MOCK) {
    await delay();
    const _id = crypto.randomUUID();
    const now = new Date().toISOString();
    const post = mapPost({ _id, ...payload, createdAt: now, updatedAt: now });
    MOCK.unshift(post);
    return post;
  }
  const res = await api.post("/blog/posts", payload);
  return mapPost(res.data);
}

export async function updatePost(id, payload) {
  if (USE_MOCK) {
    await delay();
    const i = MOCK.findIndex((p) => p._id === id);
    if (i >= 0) {
      const now = new Date().toISOString();
      MOCK[i] = mapPost({ ...MOCK[i], ...payload, updatedAt: now });
      return MOCK[i];
    }
    throw new Error("Post not found");
  }
  const res = await api.put(`/blog/posts/${id}`, payload);
  return mapPost(res.data);
}

export async function deletePost(id) {
  if (USE_MOCK) {
    await delay();
    MOCK = MOCK.filter((p) => p._id !== id);
    return { ok: true };
  }
  await api.delete(`/blog/posts/${id}`);
  return { ok: true };
}
