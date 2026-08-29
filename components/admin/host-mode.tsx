"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { SerializedDedication } from "@/lib/serialize";
import { completeDedication, markReadLive } from "@/app/actions/admin";
import { fillWhatsAppTemplate } from "@/lib/whatsapp";
import { WhatsAppContactButton } from "@/components/admin/whatsapp-contact-button";

export function HostMode({
  items,
  showName,
  whatsappTemplate,
}: {
  items: SerializedDedication[];
  showName: string;
  whatsappTemplate: string;
}) {
  const [index, setIndex] = useState(0);
  const [pending, start] = useTransition();
  const current = items[index];

  if (!current) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-center text-muted-foreground">
        No dedications in the live queue.
      </div>
    );
  }

  const message = fillWhatsAppTemplate(whatsappTemplate, { showName });

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-4xl flex-col justify-center px-4 py-8">
      <p className="text-sm text-muted-foreground">
        {index + 1} / {items.length}
      </p>
      <p className="mt-6 text-sm uppercase tracking-[0.25em] text-muted-foreground">For</p>
      <h1 className="mt-2 font-serif text-5xl italic text-primary sm:text-7xl">
        {current.recipientName}
      </h1>
      <p className="mt-8 text-sm uppercase tracking-[0.25em] text-muted-foreground">From</p>
      <p className="mt-2 font-display text-2xl sm:text-3xl">
        {current.isAnonymous ? "Anonymous" : current.senderName}
      </p>
      <p className="mt-8 text-sm uppercase tracking-[0.25em] text-muted-foreground">Dedication</p>
      <p className="mt-4 whitespace-pre-wrap font-serif text-2xl leading-relaxed sm:text-4xl">
        {current.dedicationMessage}
      </p>
      {current.adminNotes ? (
        <p className="mt-6 text-sm text-amber-300">Note: {current.adminNotes}</p>
      ) : null}
      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="h-14 flex-1"
          disabled={index === 0}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          Previous
        </Button>
        <div className="flex-1">
          <WhatsAppContactButton
            dedicationId={current.id}
            phone={current.recipientWhatsapp}
            message={message}
            label="Contact on WhatsApp"
            className="h-14"
            alreadyContacted={
              current.status === "CONTACTED" || Boolean(current.contactedAt)
            }
          />
        </div>
        <Button
          variant="outline"
          className="h-14 flex-1"
          disabled={index >= items.length - 1}
          onClick={() => setIndex((value) => Math.min(items.length - 1, value + 1))}
        >
          Next
        </Button>
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Button
          className="h-14 flex-1"
          disabled={pending}
          onClick={() => start(() => markReadLive(current.id))}
        >
          Mark as Read Live
        </Button>
        <Button
          variant="outline"
          className="h-14 flex-1"
          disabled={pending}
          onClick={() => start(() => completeDedication(current.id))}
        >
          Complete
        </Button>
      </div>
    </div>
  );
}
