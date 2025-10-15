import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Tabs from "./components/Tabs";
const GeneralTab = React.lazy(() => import("./components/GeneralTab"));
const NotificationsTab = React.lazy(() => import("./components/NotificationsTab"));
const AppearanceTab = React.lazy(() => import("./components/AppearanceTab"));
const LocalizationTab = React.lazy(() => import("./components/LocalizationTab"));
const IntegrationsTab = React.lazy(() => import("./components/integrations/IntegrationsTab"));
const RolesTab = React.lazy(() => import("./components/roles/RolesTab"));

import {
  fetchAllSettings,
  saveGeneral,
  saveNotifications,
  saveAppearance,
  saveLocalization,
} from "./api/settings.service";

const TAB_ITEMS_STATIC = [
  { value: "general", label: "General" },
  { value: "notifications", label: "Notifications" },
  { value: "appearance", label: "Appearance" },
  { value: "localization", label: "Localization" },
  { value: "integrations", label: "Integrations" },
  { value: "roles", label: "Roles & Permissions" },
];

export default function Settings() {
  const [tab, setTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [general, setGeneral] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [appearance, setAppearance] = useState(null);
  const [localization, setLocalization] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await fetchAllSettings();
      setGeneral(all.general);
      setNotifications(all.notifications);
      setAppearance(all.appearance);
      setLocalization(all.localization);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const withSaving = useCallback(async (fn) => {
    setSaving(true);
    try {
      await fn();
    } finally {
      setSaving(false);
    }
  }, []);

  const TAB_ITEMS = useMemo(() => TAB_ITEMS_STATIC, []);

  return (
    <section
      aria-labelledby="settings-heading"
      aria-busy={loading ? "true" : "false"}
      className="space-y-5 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-0"
    >
      {/* Header: title + tabs. Tabs take a full row on mobile, sit inline on wide screens. */}
      <div className="flex flex-col gap-3 min-w-0">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <h1 id="settings-heading" className="text-lg sm:text-xl font-semibold truncate">
            Settings
          </h1>
        </div>
        <Tabs value={tab} onChange={setTab} items={TAB_ITEMS} />
      </div>

      {loading && (
        <div className="card animate-pulse text-muted max-w-3xl mx-auto min-h-20 grid place-items-center" role="status" aria-live="polite">
          Loading settings…
        </div>
      )}

      {!loading && tab === "general" && (
        <section id="panel-general" role="tabpanel" aria-labelledby="tab-general">
          <Suspense fallback={<div className="card max-w-3xl mx-auto min-h-24 grid place-items-center">Loading…</div>}>
            <GeneralTab
              initial={general}
              saving={saving}
              onSave={(m) =>
                withSaving(async () => {
                  const res = await saveGeneral(m);
                  setGeneral(res);
                })
              }
            />
          </Suspense>
        </section>
      )}

      {!loading && tab === "notifications" && (
        <section id="panel-notifications" role="tabpanel" aria-labelledby="tab-notifications">
          <Suspense fallback={<div className="card max-w-3xl mx-auto min-h-24 grid place-items-center">Loading…</div>}>
            <NotificationsTab
              initial={notifications}
              saving={saving}
              onSave={(m) =>
                withSaving(async () => {
                  const res = await saveNotifications(m);
                  setNotifications(res);
                })
              }
            />
          </Suspense>
        </section>
      )}

      {!loading && tab === "appearance" && (
        <section id="panel-appearance" role="tabpanel" aria-labelledby="tab-appearance">
          <Suspense fallback={<div className="card max-w-3xl mx-auto min-h-24 grid place-items-center">Loading…</div>}>
            <AppearanceTab
              initial={appearance}
              saving={saving}
              onSave={(m) =>
                withSaving(async () => {
                  const res = await saveAppearance(m);
                  setAppearance(res);
                })
              }
            />
          </Suspense>
        </section>
      )}

      {!loading && tab === "localization" && (
        <section id="panel-localization" role="tabpanel" aria-labelledby="tab-localization">
          <Suspense fallback={<div className="card max-w-3xl mx-auto min-h-24 grid place-items-center">Loading…</div>}>
            <LocalizationTab
              initial={localization}
              saving={saving}
              onSave={(m) =>
                withSaving(async () => {
                  const res = await saveLocalization(m);
                  setLocalization(res);
                })
              }
            />
          </Suspense>
        </section>
      )}

      {!loading && tab === "integrations" && (
        <section id="panel-integrations" role="tabpanel" aria-labelledby="tab-integrations">
          <Suspense fallback={<div className="card min-h-24 grid place-items-center">Loading…</div>}>
            <IntegrationsTab />
          </Suspense>
        </section>
      )}

      {!loading && tab === "roles" && (
        <section id="panel-roles" role="tabpanel" aria-labelledby="tab-roles">
          <Suspense fallback={<div className="card min-h-24 grid place-items-center">Loading…</div>}>
            <RolesTab />
          </Suspense>
        </section>
      )}
    </section>
  );
}
