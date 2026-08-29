import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { auth } from "@/auth";
import { getSettings } from "@/lib/settings";
import { getAdminById } from "@/lib/admin-guard";

export const metadata = {
  title: "Connexion admin",
  robots: { index: false, follow: false },
};

function isAuthConfigured() {
  return Boolean(process.env.AUTH_SECRET?.trim() || process.env.ADMIN_SECRET?.trim());
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string; disabled?: string }>;
}) {
  if (!isAuthConfigured()) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">Admin non configuré</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Définis <code className="text-foreground">AUTH_SECRET</code> dans les
            variables d&apos;environnement Vercel, puis redéploie.
          </p>
        </div>
      </div>
    );
  }

  const session = await auth();
  if (session?.user?.id) {
    const me = await getAdminById(session.user.id);
    if (me?.isActive) redirect("/admin");
  }
  const settings = await getSettings();
  const { expired, disabled } = await searchParams;

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8">
        <div className="mb-8 text-center">
          <Heart className="mx-auto size-8 text-primary" />
          <h1 className="mt-4 font-display text-2xl font-semibold">Bon retour</h1>
          <p className="mt-1 text-sm text-muted-foreground">Connexion hôte {settings.showName}</p>
        </div>
        <LoginForm expired={expired === "1"} disabled={disabled === "1"} />
      </div>
    </div>
  );
}
