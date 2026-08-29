"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  expired = false,
  disabled = false,
}: {
  expired?: boolean;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(loginAction, { error: null });

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-12"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-12"
        />
      </div>
      {disabled ? (
        <p className="text-sm text-destructive">
          Your access has been turned off. Contact the owner.
        </p>
      ) : null}
      {expired ? (
        <p className="text-sm text-destructive">Your session has expired. Please sign in again.</p>
      ) : null}
      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" className="h-12 w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
