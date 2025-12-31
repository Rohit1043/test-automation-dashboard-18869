import React, { useMemo, useRef, useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useToast } from "../context/ToastContext";

// PUBLIC_INTERFACE
export function Home() {
  /** Home page: browse file/folder, show selected path/name (non-persistent), drag-and-drop, and mocked upload. */
  const { push } = useToast();

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const [selectedLabel, setSelectedLabel] = useState(""); // must not persist across refresh
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const canUpload = useMemo(() => Boolean(selectedLabel), [selectedLabel]);

  const onSelectFiles = (files, kind) => {
    if (!files || files.length === 0) return;

    // Single selection is fine; for folder input, browser may return multiple files.
    const first = files[0];

    // Some browsers provide webkitRelativePath when selecting directories.
    const relative = first.webkitRelativePath || "";
    const label =
      kind === "folder"
        ? (relative ? relative.split("/")[0] : first.name)
        : first.name;

    setSelectedLabel(label);
    setSelectedFile(first);
  };

  const onUpload = () => {
    if (!canUpload) {
      push({
        title: "Nothing to upload",
        message: "Please browse or drop a file/folder first.",
        variant: "warning",
      });
      return;
    }

    // Mocked upload (in-memory only)
    push({
      title: "File uploaded",
      message: selectedLabel,
      variant: "success",
    });

    // Keep selection (user can upload again) — requirement only asks to clear on refresh.
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const dt = e.dataTransfer;
    const files = dt?.files;

    if (!files || files.length === 0) {
      push({ title: "Drop failed", message: "No files were detected.", variant: "warning" });
      return;
    }

    // If folder drop yields many files, try to infer folder name via webkitRelativePath.
    const first = files[0];
    const rel = first.webkitRelativePath || "";
    const label = rel ? rel.split("/")[0] : first.name;

    setSelectedLabel(label);
    setSelectedFile(first);
    push({ title: "Selected", message: label, variant: "info" });
  };

  return (
    <div className="space-y-5">
      {/* Top bar exists globally; this header is the page hero/rectangle area per existing style */}
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-extrabold text-brand-text">Home</h1>
            <p className="text-sm text-gray-700 mt-1">
              Browse a file/folder and simulate uploading it (front-end only).
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-9 h-9 rounded-xl bg-white/70 border border-blue-900/10 flex items-center justify-center">
              <span className="text-base">🏢</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold text-brand-text">Company</div>
              <div className="text-xs text-gray-600">Test Automation Suite</div>
            </div>
          </div>
        </div>
      </div>

      <Card title="Upload workspace assets" subtitle="Browse a folder or file, or drag & drop below.">
        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            onSelectFiles(e.target.files, "file");
            e.target.value = "";
          }}
        />
        <input
          ref={folderInputRef}
          type="file"
          className="hidden"
          // directory selection (Chrome/Edge)
          webkitdirectory="true"
          onChange={(e) => {
            onSelectFiles(e.target.files, "folder");
            e.target.value = "";
          }}
        />

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" onClick={() => folderInputRef.current?.click()}>
            Browse Folder
          </Button>
          <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
            Browse File
          </Button>
        </div>

        <div className="mt-4 flex items-stretch gap-2">
          <Button variant="primary" onClick={onUpload} disabled={!canUpload}>
            Upload
          </Button>
          <input
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-900/10"
            value={selectedLabel}
            readOnly
            placeholder="Selected file/folder will appear here (clears on refresh)"
            aria-label="Selected file or folder"
          />
        </div>

        <div
          className={[
            "mt-4 rounded-xl border-2 border-dashed p-6 transition",
            isDragging ? "border-brand-secondary bg-amber-50" : "border-gray-200 bg-white",
          ].join(" ")}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={onDrop}
        >
          <div className="text-sm font-bold text-brand-text">Drag & drop files/folders here</div>
          <div className="text-sm text-gray-600 mt-1">
            Drop a file (or a folder if your browser supports it). The selection will populate the
            textbox and enable Upload.
          </div>
          {selectedFile && (
            <div className="mt-3 text-xs text-gray-600">
              <span className="font-semibold">Selected:</span>{" "}
              <span className="font-mono">{selectedLabel}</span>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Next steps" subtitle="Typical workflow">
          <ol className="text-sm text-gray-700 list-decimal pl-5 space-y-1">
            <li>Refine requirements into testable acceptance criteria</li>
            <li>Generate test cases</li>
            <li>Generate test scripts</li>
            <li>Execute tests and review reports</li>
          </ol>
        </Card>

        <Card title="Status" subtitle="Mocked interactions">
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex items-center justify-between">
              <span>Selection</span>
              <span className="font-bold text-gray-600">{canUpload ? "Ready" : "None"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Upload</span>
              <span className="font-bold text-brand-success">Mocked</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Persistence</span>
              <span className="font-bold text-gray-600">None (clears on refresh)</span>
            </div>
          </div>
        </Card>

        <Card title="Tip" subtitle="Browser support note">
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              Folder selection uses <code className="font-mono text-xs">webkitdirectory</code>, which
              is supported in Chromium-based browsers.
            </p>
            <p>All actions are mocked locally—no backend calls are made.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
