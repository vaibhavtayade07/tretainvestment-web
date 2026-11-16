import { notFound } from "next/navigation";
import { requireOrg } from "@/lib/session";
import { getClient } from "@/lib/db/queries";
import { SipForm } from "@/components/sip-form";
import { createSipAction } from "@/lib/actions/sips";

export default async function NewSipPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { orgId } = await requireOrg();
  const { clientId } = await params;

  const client = await getClient(orgId, clientId);
  if (!client) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Add SIP
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Add a new systematic investment plan for {client.fullName}.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <SipForm
          mode="create"
          clientId={clientId}
          action={createSipAction}
        />
      </div>
    </div>
  );
}
