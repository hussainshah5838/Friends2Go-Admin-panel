import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ ["--sidebar-w"]: "16rem" }}
      className="min-h-screen grid grid-cols-1 lg:grid-cols-[var(--sidebar-w)_1fr] bg-gradient-brand"
    >
      {/* Sidebar */}
      <Sidebar isOpen={open} setIsOpen={setOpen} />

      {/* Main */}
      <main className="p-3 sm:p-4 lg:p-6">
        <Header
          title="Admin"
          avatarSrc="https://randomuser.me/api/portraits/men/75.jpg"
          notifications={3}
          onMenuClick={() => setOpen(true)}
        />

        <div className="grid gap-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
