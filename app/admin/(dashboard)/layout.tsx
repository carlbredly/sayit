import { redirect } from "next/navigation";
import { signOut, auth } from "@/auth";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/sidebar";
import { getSettings } from "@/lib/settings";
import { ensureOwnerExists, getAdminById } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login?expired=1");

  await ensureOwnerExists();
  const me = await getAdminById(session.user.id);
  if (!me || !me.isActive) {
    await signOut({ redirect: false });
    redirect("/admin/login?disabled=1");
  }

  const settings = await getSettings();

  return (
    <div className="flex min-h-full flex-1 bg-background">
      <AdminSidebar showName={settings.showName} isOwner={me.isOwner} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav showName={settings.showName} isOwner={me.isOwner} />
        <div className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
