import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
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

const StatCard = ({ title, value, tone = "primary" }) => {
  const toneCls =
    tone === "success"
      ? "text-brand-success bg-emerald-50 border-emerald-200"
      : tone === "error"
      ? "text-brand-error bg-red-50 border-red-200"
      : tone === "warning"
      ? "text-brand-secondary bg-amber-50 border-amber-200"
      : "text-brand-primary bg-blue-50 border-blue-200";

  return (
    <div className={["rounded-xl border px-4 py-4", toneCls].join(" ")}>
      <div className="text-xs font-extrabold uppercase tracking-wide opacity-80">{title}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
    </div>
  );
};

// PUBLIC_INTERFACE
export function Reports() {
  /** Generate Report: mocked report generation + view report cards with counts. */
  const { push } = useToast();

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showReport, setShowReport] = useState(false);

  const [counts, setCounts] = useState({
    total: 0,
    pass: 0,
    failed: 0,
    error: 0,
  });

  const cleanupRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  const canView = useMemo(() => counts.total > 0, [counts.total]);

  const onGenerate = () => {
    if (running) return;
    setRunning(true);
    setProgress(0);
    setShowReport(false);

    if (cleanupRef.current) cleanupRef.current();
    cleanupRef.current = runProgress({
      durationMs: 2600,
      onTick: setProgress,
      onDone: () => {
        setRunning(false);
        setProgress(100);

        // Update mock numbers in state
        const mock = { total: 12, pass: 10, failed: 1, error: 1 };
        setCounts(mock);

        push({ title: "Generate Report completed", variant: "success" });
      },
    });
  };

  const onView = () => {
    if (!canView) {
      push({
        title: "No report available",
        message: "Click 'Generate Report' first.",
        variant: "warning",
      });
      return;
    }
    setShowReport(true);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <h1 className="text-lg font-extrabold text-brand-text">Generate Report</h1>
        <p className="text-sm text-gray-700 mt-1">
          Mock report generation and view high-level execution statistics.
        </p>
      </div>

      <Card title="Actions" subtitle="Generate and view a mocked report">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" onClick={onGenerate} disabled={running}>
            {running ? "Generating..." : "Generate Report"}
          </Button>
          <Button variant="ghost" onClick={onView} disabled={running}>
            View Report
          </Button>
        </div>

        <div className="mt-4 max-w-2xl">
          <ProgressBar value={progress} label={running ? "Generating report…" : "Progress"} />
        </div>

        {showReport && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard title="Total Test Cases" value={counts.total} tone="primary" />
            <StatCard title="Pass" value={counts.pass} tone="success" />
            <StatCard title="Failed" value={counts.failed} tone="error" />
            <StatCard title="Error" value={counts.error} tone="warning" />
          </div>
        )}
      </Card>
    </div>
  );
}
