import { SettingsForm } from "@/components/admin/settings-form";
import { getAdminSettings } from "@/app/actions/admin";

export default async function SettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Réglages</h1>
        <p className="text-sm text-muted-foreground">
          Identité de l&apos;émission, horaires, modèle WhatsApp et lien de don.
        </p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
