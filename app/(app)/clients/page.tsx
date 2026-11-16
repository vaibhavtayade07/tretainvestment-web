import Link from "next/link";
import { requireOrg } from "@/lib/session";
import { listClients } from "@/lib/db/queries";
import { ClientListSearch } from "@/components/client-list-search";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { orgId } = await requireOrg();
  const params = await searchParams;
  const clients = await listClients(orgId, params.search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Clients
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your client list.
          </p>
        </div>
        <Link
          href="/app/clients/new"
          className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
        >
          Add Client
        </Link>
      </div>

      <ClientListSearch />

      {clients.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            {params.search
              ? "No clients match your search."
              : "No clients yet. Add your first client to get started."}
          </p>
          {!params.search && (
            <Link
              href="/app/clients/new"
              className="mt-4 inline-block text-sm font-medium text-teal-600 hover:underline"
            >
              Add Client →
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4">
                    <Link
                      href={`/app/clients/${client.id}`}
                      className="text-sm font-medium text-teal-700 hover:underline"
                    >
                      {client.fullName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {client.email ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {client.phone ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700">
                      {client.riskProfile}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(client.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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
