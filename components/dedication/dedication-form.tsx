"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, Lock, User } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { createDedication } from "@/app/actions/dedications";
import { COUNTRIES, getCountry } from "@/lib/countries";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DedicationCard } from "@/components/dedication/dedication-card";
import { AnimatePresence } from "framer-motion";
import { StepFade } from "@/components/motion";
import { Turnstile } from "@/components/dedication/turnstile";

const STEPS = ["Qui es-tu ?", "Pour qui ?", "Ta dédicace", "Vérifier"];

type FormState = {
  isAnonymous: boolean | null;
  senderName: string;
  recipientName: string;
  countryIso: string;
  whatsappNational: string;
  message: string;
  website: string;
};

const INITIAL: FormState = {
  isAnonymous: null,
  senderName: "",
  recipientName: "",
  countryIso: "US",
  whatsappNational: "",
  message: "",
  website: "",
};

export function DedicationForm({
  maxLength,
  turnstileSiteKey,
}: {
  maxLength: number;
  turnstileSiteKey?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [phoneOk, setPhoneOk] = useState<boolean | null>(null);
  const [started, setStarted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [pending, startTransition] = useTransition();

  const country = getCountry(form.countryIso);

  const e164Preview = useMemo(() => {
    const parsed = parsePhoneNumberFromString(
      `+${country.dial}${form.whatsappNational.replace(/[^\d]/g, "")}`
    );
    return parsed?.isValid() ? parsed.number : null;
  }, [country.dial, form.whatsappNational]);

  function markStarted() {
    if (!started) {
      setStarted(true);
      track("dedication_form_started");
    }
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    markStarted();
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setError(null);
  }

  function validateStep() {
    const next: Record<string, string> = {};
    if (step === 0) {
      if (form.isAnonymous === null) next.isAnonymous = "Choisis comment tu veux apparaître.";
      if (form.isAnonymous === false && !form.senderName.trim()) {
        next.senderName = "Ajoute ton nom, ou reste anonyme.";
      }
    }
    if (step === 1) {
      if (!form.recipientName.trim()) next.recipientName = "Dis-nous pour qui c'est.";
      if (!e164Preview) next.whatsappNational = "Entre un numéro WhatsApp valide.";
    }
    if (step === 2) {
      if (form.message.trim().length < 8) next.message = "Écris une dédicace.";
      if (form.message.length > maxLength) {
        next.message = `Reste sous ${maxLength} caractères.`;
      }
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  function nextStep() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 3));
  }

  function submit() {
    if (!validateStep()) return;
    startTransition(async () => {
      const result = await createDedication({
        isAnonymous: Boolean(form.isAnonymous),
        senderName: form.senderName,
        recipientName: form.recipientName,
        countryIso: form.countryIso,
        whatsappNational: form.whatsappNational,
        message: form.message,
        website: form.website,
        turnstileToken: turnstileToken || undefined,
      });

      if (!result.ok) {
        setError(result.error);
        setFieldErrors(result.fieldErrors || {});
        return;
      }

      track("dedication_submitted");
      router.push(`/success?id=${result.publicId}`);
    });
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Progression du formulaire">
        {STEPS.map((label, index) => (
          <li key={label} className="flex flex-col gap-2">
            <div
              className={cn(
                "h-1.5 rounded-full",
                index <= step ? "bg-primary" : "bg-border"
              )}
            />
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              {label}
            </span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <StepFade step={step} key={step}>
        {step === 0 ? (
          <section>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              De qui vient cette dédicace ?
            </h1>
            <p className="mt-2 text-muted-foreground">Choisis comment tu veux apparaître.</p>
            <div className="mt-8 grid gap-3">
              <button
                type="button"
                onClick={() => update("isAnonymous", false)}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border p-5 text-left transition-colors",
                  form.isAnonymous === false
                    ? "border-primary bg-primary/10 glow-pink"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <User className="size-5" />
                </span>
                <span>
                  <span className="block font-medium">Utiliser mon nom</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    On dira de qui ça vient.
                  </span>
                </span>
                {form.isAnonymous === false ? (
                  <Check className="ml-auto size-5 text-primary" />
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => update("isAnonymous", true)}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border p-5 text-left transition-colors",
                  form.isAnonymous === true
                    ? "border-primary bg-primary/10 glow-pink"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                  <Lock className="size-5" />
                </span>
                <span>
                  <span className="block font-medium">Rester anonyme</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    Ton identité restera privée.
                  </span>
                </span>
                {form.isAnonymous === true ? (
                  <Check className="ml-auto size-5 text-primary" />
                ) : null}
              </button>
            </div>
            {form.isAnonymous === false ? (
              <div className="mt-6 space-y-2">
                <Label htmlFor="senderName">Ton nom</Label>
                <Input
                  id="senderName"
                  className="h-12"
                  value={form.senderName}
                  onChange={(e) => update("senderName", e.target.value)}
                  placeholder="Alex"
                  autoComplete="given-name"
                  maxLength={80}
                />
                {fieldErrors.senderName ? (
                  <p className="text-sm text-destructive">{fieldErrors.senderName}</p>
                ) : null}
              </div>
            ) : null}
            {fieldErrors.isAnonymous ? (
              <p className="mt-3 text-sm text-destructive">{fieldErrors.isAnonymous}</p>
            ) : null}
          </section>
        ) : null}

        {step === 1 ? (
          <section>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Pour qui c&apos;est ?
            </h1>
            <p className="mt-2 text-muted-foreground">
              On utilisera ce numéro pour les joindre pendant la surprise en live.
            </p>
            <div className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Nom du destinataire</Label>
                <Input
                  id="recipientName"
                  className="h-12"
                  value={form.recipientName}
                  onChange={(e) => update("recipientName", e.target.value)}
                  placeholder="Sarah"
                  maxLength={80}
                />
                {fieldErrors.recipientName ? (
                  <p className="text-sm text-destructive">{fieldErrors.recipientName}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
                <div className="flex gap-2">
                  <label className="sr-only" htmlFor="country">
                    Indicatif pays
                  </label>
                  <select
                    id="country"
                    className="h-12 w-[8.5rem] rounded-lg border border-input bg-input/30 px-2 text-sm"
                    value={form.countryIso}
                    onChange={(e) => {
                      update("countryIso", e.target.value);
                      setPhoneOk(null);
                    }}
                  >
                    {COUNTRIES.map((item) => (
                      <option key={item.iso} value={item.iso}>
                        {item.flag} +{item.dial}
                      </option>
                    ))}
                  </select>
                  <Input
                    id="whatsapp"
                    className="h-12"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="555 123 4567"
                    value={form.whatsappNational}
                    onChange={(e) => {
                      update("whatsappNational", e.target.value);
                      setPhoneOk(null);
                    }}
                    onBlur={() => setPhoneOk(Boolean(e164Preview))}
                  />
                </div>
                {phoneOk ? (
                  <p className="text-sm text-success">Ce numéro a l&apos;air bon.</p>
                ) : null}
                {fieldErrors.whatsappNational ? (
                  <p className="text-sm text-destructive">{fieldErrors.whatsappNational}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Privé. Utilisé seulement pour les joindre pendant le live. Jamais affiché publiquement.
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Écris ta dédicace
            </h1>
            <p className="mt-2 text-muted-foreground">
              N&apos;y réfléchis pas trop. Dis simplement ce que tu ressens.
            </p>
            <div className="mt-8 space-y-2">
              <Label htmlFor="message">Ton message</Label>
              <Textarea
                id="message"
                className="min-h-48 text-base leading-relaxed"
                placeholder="Écris quelque chose qui vient du cœur..."
                maxLength={maxLength}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Les emojis et les retours à la ligne sont les bienvenus.</span>
                <span>
                  {form.message.length}/{maxLength}
                </span>
              </div>
              {fieldErrors.message ? (
                <p className="text-sm text-destructive">{fieldErrors.message}</p>
              ) : null}
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Vérifie ta dédicace
            </h1>
            <p className="mt-2 text-muted-foreground">
              Chaque samedi à 10 h, heure de New York, on choisit des dédicaces
              à lire pendant notre live TikTok.
            </p>
            <div className="mt-8">
              <DedicationCard
                from={form.isAnonymous ? "Anonyme" : form.senderName || "Anonyme"}
                to={form.recipientName}
                message={form.message}
              />
            </div>
            {turnstileSiteKey ? (
              <Turnstile siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                Protégé contre le spam.
              </p>
            )}
          </section>
        ) : null}
        </StepFade>
      </AnimatePresence>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
      />

      {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}

      <div className="mt-8 flex gap-3">
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1"
            onClick={() => setStep((s) => s - 1)}
            disabled={pending}
          >
            {step === 3 ? "Modifier" : "Retour"}
          </Button>
        ) : null}
        {step < 3 ? (
          <Button type="button" className="h-12 flex-[2]" onClick={nextStep}>
            Continuer
          </Button>
        ) : (
          <Button
            type="button"
            className="h-12 flex-[2]"
            onClick={submit}
            disabled={pending}
          >
            <Heart className="size-4" />
            {pending ? "Envoi..." : "Envoyer la dédicace"}
          </Button>
        )}
      </div>
    </div>
  );
}
