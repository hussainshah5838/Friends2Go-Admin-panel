import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { PATHS } from "./paths";

// Lazy page stubs (replace with your real pages)
const Dashboard = lazy(() => import("../modules/dashboard/Dashboard.jsx"));
const UsersList = lazy(() => import("../modules/users/UsersList.jsx"));
const UserDetail = lazy(() => import("../modules/users/UserDetail.jsx"));
const SubscribersList = lazy(() =>
  import("../modules/subscribers/SubscribersList.jsx")
);
const ShopData = lazy(() => import("../modules/shop/ShopData.jsx"));
const BlogData = lazy(() => import("../modules/blog/BlogData.jsx"));
const Settings = lazy(() => import("../modules/settings/Settings.jsx"));
const Login = lazy(() => import("../modules/auth/Login.jsx"));

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
    element: <AdminLayout />,
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
        path: PATHS.SUBSCRIBERS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <SubscribersList />
          </Suspense>
        ),
      },

      {
        path: PATHS.SHOP.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <ShopData />
          </Suspense>
        ),
      },

      {
        path: PATHS.BLOG.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <BlogData />
          </Suspense>
        ),
      },

      {
        path: PATHS.SETTINGS.slice(1),
        element: (
          <Suspense fallback={<Loading />}>
            <Settings />
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
