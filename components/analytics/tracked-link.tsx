"use client";

import type { ReactNode } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function TrackedExternalLink({
  href,
  event,
  children,
  className,
}: {
  href: string;
  event: AnalyticsEvent;
  children: ReactNode;
  className?: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(className)}
      onClick={() => track(event)}
    >
      {children}
    </a>
  );
}
