// Use mock when VITE_USE_MOCK=1 or when no VITE_API_URL is configured (makes dev easier)
import axios from "axios";

const _env = import.meta?.env || {};
const USE_MOCK = _env.VITE_USE_MOCK === "1" || !_env.VITE_API_URL;

const api = axios.create({
  baseURL: _env.VITE_API_URL || "/api",
  withCredentials: true,
});

// ---------- Normalizers ----------
const mapUser = (u) => ({
  _id: u._id || u.id,
  name: u.name || "",
  email: u.email || "",
  role: u.role || "fan",
  createdAt: u.createdAt || new Date().toISOString(),
});

const mapOrder = (o) => ({
  _id: o._id || o.id,
  sku: o.sku || "",
  product: o.product || "",
  amount: Number.isFinite(+o.amount) ? +o.amount : 0,
  status: o.status || "paid", // paid | refunded | pending
  createdAt: o.createdAt || new Date().toISOString(),
});

// ---------- MOCK ----------
const today = new Date();
const d = (days) => {
  const x = new Date(today);
  x.setDate(x.getDate() - days);
  return x.toISOString();
};

let MOCK = {
  summary: {
    users: 12345,
    subscribers: 2789,
    revenue: 48230.75,
    venues: 312,
    liveMatches: 26,
    tickets: 94,
  },
  trends: {
    users: [20, 25, 23, 30, 45, 40, 55, 60, 75, 90, 88, 100],
    revenue: [
      800, 760, 920, 1000, 980, 1120, 1300, 1250, 1500, 1600, 1580, 1700,
    ],
    subscribers: [5, 12, 9, 14, 12, 18, 22, 24, 19, 26, 23, 28],
  },
  recentUsers: [
    {
      _id: "u1",
      name: "Alex Carter",
      email: "alex@example.com",
      role: "fan",
      createdAt: d(1),
    },
    {
      _id: "u2",
      name: "Mira Janssen",
      email: "mira@pubhouse.nl",
      role: "business",
      createdAt: d(2),
    },
    {
      _id: "u3",
      name: "Admin Jess",
      email: "admin@ballie.app",
      role: "admin",
      createdAt: d(3),
    },
    {
      _id: "u4",
      name: "Omar Ali",
      email: "omar@example.com",
      role: "fan",
      createdAt: d(3),
    },
    {
      _id: "u5",
      name: "Sara Kim",
      email: "sara@ballie.app",
      role: "fan",
      createdAt: d(4),
    },
  ],
  recentOrders: [
    {
      _id: "o1",
      sku: "BAL-SCARF-RED",
      product: "Ballie Scarf",
      amount: 24.99,
      status: "paid",
      createdAt: d(0),
    },
    {
      _id: "o2",
      sku: "BAL-JERSEY-2425",
      product: "Ballie Jersey 24/25",
      amount: 64.0,
      status: "paid",
      createdAt: d(1),
    },
    {
      _id: "o3",
      sku: "VENUE-GC-50",
      product: "Venue Gift Card",
      amount: 50,
      status: "refunded",
      createdAt: d(1),
    },
    {
      _id: "o4",
      sku: "BAL-SCARF-RED",
      product: "Ballie Scarf",
      amount: 24.99,
      status: "pending",
      createdAt: d(2),
    },
  ],
};

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ---------- Public API ----------
export async function getSummary() {
  if (USE_MOCK) {
    await delay();
    return { ...MOCK.summary };
  }
  const res = await api.get("/dashboard/summary");
  return res.data;
}

export async function getTrends() {
  if (USE_MOCK) {
    await delay();
    return { ...MOCK.trends };
  }
  const res = await api.get("/dashboard/trends");
  return res.data;
}

export async function getRecentUsers(limit = 8) {
  if (USE_MOCK) {
    await delay();
    return MOCK.recentUsers.slice(0, limit).map(mapUser);
  }
  const res = await api.get("/dashboard/recent-users", { params: { limit } });
  const items = (res.data?.items || res.data || []).map(mapUser);
  return items;
}

export async function getRecentOrders(limit = 8) {
  if (USE_MOCK) {
    await delay();
    return MOCK.recentOrders.slice(0, limit).map(mapOrder);
  }
  const res = await api.get("/dashboard/recent-orders", { params: { limit } });
  const items = (res.data?.items || res.data || []).map(mapOrder);
  return items;
}
