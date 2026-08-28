import type { Dedication } from "@/drizzle/schema";

export type SerializedDedication = Omit<
  Dedication,
  | "submittedAt"
  | "updatedAt"
  | "liveDate"
  | "contactedAt"
  | "readAt"
  | "donatedAt"
> & {
  submittedAt: string;
  updatedAt: string;
  liveDate: string | null;
  contactedAt: string | null;
  readAt: string | null;
  donatedAt: string | null;
};

export function serializeDedication(row: Dedication): SerializedDedication {
  return {
    ...row,
    submittedAt: row.submittedAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    liveDate: row.liveDate?.toISOString() ?? null,
    contactedAt: row.contactedAt?.toISOString() ?? null,
    readAt: row.readAt?.toISOString() ?? null,
    donatedAt: row.donatedAt?.toISOString() ?? null,
  };
}
