import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
import { Modal } from "../components/Modal";
import { useToast } from "../context/ToastContext";

const runProgress = ({ durationMs = 2400, onTick, onDone }) => {
  const start = Date.now();
  const tickMs = 80;

  const id = window.setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
    onTick(pct);
    if (pct >= 100) {
      window.clearInterval(id);
      onDone?.();
    }
  }, tickMs);

  return () => window.clearInterval(id);
};

const seedMockCases = ({ preConditionText }) => {
  const pc = preConditionText || "User is logged in and has access to the application.";
  return [
    {
      id: "TC-001",
      title: "Login with valid credentials",
      preCondition: pc,
      steps: "Navigate to Login page; Enter valid email/password; Click Sign in",
      expected: "User is redirected to Home page",
      priority: "High",
    },
    {
      id: "TC-002",
      title: "Upload selected file",
      preCondition: pc,
      steps: "Browse a file; Click Upload",
      expected: "Success message 'File uploaded' is shown",
      priority: "Medium",
    },
    {
      id: "TC-003",
      title: "Generate report after execution",
      preCondition: pc,
      steps: "Go to Reports; Click Generate Report; Click View Report",
      expected: "Report cards show counts for Total/Pass/Failed/Error",
      priority: "Low",
    },
  ];
};

/* PUBLIC_INTERFACE */
export function GenerateTestCases() {
  /** Generate Test Cases: generation with progress, view table, and editable Pre-Condition (in-memory). */
  const { push } = useToast();

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const [generated, setGenerated] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [preConditionText, setPreConditionText] = useState(
    "User is authenticated and has access to the dashboard."
  );
  const [preCondDraft, setPreCondDraft] = useState(preConditionText);
  const [preCondOpen, setPreCondOpen] = useState(false);

  const cleanupRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  const hasCases = useMemo(() => generated.length > 0, [generated]);

  const onGenerate = () => {
    if (running) return;
    setRunning(true);
    setProgress(0);
    setShowTable(false);

    if (cleanupRef.current) cleanupRef.current();
    cleanupRef.current = runProgress({
      durationMs: 2600,
      onTick: setProgress,
      onDone: () => {
        setRunning(false);
        setProgress(100);

        const next = seedMockCases({ preConditionText });
        setGenerated(next);

        push({ title: "Generate Test Cases completed", message: `${next.length} cases created.`, variant: "success" });
      },
    });
  };

  const onView = () => {
    if (!hasCases) {
      push({
        title: "No generated test cases",
        message: "Click 'Generate Test Cases' first.",
        variant: "warning",
      });
      return;
    }
    setShowTable(true);
  };

  const onOpenPreCond = () => {
    setPreCondDraft(preConditionText);
    setPreCondOpen(true);
  };

  const onSavePreCond = () => {
    setPreConditionText(preCondDraft);
    setPreCondOpen(false);
    push({ title: "Pre-Condition saved", variant: "success" });

    // If cases already exist, update them to reflect latest precondition (still in-memory)
    setGenerated((prev) =>
      prev.map((tc) => ({
        ...tc,
        preCondition: preCondDraft,
      }))
    );
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <h1 className="text-lg font-extrabold text-brand-text">Generate Test Cases</h1>
        <p className="text-sm text-gray-700 mt-1">
          Generate structured test cases from refined requirements.
        </p>
      </div>

      <Card title="Actions" subtitle="Generate, view, and set pre-conditions for test cases">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" onClick={onGenerate} disabled={running}>
            {running ? "Generating..." : "Generate Test Cases"}
          </Button>
          <Button variant="ghost" onClick={onView} disabled={running}>
            View Generated Test Cases
          </Button>
          <Button variant="ghost" onClick={onOpenPreCond} disabled={running}>
            Pre-Condition
          </Button>
        </div>

        <div className="mt-4 max-w-2xl">
          <ProgressBar value={progress} label={running ? "Generating test cases…" : "Progress"} />
        </div>

        <div className="mt-4 text-sm text-gray-700">
          <span className="font-semibold">Current Pre-Condition:</span>{" "}
          <span className="font-mono text-xs">{preConditionText}</span>
        </div>

        {showTable && (
          <div className="mt-5 overflow-x-auto rounded-xl border border-gray-100 bg-white">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-gray-50 text-xs font-extrabold text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Pre-Condition</th>
                  <th className="text-left px-4 py-3">Steps</th>
                  <th className="text-left px-4 py-3">Expected Result</th>
                  <th className="text-left px-4 py-3">Priority</th>
                </tr>
              </thead>
              <tbody>
                {generated.map((tc) => (
                  <tr key={tc.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-semibold text-brand-text">{tc.id}</td>
                    <td className="px-4 py-3 text-gray-700">{tc.title}</td>
                    <td className="px-4 py-3 text-gray-700">{tc.preCondition}</td>
                    <td className="px-4 py-3 text-gray-700">{tc.steps}</td>
                    <td className="px-4 py-3 text-gray-700">{tc.expected}</td>
                    <td className="px-4 py-3 text-gray-700">{tc.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={preCondOpen}
        title="Pre-Condition"
        onClose={() => setPreCondOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setPreCondOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={onSavePreCond}>
              Save
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          <div className="text-sm text-gray-700">
            Enter pre-conditions. This is stored in memory only and will affect subsequent generated test cases.
          </div>
          <textarea
            className="w-full min-h-[160px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-900/10"
            value={preCondDraft}
            onChange={(e) => setPreCondDraft(e.target.value)}
            placeholder="e.g., User is logged in, project is selected, and required permissions are granted."
          />
        </div>
      </Modal>
    </div>
  );
}
