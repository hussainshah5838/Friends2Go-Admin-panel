// In-memory + localStorage mock API for Users
// Shapes align with UsersList/UserTable/UserDrawer expectations

const LS_KEY = "ballie_admin_users";

function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

function seed() {
  const base = [
    {
      _id: "U001",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "admin",
      status: "active",
      premium: true,
      language: "en",
      notes: "Team lead",
      createdAt: "2024-01-12T10:20:00Z",
    },
    {
      _id: "U002",
      name: "Brian Chen",
      email: "brian.chen@example.com",
      role: "business",
      status: "active",
      premium: false,
      language: "en",
      notes: "",
      createdAt: "2024-02-03T09:10:00Z",
    },
    {
      _id: "U003",
      name: "Carla Mendes",
      email: "carla.mendes@example.com",
      role: "fan",
      status: "suspended",
      premium: false,
      language: "pt",
      notes: "Chargeback in May",
      createdAt: "2024-02-17T14:00:00Z",
    },
    {
      _id: "U004",
      name: "Diego Martínez",
      email: "diego.martinez@example.com",
      role: "fan",
      status: "active",
      premium: true,
      language: "es",
      notes: "VIP",
      createdAt: "2024-03-29T16:45:00Z",
    },
    {
      _id: "U005",
      name: "Elena Petrova",
      email: "elena.petrova@example.com",
      role: "business",
      status: "active",
      premium: true,
      language: "ru",
      notes: "",
      createdAt: "2024-04-08T08:30:00Z",
    },
    {
      _id: "U006",
      name: "Farhan Ali",
      email: "farhan.ali@example.com",
      role: "fan",
      status: "active",
      premium: false,
      language: "ur",
      notes: "",
      createdAt: "2024-04-21T12:05:00Z",
    },
    {
      _id: "U007",
      name: "Grace Lee",
      email: "grace.lee@example.com",
      role: "admin",
      status: "active",
      premium: true,
      language: "en",
      notes: "Security champion",
      createdAt: "2024-05-10T10:00:00Z",
    },
    {
      _id: "U008",
      name: "Hiro Tanaka",
      email: "hiro.tanaka@example.com",
      role: "business",
      status: "active",
      premium: false,
      language: "ja",
      notes: "",
      createdAt: "2024-06-01T09:10:00Z",
    },
    {
      _id: "U009",
      name: "Isabella Rossi",
      email: "isabella.rossi@example.com",
      role: "fan",
      status: "active",
      premium: true,
      language: "it",
      notes: "",
      createdAt: "2024-07-15T11:20:00Z",
    },
    {
      _id: "U010",
      name: "Jamal Brown",
      email: "jamal.brown@example.com",
      role: "fan",
      status: "suspended",
      premium: false,
      language: "en",
      notes: "",
      createdAt: "2024-08-04T15:40:00Z",
    },
    {
      _id: "U011",
      name: "Klara Novak",
      email: "klara.novak@example.com",
      role: "business",
      status: "active",
      premium: false,
      language: "cs",
      notes: "",
      createdAt: "2024-08-22T10:10:00Z",
    },
    {
      _id: "U012",
      name: "Liam O'Connor",
      email: "liam.oconnor@example.com",
      role: "moderator", // kept for variety; normalized later to business
      status: "active",
      premium: true,
      language: "en",
      notes: "",
      createdAt: "2024-09-10T13:15:00Z",
    },
  ];
  // Normalize any non-conforming roles to supported set
  return base.map((u) => ({
    ...u,
    role: ["fan", "business", "admin"].includes(u.role) ? u.role : "business",
  }));
}

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seed();
    return parsed;
  } catch {
    return seed();
  }
}

function save(rows) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(rows));
  } catch {
    // ignore
  }
}

let db = load();

export async function listUsers(params = {}) {
  const { page = 1, limit = 10, q = "", role = "", status = "" } = params;
  let rows = [...db];

  // Filter by search
  const query = String(q).trim().toLowerCase();
  if (query) {
    rows = rows.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
  }
  // Filter by role/status
  if (role) rows = rows.filter((u) => u.role === role);
  if (status) rows = rows.filter((u) => u.status === status);

  // Sort by created desc
  rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = rows.length;
  const start = Math.max(0, (page - 1) * limit);
  const items = rows.slice(start, start + limit);
  return { items, total };
}

export async function createUser(model) {
  const now = new Date().toISOString();
  const doc = {
    _id: uid(),
    name: model.name?.trim() || "Unnamed",
    email: model.email?.trim() || "",
    role: model.role || "fan",
    status: model.status || "active",
    premium: !!model.premium,
    language: model.language || "en",
    notes: model.notes || "",
    createdAt: now,
  };
  db.unshift(doc);
  save(db);
  return doc;
}

export async function updateUser(id, model) {
  const idx = db.findIndex((u) => u._id === id);
  if (idx === -1) throw new Error("User not found");
  db[idx] = {
    ...db[idx],
    ...model,
  };
  save(db);
  return db[idx];
}

export async function deleteUser(id) {
  const before = db.length;
  db = db.filter((u) => u._id !== id);
  if (db.length === before) throw new Error("User not found");
  save(db);
  return { ok: true };
}

export async function getUserById(id) {
  return db.find((u) => u._id === id) || null;
}

const UsersService = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
};

export default UsersService;
