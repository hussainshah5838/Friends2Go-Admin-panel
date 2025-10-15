import React, { useEffect, useState } from "react";

export default function NotificationsTab({ initial, onSave, saving }) {
  const [m, setM] = useState({
    emailEnabled: false,
    pushEnabled: true,
    digest: "daily",
  });

  useEffect(() => {
    setM({
      emailEnabled: !!initial?.emailEnabled,
      pushEnabled: !!initial?.pushEnabled,
      digest: initial?.digest || "daily",
    });
  }, [initial]);

  function submit(e) {
    e.preventDefault();
    onSave?.(m);
  }

  return (
    <form onSubmit={submit} aria-busy={saving ? "true" : "false"} className="card space-y-4 max-w-3xl mx-auto">
      <label className="flex items-center gap-2" htmlFor="emailEnabled">
        <input
          id="emailEnabled"
          name="emailEnabled"
          type="checkbox"
          checked={m.emailEnabled}
          onChange={(e) => setM({ ...m, emailEnabled: e.target.checked })}
        />
        <span>Email notifications</span>
      </label>
      <label className="flex items-center gap-2" htmlFor="pushEnabled">
        <input
          id="pushEnabled"
          name="pushEnabled"
          type="checkbox"
          checked={m.pushEnabled}
          onChange={(e) => setM({ ...m, pushEnabled: e.target.checked })}
        />
        <span>Push notifications</span>
      </label>
      <label className="block" htmlFor="digest">
        <span className="text-sm text-muted">Digest frequency</span>
        <select
          id="digest"
          name="digest"
          className="input mt-1"
          value={m.digest}
          onChange={(e) => setM({ ...m, digest: e.target.value })}
        >
          <option value="immediate">Immediate</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </label>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <button className="btn w-full sm:w-auto" disabled={saving} aria-disabled={saving ? "true" : "false"}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
