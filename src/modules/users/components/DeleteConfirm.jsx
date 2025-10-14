import React from "react";

export default function DeleteConfirm({ open, onClose, onConfirm, name = "this user" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="glass relative w-full max-w-md p-6 space-y-4">
        <h3 className="text-lg font-semibold">Delete user</h3>
        <p className="text-sm text-muted">
          This will permanently remove <span className="text-text font-medium">{name}</span>. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
