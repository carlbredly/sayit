import { UsersManager } from "@/components/admin/users-manager";
import { listAdminUsers } from "@/app/actions/users";
import { requireActiveAdmin } from "@/lib/admin-guard";

export default async function AdminUsersPage() {
  const { admin } = await requireActiveAdmin();
  if (!admin.isOwner) {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-2xl font-semibold">Utilisateurs</h1>
        <p className="text-sm text-muted-foreground">
          Seul le propriétaire peut ajouter des utilisateurs et modifier les accès.
        </p>
      </div>
    );
  }

  const { meId, users } = await listAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Utilisateurs</h1>
        <p className="text-sm text-muted-foreground">
          Toi seul peux ajouter des membres et activer ou couper leur accès.
        </p>
      </div>
      <UsersManager meId={meId} users={users} />
    </div>
  );
}
