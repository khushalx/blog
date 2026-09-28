"use client";
import { useState } from "react";
import type { ResearchMeta } from "@/lib/content";
import { sectors } from "@/lib/site";
import { ResearchEntry } from "./research-entry";
export function ResearchLibrary({ entries }: { entries: ResearchMeta[] }) {
  const [sector, setSector] = useState("All");
  const shown = entries.filter(
    (entry) => sector === "All" || entry.sector === sector,
  );
  return (
    <>
      <div className="filter-bar" aria-label="Filter research by sector">
        {["All", ...sectors].map((item) => (
          <button
            key={item}
            onClick={() => setSector(item)}
            aria-pressed={sector === item}
          >
            {item}
            {item === "All" && <span>{entries.length}</span>}
          </button>
        ))}
      </div>
      <div className="library-count" aria-live="polite">
        {shown.length} {shown.length === 1 ? "research note" : "research notes"}
        <span>NEWEST FIRST</span>
      </div>
      <div>
        {shown.map((entry, index) => (
          <ResearchEntry key={entry.slug} entry={entry} number={index + 1} />
        ))}
        {shown.length === 0 && (
          <div className="empty-state">
            <h2>No {sector.toLowerCase()} notes yet.</h2>
            <p>This part of the research library is still taking shape.</p>
            <button className="text-link" onClick={() => setSector("All")}>
              Browse all research →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
