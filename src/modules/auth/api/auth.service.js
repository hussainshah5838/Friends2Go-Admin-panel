// Toggle mock via VITE_USE_MOCK=1; or auto‑mock when no VITE_API_URL is set
import axios from "axios";

const ENV = import.meta?.env || {};
const USE_MOCK = ENV.VITE_USE_MOCK === "1" || !ENV.VITE_API_URL;
const api = axios.create({
  baseURL: ENV.VITE_API_URL || "/api",
  withCredentials: true,
});

function persistSession({ token, user }) {
  // adapt to your RequireAuth guard (uses localStorage in your app)
  localStorage.setItem("ballie_token", token);
  localStorage.setItem("ballie_user", JSON.stringify(user || {}));
}

const MOCK_USER = {
  id: "u_admin",
  name: "Admin Jess",
  email: "admin@ballie.app",
  role: "admin",
  avatar: "https://i.pravatar.cc/160?img=12",
};

export async function loginWithEmail(email, password) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    // naive mock check
    const ok = !!email && !!password && password.length >= 3;
    if (!ok) throw new Error("Invalid email or password");
    const token = "mock_token_" + Math.random().toString(36).slice(2);
    persistSession({ token, user: { ...MOCK_USER, email } });
    return { token, user: { ...MOCK_USER, email } };
  }
  const res = await api.post("/auth/login", { email, password });
  persistSession(res.data);
  return res.data;
}

export async function loginWithOAuth(provider) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    const token =
      "mock_oauth_" + provider + "_" + Math.random().toString(36).slice(2);
    persistSession({ token, user: MOCK_USER });
    return { token, user: MOCK_USER };
  }
  // usually you’ll redirect to provider or open a popup; here we assume a POST returns token
  const res = await api.post(`/auth/oauth/${provider}`);
  persistSession(res.data);
  return res.data;
}

export async function requestPasswordReset(email) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return { ok: true };
  }
  const res = await api.post("/auth/forgot", { email });
  return res.data;
}

export function logout() {
  localStorage.removeItem("ballie_token");
  localStorage.removeItem("ballie_user");
  sessionStorage.clear();
  return { ok: true };
}
