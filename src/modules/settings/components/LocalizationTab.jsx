import React, { useEffect, useState } from "react";

export default function LocalizationTab({ initial, onSave, saving }) {
  const [m, setM] = useState({ defaultLang: "en", supported: ["en", "nl"] });
  const [text, setText] = useState("en, nl");

  useEffect(() => {
    const sup = Array.isArray(initial?.supported) ? initial.supported : ["en"];
    setM({ defaultLang: initial?.defaultLang || "en", supported: sup });
    setText(sup.join(", "));
  }, [initial]);

  useEffect(() => {
    const arr = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setM((cur) => ({ ...cur, supported: arr }));
  }, [text]);

  function submit(e) {
    e.preventDefault();
    onSave?.(m);
  }

  return (
    <form onSubmit={submit} aria-busy={saving ? "true" : "false"} className="card space-y-4 max-w-3xl mx-auto">
      <label className="block" htmlFor="defaultLang">
        <span className="text-sm text-muted">Default language</span>
        <select
          id="defaultLang"
          name="defaultLang"
          className="input mt-1"
          value={m.defaultLang}
          onChange={(e) => setM({ ...m, defaultLang: e.target.value })}
        >
          {m.supported.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </label>

      <label className="block" htmlFor="supportedLangs">
        <span className="text-sm text-muted">
          Supported languages (comma separated)
        </span>
        <input
          id="supportedLangs"
          name="supportedLangs"
          className="input mt-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="en, nl, de"
          autoCapitalize="off"
          autoCorrect="off"
        />
      </label>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <button className="btn w-full sm:w-auto" disabled={saving} aria-disabled={saving ? "true" : "false"}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
