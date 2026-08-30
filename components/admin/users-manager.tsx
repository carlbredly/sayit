"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createAdminUser, setAdminAccess, type PublicAdminUser } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function UsersManager({
  meId,
  users,
}: {
  meId: string;
  users: PublicAdminUser[];
}) {
  const [pending, start] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-8">
      <form
        className="max-w-xl space-y-4 rounded-3xl border border-border bg-card p-5"
        onSubmit={(event) => {
          event.preventDefault();
          start(async () => {
            const result = await createAdminUser({ name, email, password });
            if (!result.ok) {
              toast.error(result.error);
              return;
            }
            toast.success("Utilisateur ajouté.");
            setName("");
            setEmail("");
            setPassword("");
          });
        }}
      >
        <h2 className="font-medium">Ajouter un utilisateur</h2>
        <p className="text-sm text-muted-foreground">
          Ils pourront se connecter au tableau de bord. Toi seul peux couper leur accès.
        </p>
        <div className="space-y-2">
          <Label htmlFor="user-name">Nom</Label>
          <Input
            id="user-name"
            className="h-11"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-email">E-mail</Label>
          <Input
            id="user-email"
            type="email"
            className="h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-password">Mot de passe</Label>
          <Input
            id="user-password"
            type="password"
            autoComplete="new-password"
            className="h-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        <Button type="submit" className="h-11" disabled={pending}>
          {pending ? "Enregistrement..." : "Ajouter"}
        </Button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Utilisateur</th>
              <th className="px-4 py-3 font-medium">Rôle</th>
              <th className="px-4 py-3 font-medium">Accès</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const locked = user.isOwner || user.id === meId;
              return (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-4 py-4">
                    <p className="font-medium">{user.name || "Hôte"}</p>
                    <p className="break-all text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {user.isOwner ? "Propriétaire" : "Équipe"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={user.isActive}
                        disabled={locked || pending}
                        aria-label={`Accès de ${user.email}`}
                        onCheckedChange={(checked) =>
                          start(async () => {
                            const result = await setAdminAccess(user.id, checked);
                            if (!result.ok) toast.error(result.error);
                            else toast.success(checked ? "Accès activé." : "Accès coupé.");
                          })
                        }
                      />
                      <span className={user.isActive ? "text-success" : "text-muted-foreground"}>
                        {user.isActive ? "Oui" : "Non"}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
