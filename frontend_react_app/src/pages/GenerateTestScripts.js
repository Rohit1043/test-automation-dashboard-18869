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

// PUBLIC_INTERFACE
export function GenerateTestScripts() {
  /** Generate Test Scripts: mocked script generation with progress bar and toast. */
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
        push({ title: "Test script generation completed", variant: "success" });
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-subtle-gradient border border-blue-900/10 px-5 py-4">
        <h1 className="text-lg font-extrabold text-brand-text">Generate Test Scripts</h1>
        <p className="text-sm text-gray-700 mt-1">
          Mock generating automation scripts from test cases (no backend).
        </p>
      </div>

      <Card
        title="Generate scripts"
        subtitle="Simulates generation over ~2–3 seconds."
        actions={
          <Button variant="secondary" onClick={onRun} disabled={running}>
            {running ? "Running..." : "Run Generate Test Script"}
          </Button>
        }
      >
        <ProgressBar value={progress} label={running ? "Generating scripts…" : "Progress"} className="max-w-xl" />
      </Card>
    </div>
  );
}
