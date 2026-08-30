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
  label = "Contacter sur WhatsApp",
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
            : cn(buttonVariants(), "h-14 min-h-14 w-full shrink-0", className)
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
            <AlertDialogTitle>Marquer comme contacté ?</AlertDialogTitle>
            <AlertDialogDescription>
              WhatsApp s&apos;ouvre avec le message prérempli. Marque cette
              dédicace comme contactée une fois que tu les as joints.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Pas encore</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={() =>
                start(async () => {
                  await markContacted(dedicationId);
                  toast.success("Marqué comme contacté.");
                  setAsk(false);
                })
              }
            >
              {pending ? "Enregistrement..." : "Marquer comme contacté"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
