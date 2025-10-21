import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { PATHS } from "./paths";

// Lazy page stubs (replace with your real pages)
const Dashboard = lazy(() => import("../modules/dashboard/Dashboard.jsx"));
const UsersList = lazy(() => import("../modules/users/UsersList.jsx"));
const UserDetail = lazy(() => import("../modules/users/UserDetail.jsx"));
const PlansList = lazy(() => import("../modules/plans/PlansList.jsx"));
const SettingsPage = lazy(() => import("../modules/settings/SettingsPage.jsx"));
const Login = lazy(() => import("../modules/auth/Login.jsx"));
const ChatPage = lazy(() => import("/src/modules/chat/ChatPage.jsx"));

const Loading = () => <div className="card p-8 text-muted">Loading…</div>;

const router = createBrowserRouter([
  {
    path: PATHS.AUTH_LOGIN,
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: PATHS.ROOT,
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },

      {
        path: PATHS.USERS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <UsersList />
          </Suspense>
        ),
      },

      {
        path: PATHS.USER_DETAIL.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <UserDetail />
          </Suspense>
        ),
      },

      {
        path: PATHS.PLANS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <PlansList />
          </Suspense>
        ),
      },
      {
        path: PATHS.CHAT.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <ChatPage />
          </Suspense>
        ),
      },

      {
        path: PATHS.SETTINGS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <div className="card p-8">Not Found</div>,
  },
]);

export default router;
