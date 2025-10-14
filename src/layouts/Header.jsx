import React, { useEffect, useMemo, useRef, useState } from "react";
import { Logo as AppLogo } from "../assets";
import {
  MdMenu,
  MdSearch,
  MdNotificationsNone,
  MdSettings,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Header({
  title = "Admin",
  // Default to centralized asset export; can still be overridden via prop
  logoSrc = AppLogo,
  avatarSrc = AppLogo,
  notifications = 0,
  notificationItems = null,
  onMenuClick,
  onSettingsClick,
  onProfileClick,
  onSearch,
}) {
  const [q, setQ] = useState("");
  const [openNotif, setOpenNotif] = useState(false);
  const [openMobileSearch, setOpenMobileSearch] = useState(false);
  const notifWrapRef = useRef(null);
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (Array.isArray(notificationItems)) return notificationItems;
    const count = Number(notifications) || 0;
    if (count <= 0) return [];
    return Array.from({ length: Math.min(count, 8) }).map((_, i) => ({
      id: `auto-${i}`,
      title: `You have a new update #${i + 1}`,
      time: i === 0 ? "Just now" : `${i * 5}m ago`,
    }));
  }, [notificationItems, notifications]);

  const unreadCount = notifications || items.length || 0;

  function submit(e) {
    e.preventDefault();
    onSearch?.(q.trim());
  }

  function toggleNotifications() {
    setOpenNotif((v) => !v);
  }

  function goSettings() {
    onSettingsClick?.();
    navigate("/settings");
  }

  // Close notifications on outside click or Escape
  useEffect(() => {
    function onDocClick(e) {
      if (!openNotif) return;
      if (notifWrapRef.current && !notifWrapRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setOpenNotif(false);
        setOpenMobileSearch(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openNotif]);

  return (
    <header className="sticky top-0 z-30 w-full">
      {/* full-width header: use w-full and max-w-full so the header stretches across the viewport */}
      <div className="glass h-16 w-full max-w-full flex items-center gap-3 px-3 sm:px-5 relative">
        {/* Left */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            className="lg:hidden -ml-1 p-2 rounded-md hover:bg-primary/10"
            onClick={onMenuClick}
            aria-label="Open sidebar"
          >
            <MdMenu className="h-5 w-5 text-muted" />
          </button>
          {/* Compact logo on mobile */}
          <img
            src={logoSrc}
            alt="Logo"
            className="h-7 w-7 rounded-lg sm:hidden"
          />
          <div className="hidden sm:flex items-center gap-2">
            <img src={logoSrc} alt="Logo" className="h-7 w-7 rounded-lg" />
            <div className="text-sm text-muted">Welcome back,</div>
            <div className="text-sm font-semibold">{title}</div>
          </div>

          {/* Search */}
          <form
            onSubmit={submit}
            className="hidden md:flex items-center flex-1"
          >
            {/* increased max width and input height for more prominent search */}
            <div className="relative w-full max-w-6xl">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search users, subscribers, orders, posts…"
                className="input h-11 pl-12 pr-36"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button type="submit" className="btn h-10 px-5">
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-1">
          {/* Mobile search trigger */}
          <button
            type="button"
            onClick={() => setOpenMobileSearch((v) => !v)}
            className="p-2.5 rounded-full hover:bg-primary/10 md:hidden"
            aria-label="Search"
            aria-expanded={openMobileSearch}
          >
            <MdSearch className="h-5 w-5 text-muted" />
          </button>
          <div className="relative" ref={notifWrapRef}>
            <button
              type="button"
              onClick={toggleNotifications}
              className="relative p-2.5 rounded-full hover:bg-primary/10"
              aria-label="Notifications"
              aria-haspopup="menu"
              aria-expanded={openNotif}
            >
              <MdNotificationsNone className="h-5 w-5 text-muted" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger text-white text-[10px] px-1">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {openNotif && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-1rem)] glass bg-bg-soft/95 border border-border rounded-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border">
                  <div className="text-sm font-semibold">Notifications</div>
                  <div className="text-xs text-muted">
                    {items.length > 0
                      ? `You have ${unreadCount} new notifications`
                      : "You're all caught up"}
                  </div>
                </div>
                <ul className="max-h-80 overflow-auto">
                  {items.length === 0 && (
                    <li className="px-4 py-6 text-sm text-muted">
                      No new notifications
                    </li>
                  )}
                  {items.map((n) => (
                    <li
                      key={n.id}
                      className="px-4 py-3 hover:bg-primary/10 transition"
                    >
                      <div className="text-sm">{n.title}</div>
                      {n.time && (
                        <div className="text-xs text-muted">{n.time}</div>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2 border-t border-border bg-bg-soft text-right">
                  <button
                    className="text-xs font-medium text-muted hover:text-text"
                    onClick={() => setOpenNotif(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={goSettings}
            className="p-2.5 rounded-full hover:bg-primary/10"
            aria-label="Settings"
          >
            <MdSettings className="h-5 w-5 text-muted" />
          </button>

          <button
            onClick={onProfileClick}
            className="shrink-0 rounded-full overflow-hidden h-9 w-9 border border-border"
          >
            <img
              src={avatarSrc}
              alt="User avatar"
              className="h-full w-full object-cover"
              onError={(e) => {
                if (e.currentTarget.src !== logoSrc)
                  e.currentTarget.src = logoSrc;
              }}
            />
          </button>
        </div>

        {/* Mobile search panel */}
        {openMobileSearch && (
          <div className="absolute left-0 right-0 top-full sm:hidden px-3 pb-3">
            <form
              onSubmit={(e) => {
                submit(e);
                setOpenMobileSearch(false);
              }}
              className="glass p-2 flex items-center gap-2"
            >
              <div className="relative flex-1">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search users, subscribers, orders, posts"
                  className="input h-11 pl-10"
                />
              </div>
              <button
                type="button"
                className="btn-ghost h-11"
                onClick={() => setOpenMobileSearch(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn h-11 px-4">
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
