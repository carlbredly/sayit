import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { auth } from "@/auth";
import { getSettings } from "@/lib/settings";

export const metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");
  const settings = await getSettings();

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8">
        <div className="mb-8 text-center">
          <Heart className="mx-auto size-8 text-primary" />
          <h1 className="mt-4 font-display text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">{settings.showName} host login</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
