"use client";

import { useState, useTransition } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { markContacted } from "@/app/actions/admin";
import { toWhatsAppLink } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export function WhatsAppContactButton({
  dedicationId,
  phone,
  message,
  alreadyContacted,
  label = "Contact on WhatsApp",
  className,
  compact = false,
}: {
  dedicationId: string;
  phone: string;
  message: string;
  alreadyContacted?: boolean;
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  const [ask, setAsk] = useState(false);
  const [pending, start] = useTransition();
  const href = toWhatsAppLink(phone, message);

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={cn(
          compact
            ? "inline-flex rounded-lg border border-border p-2 text-success hover:bg-muted"
            : cn(buttonVariants(), "h-11 w-full", className)
        )}
        onClick={() => {
          if (!alreadyContacted) setAsk(true);
        }}
      >
        {compact ? (
          <MessageCircle className="size-4" />
        ) : (
          <>
            <MessageCircle className="size-4" />
            {label}
          </>
        )}
      </a>

      <AlertDialog open={ask} onOpenChange={(open) => setAsk(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Contacted?</AlertDialogTitle>
            <AlertDialogDescription>
              WhatsApp is opening with the pre-filled message. Mark this
              dedication as contacted once you&apos;ve reached them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not yet</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={() =>
                start(async () => {
                  await markContacted(dedicationId);
                  toast.success("Marked as contacted.");
                  setAsk(false);
                })
              }
            >
              {pending ? "Saving..." : "Mark as Contacted"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
