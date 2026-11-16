import { notFound } from "next/navigation";
import { requireOrg } from "@/lib/session";
import { getSip } from "@/lib/db/queries";
import { SipForm } from "@/components/sip-form";
import { updateSipAction, deleteSipAction } from "@/lib/actions/sips";
import { DeleteButton } from "@/components/delete-button";

export default async function EditSipPage({
  params,
}: {
  params: Promise<{ clientId: string; sipId: string }>;
}) {
  const { orgId } = await requireOrg();
  const { clientId, sipId } = await params;

  const sip = await getSip(orgId, sipId);
  if (!sip || sip.clientId !== clientId) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Edit SIP
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Update {sip.schemeName}.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <SipForm
          mode="edit"
          clientId={clientId}
          initialData={{
            id: sip.id,
            schemeName: sip.schemeName,
            monthlyAmount: sip.monthlyAmount,
            dayOfMonth: sip.dayOfMonth,
            startDate: sip.startDate,
            status: sip.status,
          }}
          action={updateSipAction}
        />
      </div>

      <div className="mt-6 rounded-xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-700">Delete SIP</h2>
        <p className="mt-2 text-sm text-gray-500">
          This will permanently remove this SIP.
        </p>
        <div className="mt-4">
          <DeleteButton
            action={deleteSipAction}
            confirmMessage="Are you sure you want to delete this SIP?"
            label="Delete SIP"
            id={sipId}
            idName="sipId"
          />
        </div>
      </div>
    </div>
  );
}
