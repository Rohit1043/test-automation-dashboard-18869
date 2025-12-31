import React, { useMemo, useRef, useState } from "react";
import { Button } from "./Button";
import { useToast } from "../context/ToastContext";

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

const nextId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// PUBLIC_INTERFACE
export function UploadArea({ onFilesUploaded }) {
  /** Drag-and-drop upload component (front-end only, no backend calls). */
  const { push } = useToast();
  const inputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState([]);

  const acceptHint = useMemo(() => "Any file type (mock upload)", []);

  const simulateUpload = (files) => {
    const newItems = Array.from(files).map((file) => ({
      id: nextId(),
      file,
      progress: 0,
      status: "uploading", // uploading | done | error
    }));

    setUploads((prev) => [...newItems, ...prev]);
    push({ title: "Upload started", message: `${newItems.length} file(s) queued.`, variant: "info" });

    // Simulate progress
    newItems.forEach((item) => {
      const interval = window.setInterval(() => {
        setUploads((prev) =>
          prev.map((u) => {
            if (u.id !== item.id) return u;
            const next = Math.min(100, u.progress + 8 + Math.round(Math.random() * 12));
            const done = next >= 100;
            return { ...u, progress: next, status: done ? "done" : "uploading" };
          })
        );
      }, 250);

      window.setTimeout(() => {
        window.clearInterval(interval);
        setUploads((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, progress: 100, status: "done" } : u))
        );
        push({ title: "Upload complete", message: item.file.name, variant: "success" });
        if (onFilesUploaded) onFilesUploaded([item.file]);
      }, 2500 + Math.round(Math.random() * 1500));
    });
  };

  const onPickFiles = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    simulateUpload(files);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    simulateUpload(files);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={onPickFiles}
        className="hidden"
      />

      <div
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
        className={[
          "rounded-xl border-2 border-dashed p-5 transition",
          isDragging ? "border-brand-secondary bg-amber-50" : "border-gray-200 bg-white",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-brand-text">Upload test assets</h3>
            <p className="text-sm text-gray-600 mt-1">
              Drag & drop files here, or choose files to simulate upload progress.
            </p>
            <p className="text-xs text-gray-500 mt-2">{acceptHint}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => inputRef.current?.click()}>
              Choose files
            </Button>
          </div>
        </div>
      </div>

      {uploads.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploads.slice(0, 5).map((u) => (
            <div
              key={u.id}
              className="rounded-lg bg-white border border-gray-100 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-brand-text truncate">
                    {u.file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatBytes(u.file.size)} • {u.status === "done" ? "Completed" : "Uploading..."}
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-700 w-10 text-right">
                  {u.progress}%
                </div>
              </div>
              <div className="h-2 rounded-full bg-gray-100 mt-2 overflow-hidden">
                <div
                  className={[
                    "h-2 rounded-full transition-all",
                    u.status === "done" ? "bg-brand-success" : "bg-brand-primary",
                  ].join(" ")}
                  style={{ width: `${u.progress}%` }}
                />
              </div>
            </div>
          ))}
          {uploads.length > 5 && (
            <div className="text-xs text-gray-500">+ {uploads.length - 5} more</div>
          )}
        </div>
      )}
    </div>
  );
}
