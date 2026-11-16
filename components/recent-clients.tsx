import Link from "next/link";
import { getRecentClients } from "@/lib/db/queries";

export async function RecentClients({ orgId }: { orgId: string }) {
  const clients = await getRecentClients(orgId);

  if (clients.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
        <p className="mt-4 text-sm text-gray-500">
          No clients yet.{" "}
          <Link href="/app/clients/new" className="text-teal-600 hover:underline">
            Add your first client →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
      <div className="mt-4 space-y-3">
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`/app/clients/${client.id}`}
            className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{client.fullName}</p>
              <p className="text-xs text-gray-500">{client.email ?? "No email"}</p>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(client.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
