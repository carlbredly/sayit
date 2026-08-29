import Link from "next/link";
import { getDonations } from "@/app/actions/admin";
import { formatDateTime } from "@/lib/timezone";
import { DONATION_STATUS_LABEL, type DonationStatus } from "@/lib/constants";

export default async function DonationsPage() {
  const rows = await getDonations();
  const completed = rows.filter((row) => row.donationStatus === "COMPLETED");
  const total = completed.reduce((sum, row) => sum + Number(row.donationAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dons</h1>
        <p className="text-sm text-muted-foreground">
          Dons optionnels après une dédicace. Ne marque jamais comme confirmé sans preuve.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">Total confirmé</p>
        <p className="mt-1 font-display text-3xl font-semibold">${total.toFixed(2)}</p>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          Aucun don pour l&apos;instant.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-3 font-medium">Dédicace</th>
                <th className="px-3 py-3 font-medium">Statut</th>
                <th className="px-3 py-3 font-medium">Montant</th>
                <th className="px-3 py-3 font-medium">Envoyée</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-3 py-3">
                    <Link href={`/admin/dedications/${row.id}`} className="hover:text-primary">
                      {row.publicId} · {row.recipientName}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    {DONATION_STATUS_LABEL[row.donationStatus as DonationStatus] ||
                      row.donationStatus}
                  </td>
                  <td className="px-3 py-3">
                    {row.donationAmount ? `$${Number(row.donationAmount).toFixed(2)}` : "—"}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {formatDateTime(row.submittedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
