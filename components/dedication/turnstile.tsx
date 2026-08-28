"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void }
      ) => string;
    };
  }
}

export function Turnstile({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (token: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    function render() {
      if (!ref.current || !window.turnstile) return;
      window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: onToken,
      });
    }

    if (window.turnstile) {
      render();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
  }, [siteKey, onToken]);

  return <div ref={ref} className="mt-4" />;
}
