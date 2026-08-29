import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getAdminById } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export default async function HostLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login?expired=1");
  const me = await getAdminById(session.user.id);
  if (!me || !me.isActive) {
    await signOut({ redirect: false });
    redirect("/admin/login?disabled=1");
  }
  return <div className="min-h-full bg-background">{children}</div>;
}
