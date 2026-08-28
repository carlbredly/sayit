"use client";

import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const HEARTS = [
  { left: "4%", size: 10, delay: 0, duration: 18, opacity: 0.22, filled: true },
  { left: "11%", size: 14, delay: 3.2, duration: 22, opacity: 0.16, filled: false },
  { left: "18%", size: 8, delay: 7, duration: 16, opacity: 0.28, filled: true },
  { left: "26%", size: 12, delay: 1.4, duration: 20, opacity: 0.18, filled: false },
  { left: "33%", size: 9, delay: 9.5, duration: 19, opacity: 0.24, filled: true },
  { left: "41%", size: 16, delay: 4.8, duration: 24, opacity: 0.14, filled: false },
  { left: "48%", size: 8, delay: 11, duration: 17, opacity: 0.26, filled: true },
  { left: "55%", size: 11, delay: 2.1, duration: 21, opacity: 0.2, filled: false },
  { left: "63%", size: 13, delay: 6.4, duration: 23, opacity: 0.15, filled: false },
  { left: "70%", size: 9, delay: 8.8, duration: 18, opacity: 0.25, filled: true },
  { left: "78%", size: 15, delay: 0.9, duration: 25, opacity: 0.14, filled: false },
  { left: "85%", size: 8, delay: 12.2, duration: 16, opacity: 0.22, filled: true },
  { left: "92%", size: 12, delay: 14, duration: 19, opacity: 0.18, filled: false },
  { left: "8%", size: 7, delay: 15.6, duration: 21, opacity: 0.2, filled: true },
  { left: "37%", size: 10, delay: 5.5, duration: 18, opacity: 0.22, filled: false },
  { left: "59%", size: 7, delay: 13.4, duration: 20, opacity: 0.2, filled: true },
  { left: "74%", size: 11, delay: 16.8, duration: 22, opacity: 0.16, filled: false },
  { left: "96%", size: 9, delay: 10.1, duration: 17, opacity: 0.24, filled: true },
];

export function FloatingHeartsBackground() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {HEARTS.map((heart, index) => (
        <Heart
          key={index}
          className={cn(
            "absolute text-primary",
            heart.filled && "fill-current",
            reduce ? "animate-none" : "animate-heart-float"
          )}
          style={{
            left: heart.left,
            width: heart.size,
            height: heart.size,
            opacity: reduce ? heart.opacity * 0.7 : undefined,
            top: reduce ? `${8 + ((index * 13) % 84)}%` : undefined,
            animationDelay: reduce ? undefined : `${heart.delay}s`,
            animationDuration: reduce ? undefined : `${heart.duration}s`,
            ["--heart-opacity" as string]: String(heart.opacity),
          }}
          strokeWidth={1.4}
        />
      ))}
    </div>
  );
}
