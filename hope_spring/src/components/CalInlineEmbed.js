// src/components/CalInlineEmbed.jsx  (adjust path to match your project)
import React from "react";

export default function CalInlineEmbed({
  className = "w-full min-h-[700px] rounded-2xl border border-slate-200 bg-white"
}) {
  return (
    <iframe
      title="Book a support group session"
      src="https://cal.com/kamutest/newtestevent?embed=1"
      className={className}
      frameBorder="0"
      loading="lazy"
    />
  );
}
