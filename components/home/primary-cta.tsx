"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PrimaryCta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="inline-flex w-full origin-center sm:w-auto"
      animate={
        reduce
          ? { scale: 1 }
          : { scale: [1, 1.12, 0.94, 1.06, 1], y: [0, -6, 2, -2, 0] }
      }
      transition={
        reduce
          ? undefined
          : {
              duration: 0.85,
              repeat: Infinity,
              repeatDelay: 1.6,
              times: [0, 0.28, 0.48, 0.72, 1],
              ease: [0.22, 1.4, 0.36, 1],
            }
      }
      whileHover={reduce ? undefined : { scale: 1.08, y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.94, y: 0 }}
    >
      <Link
        href={href}
        className={cn(
          buttonVariants(),
          "h-12 w-full px-6 text-base shadow-[0_10px_28px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)] sm:w-auto"
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}
