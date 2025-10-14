// Use mock when VITE_USE_MOCK=1 or when no VITE_API_URL is configured (makes dev easier)
import axios from "axios";

const _env = import.meta?.env || {};
const USE_MOCK = _env.VITE_USE_MOCK === "1" || !_env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta?.env?.VITE_API_URL || "/api",
  withCredentials: true,
});

const mapProduct = (p) => ({
  _id: p._id || p.id,
  name: p.name ?? "",
  sku: p.sku ?? "",
  price: Number(p.price ?? 0),
  stock: Number(p.stock ?? 0),
  category: p.category ?? "general",
  status: p.status ?? "active", // active | draft | archived | oos
  image: p.image ?? "",
  updatedAt: p.updatedAt || p.createdAt || new Date().toISOString(),
});

// ------- mock data -------
let MOCK = [
  {
    _id: "p1",
    name: "Ballie Fan Scarf",
    sku: "SCF-001",
    price: 19.99,
    stock: 120,
    category: "merch",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1520975922284-9bcd4b04d93e?q=80&w=800",
    updatedAt: "2025-10-12T18:22:00.000Z",
  },
  {
    _id: "p2",
    name: "Venue Voucher €25",
    sku: "VCH-025",
    price: 25,
    stock: 0,
    category: "voucher",
    status: "oos",
    image:
      "https://images.unsplash.com/photo-1560179707-f14e90ef1025?q=80&w=800",
    updatedAt: "2025-10-11T10:05:00.000Z",
  },
  {
    _id: "p3",
    name: "Ballie Shirt",
    sku: "TSH-010",
    price: 29,
    stock: 42,
    category: "merch",
    status: "draft",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
    updatedAt: "2025-10-10T12:30:00.000Z",
  },
];

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

function mockFilter(data, { q, category, status }) {
  return data.filter((p) => {
    const hitQ =
      !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const hitCat = !category || p.category === category;
    const hitStatus = !status || p.status === status;
    return hitQ && hitCat && hitStatus;
  });
}

// ------- public API -------
export async function listProducts({
  page = 1,
  limit = 10,
  q = "",
  category = "",
  status = "",
} = {}) {
  if (USE_MOCK) {
    await delay();
    const filtered = mockFilter(MOCK, {
      q: q.trim().toLowerCase(),
      category,
      status,
    });
    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);
    return { items, total, page, limit };
  }
  const res = await api.get("/products", {
    params: { page, limit, q, category, status },
  });
  const items = (res.data?.items || []).map(mapProduct);
  return {
    items,
    total: res.data?.total ?? items.length,
    page: res.data?.page ?? page,
    limit: res.data?.limit ?? limit,
  };
}

export async function getProduct(id) {
  if (USE_MOCK) {
    await delay();
    return MOCK.find((p) => p._id === id);
  }
  const res = await api.get(`/products/${id}`);
  return mapProduct(res.data);
}

export async function createProduct(payload) {
  if (USE_MOCK) {
    await delay();
    const _id = crypto.randomUUID();
    const item = mapProduct({
      _id,
      ...payload,
      updatedAt: new Date().toISOString(),
    });
    MOCK.unshift(item);
    return item;
  }
  const res = await api.post("/products", payload);
  return mapProduct(res.data);
}

export async function updateProduct(id, payload) {
  if (USE_MOCK) {
    await delay();
    const i = MOCK.findIndex((p) => p._id === id);
    if (i >= 0) {
      MOCK[i] = mapProduct({
        ...MOCK[i],
        ...payload,
        updatedAt: new Date().toISOString(),
      });
      return MOCK[i];
    }
    throw new Error("Product not found");
  }
  const res = await api.put(`/products/${id}`, payload);
  return mapProduct(res.data);
}

export async function deleteProduct(id) {
  if (USE_MOCK) {
    await delay();
    MOCK = MOCK.filter((p) => p._id !== id);
    return { ok: true };
  }
  await api.delete(`/products/${id}`);
  return { ok: true };
}
