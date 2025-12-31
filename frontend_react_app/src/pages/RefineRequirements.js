import React, { useEffect, useRef, useState } from "react";
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

/* PUBLIC_INTERFACE */
export function RefineRequirements() {
  /** Refine Requirements: run button + progress bar and completion toast. */
  const { push } = useToast();

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const cleanupRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  const onRun = () => {
    if (running) return;
    setRunning(true);
    setProgress(0);

    if (cleanupRef.current) cleanupRef.current();
    cleanupRef.current = runProgress({
      durationMs: 2600,
      onTick: setProgress,
      onDone: () => {
        setRunning(false);
        setProgress(100);
        push({ title: "Refine Requirement completed", variant: "success" });
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <h1 className="text-lg font-extrabold text-brand-text">Refine Requirement</h1>
        <p className="text-sm text-gray-700 mt-1">
          Refine requirements into test-ready acceptance criteria.
        </p>
      </div>

      <Card
        title="Refinement run"
        subtitle="Click run to simulate a 2–3 second refinement process."
        actions={
          <Button variant="secondary" onClick={onRun} disabled={running}>
            {running ? "Running..." : "Run Refined Requirement"}
          </Button>
        }
      >
        <ProgressBar
          value={progress}
          label={running ? "Refining requirement…" : "Progress"}
          className="max-w-xl"
        />

        <div className="mt-4 text-sm text-gray-700">
          This is front-end only. No requirement files are read/written in this view.
        </div>
      </Card>
    </div>
  );
}
