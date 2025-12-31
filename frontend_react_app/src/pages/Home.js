import React, { useState } from "react";
import { Card } from "../components/Card";
import { Tabs } from "../components/Tabs";
import { UploadArea } from "../components/UploadArea";
import { FileList } from "../components/FileList";

// PUBLIC_INTERFACE
export function Home() {
  /** Home page: mocked file browsing and drag-and-drop uploads. */
  const [tab, setTab] = useState("browse");

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <h1 className="text-lg font-extrabold text-brand-text">Home</h1>
        <p className="text-sm text-gray-700 mt-1">
          Browse your project files and upload new artifacts (front-end only).
        </p>
      </div>

      <Card
        title="Workspace"
        subtitle="Mocked file/folder structure for preview"
        className="overflow-hidden"
      >
        <Tabs
          tabs={[
            { key: "browse", label: "Browse" },
            { key: "upload", label: "Upload" },
          ]}
          activeKey={tab}
          onChange={setTab}
        />

        <div className="pt-4">
          {tab === "browse" ? (
            <FileList />
          ) : (
            <UploadArea onFilesUploaded={() => {}} />
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

        <Card title="Status" subtitle="Integration readiness">
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex items-center justify-between">
              <span>Backend</span>
              <span className="font-bold text-gray-600">Not connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Uploads</span>
              <span className="font-bold text-brand-success">Mocked</span>
            </div>
            <div className="flex items-center justify-between">
              <span>File browser</span>
              <span className="font-bold text-brand-success">Mocked</span>
            </div>
          </div>
        </Card>

        <Card title="Tips" subtitle="Classic / corporate UI">
          <div className="text-sm text-gray-700 space-y-2">
            <p>Use the left sidebar to navigate core features.</p>
            <p>Configuration is read from <code className="font-mono text-xs">REACT_APP_*</code> env vars with safe defaults.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
