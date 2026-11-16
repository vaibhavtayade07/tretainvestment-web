import { requireOrg } from "@/lib/session";
import { ClientForm } from "@/components/client-form";
import { createClientAction } from "@/lib/actions/clients";

export default async function NewClientPage() {
  await requireOrg();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Add Client
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Add a new client to your practice.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ClientForm mode="create" action={createClientAction} />
      </div>
    </div>
  );
}
