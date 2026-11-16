import Link from "next/link";
import { requireOrg } from "@/lib/session";
import { getClient, getClientHoldings } from "@/lib/db/queries";
import { notFound } from "next/navigation";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function HoldingsPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { orgId } = await requireOrg();
  const { clientId } = await params;

  const [client, holdings] = await Promise.all([
    getClient(orgId, clientId),
    getClientHoldings(orgId, clientId),
  ]);

  if (!client) notFound();

  // Summary calculations
  const totalInvested = holdings.reduce(
    (sum, h) => sum + Number(h.units) * Number(h.avgCost),
    0,
  );
  const totalCurrentValue = holdings.reduce(
    (sum, h) => sum + Number(h.units) * Number(h.currentNav),
    0,
  );
  const gainLoss = totalCurrentValue - totalInvested;
  const gainLossPct = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

  // Category breakdown for chart
  const categoryData = holdings.reduce(
    (acc, h) => {
      const cat = h.category;
      acc[cat] = (acc[cat] ?? 0) + Number(h.units) * Number(h.currentNav);
      return acc;
    },
    {} as Record<string, number>,
  );

  const categoryColors: Record<string, string> = {
    equity: "bg-blue-500",
    debt: "bg-green-500",
    hybrid: "bg-orange-500",
    other: "bg-gray-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Holdings — {client.fullName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Portfolio overview and management.
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
            href={`/app/clients/${clientId}/holdings/new`}
            className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
          >
            Add Holding
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Invested</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatCurrency(totalInvested)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Current Value</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatCurrency(totalCurrentValue)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Gain / Loss</p>
          <p
            className={`mt-1 text-2xl font-bold ${
              gainLoss >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(gainLoss)} ({gainLossPct.toFixed(1)}%)
          </p>
        </div>
      </div>

      {/* Category Chart */}
      {Object.keys(categoryData).length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">By Category</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            {Object.entries(categoryData).map(([cat, value]) => (
              <div key={cat} className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${categoryColors[cat] ?? "bg-gray-400"}`}
                />
                <span className="text-sm capitalize text-gray-700">{cat}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Holdings Table */}
      {holdings.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-500">No holdings yet.</p>
          <Link
            href={`/app/clients/${clientId}/holdings/new`}
            className="mt-4 inline-block text-sm font-medium text-teal-600 hover:underline"
          >
            Add Holding →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Scheme
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Units
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Avg Cost
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  NAV
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Value
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Gain/Loss
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Folio
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {holdings.map((h) => {
                const value = Number(h.units) * Number(h.currentNav);
                const invested = Number(h.units) * Number(h.avgCost);
                const gl = value - invested;
                const glPct = invested > 0 ? (gl / invested) * 100 : 0;

                return (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/clients/${clientId}/holdings/${h.id}/edit`}
                        className="text-sm font-medium text-teal-700 hover:underline"
                      >
                        {h.schemeName}
                      </Link>
                      {h.amfiCode && (
                        <p className="text-xs text-gray-400">{h.amfiCode}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                      {Number(h.units).toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                      ₹{Number(h.avgCost).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                      ₹{Number(h.currentNav).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(value)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right text-sm font-medium ${
                        gl >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(gl)} ({glPct.toFixed(1)}%)
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700">
                        {h.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {h.folioNo ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
