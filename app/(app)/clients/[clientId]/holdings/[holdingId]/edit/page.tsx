import { notFound } from "next/navigation";
import { requireOrg } from "@/lib/session";
import { getHolding } from "@/lib/db/queries";
import { HoldingForm } from "@/components/holding-form";
import { updateHoldingAction, deleteHoldingAction } from "@/lib/actions/holdings";
import { DeleteButton } from "@/components/delete-button";

export default async function EditHoldingPage({
  params,
}: {
  params: Promise<{ clientId: string; holdingId: string }>;
}) {
  const { orgId } = await requireOrg();
  const { clientId, holdingId } = await params;

  const holding = await getHolding(orgId, holdingId);
  if (!holding || holding.clientId !== clientId) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Edit Holding
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Update {holding.schemeName}.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <HoldingForm
          mode="edit"
          clientId={clientId}
          initialData={holding}
          action={updateHoldingAction}
        />
      </div>

      <div className="mt-6 rounded-xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-700">Delete Holding</h2>
        <p className="mt-2 text-sm text-gray-500">
          This will permanently remove this holding.
        </p>
        <div className="mt-4">
          <DeleteButton
            action={deleteHoldingAction}
            confirmMessage="Are you sure you want to delete this holding?"
            label="Delete Holding"
            id={holdingId}
            idName="holdingId"
          />
        </div>
      </div>
    </div>
  );
}
