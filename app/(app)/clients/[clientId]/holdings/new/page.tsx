import { notFound } from "next/navigation";
import { requireOrg } from "@/lib/session";
import { HoldingForm } from "@/components/holding-form";
import { createHoldingAction } from "@/lib/actions/holdings";

export default async function NewHoldingPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { orgId } = await requireOrg();
  const { clientId } = await params;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Add Holding
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Add a new holding to this client&apos;s portfolio.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <HoldingForm
          mode="create"
          clientId={clientId}
          action={createHoldingAction}
        />
      </div>
    </div>
  );
}
