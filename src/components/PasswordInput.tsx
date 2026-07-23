"use client";

import { useState } from "react";

export function PasswordInput({
  value,
  onChange,
  autoComplete,
  required,
  placeholder,
  className,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        className={`${className ?? "input"} pr-16`}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-500 transition hover:text-accent"
      >
        {visible ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}
