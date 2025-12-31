import React, { useMemo, useState } from "react";
import { Button } from "./Button";

const MOCK_TREE = [
  { type: "folder", name: "requirements", children: [{ type: "file", name: "login.md", size: 1830 }] },
  {
    type: "folder",
    name: "assets",
    children: [
      { type: "file", name: "wireframes.png", size: 254001 },
      { type: "file", name: "sample.csv", size: 9802 },
    ],
  },
  { type: "file", name: "README.txt", size: 820 },
];

const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-brand-secondary">
    <path
      d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-brand-primary">
    <path
      d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

// PUBLIC_INTERFACE
export function FileList() {
  /** Mocked file/folder browsing list with drill-down and breadcrumb. */
  const [path, setPath] = useState([]); // array of folder names

  const { items, breadcrumb } = useMemo(() => {
    let current = { type: "folder", name: "root", children: MOCK_TREE };
    const bc = [{ label: "Home", path: [] }];

    for (const p of path) {
      const next = (current.children || []).find((c) => c.type === "folder" && c.name === p);
      if (!next) break;
      current = next;
      bc.push({ label: p, path: bc[bc.length - 1].path.concat([p]) });
    }

    return { items: current.children || [], breadcrumb: bc };
  }, [path]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {breadcrumb.map((b, idx) => (
            <button
              key={`${b.label}-${idx}`}
              className="text-sm font-semibold text-brand-primary hover:underline"
              onClick={() => setPath(b.path)}
            >
              {b.label}
            </button>
          ))}
        </div>
        {path.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setPath(path.slice(0, -1))}>
            Up
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-2 bg-gray-50 text-xs font-bold text-gray-600">
          <div className="col-span-7">Name</div>
          <div className="col-span-3">Type</div>
          <div className="col-span-2 text-right">Size</div>
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-6 text-sm text-gray-600">No items</div>
        ) : (
          items.map((it) => (
            <button
              key={it.name}
              className="w-full grid grid-cols-12 px-4 py-3 border-t border-gray-100 text-left hover:bg-gray-50 transition"
              onClick={() => {
                if (it.type === "folder") setPath((p) => [...p, it.name]);
              }}
            >
              <div className="col-span-7 flex items-center gap-3 min-w-0">
                {it.type === "folder" ? <FolderIcon /> : <FileIcon />}
                <div className="text-sm font-semibold text-brand-text truncate">
                  {it.name}
                </div>
              </div>
              <div className="col-span-3 text-sm text-gray-600 capitalize">{it.type}</div>
              <div className="col-span-2 text-sm text-gray-600 text-right">
                {it.type === "file" ? formatBytes(it.size) : "-"}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
