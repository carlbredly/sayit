import { redirect } from "next/navigation";
import { UsersManager } from "@/components/admin/users-manager";
import { listAdminUsers } from "@/app/actions/users";
import { requireActiveAdmin } from "@/lib/admin-guard";

export default async function AdminUsersPage() {
  const { admin } = await requireActiveAdmin();
  if (!admin.isOwner) redirect("/admin");

  const { meId, users } = await listAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Only you can add team members and turn their access on or off.
        </p>
      </div>
      <UsersManager meId={meId} users={users} />
    </div>
  );
}
