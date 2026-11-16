import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOrg } from "@/lib/session";
import { getClient, getClientSips } from "@/lib/db/queries";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  stopped: "bg-red-100 text-red-800",
};

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default async function SipsPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { orgId } = await requireOrg();
  const { clientId } = await params;

  const [client, sips] = await Promise.all([
    getClient(orgId, clientId),
    getClientSips(orgId, clientId),
  ]);

  if (!client) notFound();

  const activeSips = sips.filter((s) => s.status === "active");
  const pausedSips = sips.filter((s) => s.status === "paused");
  const stoppedSips = sips.filter((s) => s.status === "stopped");
  const monthlyTotal = activeSips.reduce(
    (sum, s) => sum + Number(s.monthlyAmount),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            SIPs — {client.fullName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Systematic investment plans.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/app/clients/${clientId}`}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Client
          </Link>
          <Link
            href={`/app/clients/${clientId}/sips/new`}
            className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
          >
            Add SIP
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active SIPs</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{activeSips.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Monthly Flow</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatCurrency(monthlyTotal)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Paused</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{pausedSips.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Stopped</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stoppedSips.length}</p>
        </div>
      </div>

      {/* SIP Table */}
      {sips.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-500">No SIPs yet.</p>
          <Link
            href={`/app/clients/${clientId}/sips/new`}
            className="mt-4 inline-block text-sm font-medium text-teal-600 hover:underline"
          >
            Add SIP →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Scheme
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Monthly (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sips.map((sip) => (
                <tr key={sip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/app/clients/${clientId}/sips/${sip.id}/edit`}
                      className="text-sm font-medium text-teal-700 hover:underline"
                    >
                      {sip.schemeName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(Number(sip.monthlyAmount))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {ordinal(sip.dayOfMonth)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(sip.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        statusColors[sip.status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {sip.status}
                    </span>
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
