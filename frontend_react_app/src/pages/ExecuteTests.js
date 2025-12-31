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

// PUBLIC_INTERFACE
export function ExecuteTests() {
  /** Execute Test Script: mocked execution with progress, toast, and a small run summary. */
  const { push } = useToast();

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState(null);

  const cleanupRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  const summaryText = useMemo(() => {
    if (!summary) return "";
    return `Executed ${summary.total} tests: ${summary.pass} passed, ${summary.fail} failed, ${summary.error} error. Duration ~${summary.durationSec}s.`;
  }, [summary]);

  const onExecute = () => {
    if (running) return;

    setRunning(true);
    setProgress(0);
    setSummary(null);

    if (cleanupRef.current) cleanupRef.current();
    cleanupRef.current = runProgress({
      durationMs: 2600,
      onTick: setProgress,
      onDone: () => {
        setRunning(false);
        setProgress(100);

        // Optional mocked summary
        const mock = { total: 12, pass: 10, fail: 1, error: 1, durationSec: 7 };
        setSummary(mock);

        push({ title: "Execution completed", variant: "success" });
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <h1 className="text-lg font-extrabold text-brand-text">Execute Test Script</h1>
        <p className="text-sm text-gray-700 mt-1">
          Run a mocked execution and review a brief run summary.
        </p>
      </div>

      <Card
        title="Execution"
        subtitle="Simulates an execution run over ~2–3 seconds."
        actions={
          <Button variant="secondary" onClick={onExecute} disabled={running}>
            {running ? "Executing..." : "Execute Test Script"}
          </Button>
        }
      >
        <ProgressBar
          value={progress}
          label={running ? "Executing tests…" : "Progress"}
          className="max-w-xl"
        />

        {summary && (
          <div className="mt-4 rounded-xl border border-gray-100 bg-white px-4 py-3">
            <div className="text-sm font-extrabold text-brand-text">Run summary</div>
            <div className="text-sm text-gray-700 mt-1">{summaryText}</div>
          </div>
        )}
      </Card>
    </div>
  );
}
