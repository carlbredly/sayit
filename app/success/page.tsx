import type { Metadata } from "next";
import { SuccessExperience } from "@/components/dedication/success-experience";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSettings } from "@/lib/settings";
import { isValidPublicId } from "@/lib/public-id";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dédicace reçue",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const settings = await getSettings();
  const { id } = await searchParams;
  const publicId = id && isValidPublicId(id) ? id : "DED-XXXXX";

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader showName={settings.showName} />
      <main className="flex-1">
        <SuccessExperience
          publicId={publicId}
          donationMessage={settings.donationMessage}
          tiktokUrl={settings.tiktokUrl}
        />
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
