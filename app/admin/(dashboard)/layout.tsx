import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/sidebar";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const settings = await getSettings();

  return (
    <div className="flex min-h-full flex-1 bg-background">
      <AdminSidebar showName={settings.showName} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav showName={settings.showName} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
