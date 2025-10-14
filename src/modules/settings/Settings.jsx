import React, { useEffect, useState } from "react";
import Tabs from "./components/Tabs";
import GeneralTab from "./components/GeneralTab";
import NotificationsTab from "./components/NotificationsTab";
import AppearanceTab from "./components/AppearanceTab";
import LocalizationTab from "./components/LocalizationTab";
import IntegrationsTab from "./components/integrations/IntegrationsTab";
import RolesTab from "./components/roles/RolesTab";

import {
  fetchAllSettings,
  saveGeneral,
  saveNotifications,
  saveAppearance,
  saveLocalization,
} from "./api/settings.service";

const TAB_ITEMS = [
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

  async function load() {
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
  }

  useEffect(() => {
    load();
  }, []);

  async function withSaving(fn) {
    setSaving(true);
    try {
      await fn();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-lg font-semibold">Settings</h1>
        <Tabs value={tab} onChange={setTab} items={TAB_ITEMS} />
      </div>

      {loading && (
        <div className="card p-6 animate-pulse text-muted">
          Loading settings…
        </div>
      )}

      {!loading && tab === "general" && (
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
      )}

      {!loading && tab === "notifications" && (
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
      )}

      {!loading && tab === "appearance" && (
        <AppearanceTab
          initial={appearance}
          saving={saving}
          onSave={(m) =>
            withSaving(async () => {
              const res = await saveAppearance(m);
              setAppearance(res);
              // optional: reflect theme instantly via CSS vars / provider
            })
          }
        />
      )}

      {!loading && tab === "localization" && (
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
      )}

      {!loading && tab === "integrations" && <IntegrationsTab />}

      {!loading && tab === "roles" && <RolesTab />}
    </div>
  );
}
