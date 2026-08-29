"use client";

import { useEffect, useMemo, useState } from "react";
import { getNextShowStart, resolveShowPhase, formatShowTimeLabel } from "@/lib/timezone";
import { cn } from "@/lib/utils";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function Countdown({
  timezone,
  showTime,
  durationMinutes,
  override,
  className,
}: {
  timezone: string;
  showTime: string;
  durationMinutes: number;
  override?: string;
  className?: string;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const start = useMemo(
    () =>
      getNextShowStart(now, {
        timezone,
        showTime,
        durationMinutes,
      }),
    [now, timezone, showTime, durationMinutes]
  );

  const phase = resolveShowPhase(now, start, durationMinutes, override);

  if (phase === "live") {
    return (
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-white/15 bg-transparent px-5 py-6 text-center backdrop-blur-xl",
          className
        )}
      >
        <p className="flex items-center justify-center gap-2 text-sm font-medium text-white">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
          </span>
          🔴 WE&apos;RE LIVE NOW
        </p>
      </div>
    );
  }

  const diff = Math.max(0, start.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  const units = [
    { label: "Days", value: pad(days) },
    { label: "Hours", value: pad(hours) },
    { label: "Minutes", value: pad(minutes) },
    { label: "Seconds", value: pad(seconds) },
  ];

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-white/15 bg-transparent px-3 py-5 backdrop-blur-xl sm:px-4 sm:py-6",
        className
      )}
      aria-live="polite"
      aria-label="Countdown to next live show"
    >
      <p className="text-center text-sm font-medium text-white">
        Next Live: Saturday at {formatShowTimeLabel(showTime, timezone)}
      </p>
      <div className="mt-4 grid grid-cols-4">
        {units.map((unit, index) => (
          <div
            key={unit.label}
            className={cn(
              "px-1 text-center sm:px-2",
              index > 0 && "border-l border-white/10"
            )}
          >
            <div className="font-display text-2xl font-semibold tabular-nums tracking-tight text-[#FF4D6D] sm:text-[2rem] sm:leading-none">
              {unit.value}
            </div>
            <div className="mt-2 text-[11px] font-medium text-white sm:text-sm">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShowStatusBadge({
  timezone,
  showTime,
  durationMinutes,
  override,
}: {
  timezone: string;
  showTime: string;
  durationMinutes: number;
  override?: string;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const start = getNextShowStart(now, { timezone, showTime, durationMinutes });
  const phase = resolveShowPhase(now, start, durationMinutes, override);

  if (phase === "live") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
        <span className="size-1.5 rounded-full bg-red-500" />
        🔴 WE&apos;RE LIVE NOW
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
      Next Live: Saturday at {formatShowTimeLabel(showTime, timezone)}
    </span>
  );
}
