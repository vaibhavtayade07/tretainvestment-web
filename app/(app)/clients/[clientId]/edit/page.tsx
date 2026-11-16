import { notFound } from "next/navigation";
import { requireOrg } from "@/lib/session";
import { getClient } from "@/lib/db/queries";
import { ClientForm } from "@/components/client-form";
import { updateClientAction } from "@/lib/actions/clients";

export default async function EditClientPage({
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
        Edit Client
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Update {client.fullName}&apos;s information.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ClientForm
          mode="edit"
          initialData={client}
          action={updateClientAction}
        />
      </div>
    </div>
  );
}
