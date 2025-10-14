// Use mock when VITE_USE_MOCK=1 or when no VITE_API_URL is configured (makes dev easier)
import axios from "axios";

const _env = import.meta?.env || {};
const USE_MOCK = _env.VITE_USE_MOCK === "1" || !_env.VITE_API_URL;
const api = axios.create({
  baseURL: import.meta?.env?.VITE_API_URL || "/api",
  withCredentials: true,
});

// ------- Normalizers -------
const mapIntegration = (x) => ({
  _id: x._id || x.id,
  provider: x.provider || "stripe", // stripe | paypal | firebase | "custom"
  name: x.name || "",
  apiKey: x.apiKey || "",
  status: x.status || "active", // active | disabled
  lastSyncAt: x.lastSyncAt || null,
  createdAt: x.createdAt || new Date().toISOString(),
});

const mapRole = (x) => ({
  _id: x._id || x.id,
  name: x.name || "custom",
  description: x.description || "",
  // simple permission flags (extend later)
  perms: {
    usersRead: !!x?.perms?.usersRead,
    usersWrite: !!x?.perms?.usersWrite,
    postsWrite: !!x?.perms?.postsWrite,
    billingManage: !!x?.perms?.billingManage,
    venuesVerify: !!x?.perms?.venuesVerify,
  },
  createdAt: x.createdAt || new Date().toISOString(),
});

// ------- MOCKS -------
let MOCK_SETTINGS = {
  general: {
    appName: "Ballie Admin",
    supportEmail: "support@ballie.app",
    logoUrl: "",
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: true,
    digest: "daily", // immediate | daily | weekly
  },
  appearance: {
    themeMode: "dark", // dark | light
    primaryColor: "#a8ff1a",
  },
  localization: {
    defaultLang: "en",
    supported: ["en", "nl"],
  },
};

let MOCK_INTEGRATIONS = [
  {
    _id: "i1",
    provider: "stripe",
    name: "Stripe (Prod)",
    apiKey: "sk_live_********",
    status: "active",
    lastSyncAt: "2025-10-11T10:00:00.000Z",
    createdAt: "2025-10-01T08:00:00.000Z",
  },
  {
    _id: "i2",
    provider: "paypal",
    name: "PayPal (Sandbox)",
    apiKey: "sandbox_********",
    status: "disabled",
    lastSyncAt: null,
    createdAt: "2025-10-03T12:30:00.000Z",
  },
];

let MOCK_ROLES = [
  {
    _id: "r1",
    name: "admin",
    description: "Full access",
    perms: {
      usersRead: true,
      usersWrite: true,
      postsWrite: true,
      billingManage: true,
      venuesVerify: true,
    },
    createdAt: "2025-09-15T09:00:00.000Z",
  },
  {
    _id: "r2",
    name: "business",
    description: "Venue owner permissions",
    perms: {
      usersRead: true,
      usersWrite: false,
      postsWrite: true,
      billingManage: false,
      venuesVerify: false,
    },
    createdAt: "2025-09-20T09:00:00.000Z",
  },
  {
    _id: "r3",
    name: "moderator",
    description: "Content moderation only",
    perms: {
      usersRead: true,
      usersWrite: false,
      postsWrite: true,
      billingManage: false,
      venuesVerify: true,
    },
    createdAt: "2025-10-01T09:00:00.000Z",
  },
];

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ------- Settings (forms) -------
export async function fetchAllSettings() {
  if (USE_MOCK) {
    await delay();
    return structuredClone(MOCK_SETTINGS);
  }
  const res = await api.get("/settings");
  return res.data;
}

export async function saveGeneral(payload) {
  if (USE_MOCK) {
    await delay();
    MOCK_SETTINGS.general = { ...MOCK_SETTINGS.general, ...payload };
    return MOCK_SETTINGS.general;
  }
  const res = await api.put("/settings/general", payload);
  return res.data;
}

export async function saveNotifications(payload) {
  if (USE_MOCK) {
    await delay();
    MOCK_SETTINGS.notifications = {
      ...MOCK_SETTINGS.notifications,
      ...payload,
    };
    return MOCK_SETTINGS.notifications;
  }
  const res = await api.put("/settings/notifications", payload);
  return res.data;
}

export async function saveAppearance(payload) {
  if (USE_MOCK) {
    await delay();
    MOCK_SETTINGS.appearance = { ...MOCK_SETTINGS.appearance, ...payload };
    return MOCK_SETTINGS.appearance;
  }
  const res = await api.put("/settings/appearance", payload);
  return res.data;
}

export async function saveLocalization(payload) {
  if (USE_MOCK) {
    await delay();
    MOCK_SETTINGS.localization = { ...MOCK_SETTINGS.localization, ...payload };
    return MOCK_SETTINGS.localization;
  }
  const res = await api.put("/settings/localization", payload);
  return res.data;
}

// ------- Integrations (table + CRUD) -------
export async function listIntegrations({ page = 1, limit = 10 } = {}) {
  if (USE_MOCK) {
    await delay();
    const total = MOCK_INTEGRATIONS.length;
    const start = (page - 1) * limit;
    return {
      items: MOCK_INTEGRATIONS.slice(start, start + limit).map(mapIntegration),
      total,
      page,
      limit,
    };
  }
  const res = await api.get("/settings/integrations", {
    params: { page, limit },
  });
  // normalize remote shape to ensure callers always get { items, total, page, limit }
  const items = (res.data?.items || []).map(mapIntegration);
  return {
    items,
    total: res.data?.total || items.length,
    page: res.data?.page || page,
    limit: res.data?.limit || limit,
  };
}

export async function createIntegration(payload) {
  if (USE_MOCK) {
    await delay();
    const _id = crypto.randomUUID();
    const it = mapIntegration({
      _id,
      ...payload,
      createdAt: new Date().toISOString(),
    });
    MOCK_INTEGRATIONS.unshift(it);
    return it;
  }
  const res = await api.post("/settings/integrations", payload);
  return mapIntegration(res.data);
}

export async function updateIntegration(id, payload) {
  if (USE_MOCK) {
    await delay();
    const i = MOCK_INTEGRATIONS.findIndex((x) => x._id === id);
    if (i >= 0) {
      MOCK_INTEGRATIONS[i] = mapIntegration({
        ...MOCK_INTEGRATIONS[i],
        ...payload,
      });
      return MOCK_INTEGRATIONS[i];
    }
    throw new Error("Integration not found");
  }
  const res = await api.put(`/settings/integrations/${id}`, payload);
  return mapIntegration(res.data);
}

export async function deleteIntegration(id) {
  if (USE_MOCK) {
    await delay();
    MOCK_INTEGRATIONS = MOCK_INTEGRATIONS.filter((x) => x._id !== id);
    return { ok: true };
  }
  await api.delete(`/settings/integrations/${id}`);
  return { ok: true };
}

// ------- Roles (table + CRUD) -------
export async function listRoles({ page = 1, limit = 10 } = {}) {
  if (USE_MOCK) {
    await delay();
    const total = MOCK_ROLES.length;
    const start = (page - 1) * limit;
    return {
      items: MOCK_ROLES.slice(start, start + limit).map(mapRole),
      total,
      page,
      limit,
    };
  }
  const res = await api.get("/settings/roles", { params: { page, limit } });
  const items = (res.data?.items || []).map(mapRole);
  return {
    items,
    total: res.data?.total || items.length,
    page: res.data?.page || page,
    limit: res.data?.limit || limit,
  };
}

export async function createRole(payload) {
  if (USE_MOCK) {
    await delay();
    const _id = crypto.randomUUID();
    const r = mapRole({ _id, ...payload, createdAt: new Date().toISOString() });
    MOCK_ROLES.unshift(r);
    return r;
  }
  const res = await api.post("/settings/roles", payload);
  return mapRole(res.data);
}

export async function updateRole(id, payload) {
  if (USE_MOCK) {
    await delay();
    const i = MOCK_ROLES.findIndex((x) => x._id === id);
    if (i >= 0) {
      MOCK_ROLES[i] = mapRole({ ...MOCK_ROLES[i], ...payload });
      return MOCK_ROLES[i];
    }
    throw new Error("Role not found");
  }
  const res = await api.put(`/settings/roles/${id}`, payload);
  return mapRole(res.data);
}

export async function deleteRole(id) {
  if (USE_MOCK) {
    await delay();
    MOCK_ROLES = MOCK_ROLES.filter((x) => x._id !== id);
    return { ok: true };
  }
  await api.delete(`/settings/roles/${id}`);
  return { ok: true };
}
