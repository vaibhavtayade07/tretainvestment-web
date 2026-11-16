import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOrg } from "@/lib/session";
import { getClient, getClientHoldings, getClientSips } from "@/lib/db/queries";
import { deleteClientAction } from "@/lib/actions/clients";
import { DeleteButton } from "@/components/delete-button";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { orgId } = await requireOrg();
  const { clientId } = await params;

  const [client, holdings, sips] = await Promise.all([
    getClient(orgId, clientId),
    getClientHoldings(orgId, clientId),
    getClientSips(orgId, clientId),
  ]);

  if (!client) notFound();

  // Holdings summary
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

  // SIP summary
  const activeSips = sips.filter((s) => s.status === "active");
  const monthlySipAmount = activeSips.reduce(
    (sum, s) => sum + Number(s.monthlyAmount),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {client.fullName}
          </h1>
          <div className="mt-2 space-y-1">
            {client.email && (
              <p className="text-sm text-gray-600">{client.email}</p>
            )}
            {client.phone && (
              <p className="text-sm text-gray-600">{client.phone}</p>
            )}
            <p className="text-sm text-gray-500">
              Risk:{" "}
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700">
                {client.riskProfile}
              </span>
            </p>
            {client.notes && (
              <p className="text-sm text-gray-500">{client.notes}</p>
            )}
          </div>
        </div>
        <Link
          href={`/app/clients/${client.id}/edit`}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit
        </Link>
      </div>

      {/* Holdings Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Holdings</h2>
          <Link
            href={`/app/clients/${client.id}/holdings`}
            className="text-sm font-medium text-teal-600 hover:underline"
          >
            View All →
          </Link>
        </div>
        {holdings.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            No holdings yet.{" "}
            <Link
              href={`/app/clients/${client.id}/holdings/new`}
              className="text-teal-600 hover:underline"
            >
              Add holding →
            </Link>
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Total Invested</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(totalInvested)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Value</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(totalCurrentValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gain / Loss</p>
              <p
                className={`text-xl font-semibold ${
                  gainLoss >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(gainLoss)} ({gainLossPct.toFixed(1)}%)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SIP Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">SIPs</h2>
          <Link
            href={`/app/clients/${client.id}/sips`}
            className="text-sm font-medium text-teal-600 hover:underline"
          >
            View All →
          </Link>
        </div>
        {sips.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            No SIPs yet.{" "}
            <Link
              href={`/app/clients/${client.id}/sips/new`}
              className="text-teal-600 hover:underline"
            >
              Add SIP →
            </Link>
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Active SIPs</p>
              <p className="text-xl font-semibold text-gray-900">
                {activeSips.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Amount</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(monthlySipAmount)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        <p className="mt-2 text-sm text-gray-500">
          Deleting this client will permanently remove all their holdings and SIPs.
        </p>
        <div className="mt-4">
          <DeleteButton
            action={deleteClientAction}
            confirmMessage={`Are you sure you want to delete ${client.fullName}? This cannot be undone.`}
            label="Delete Client"
            id={client.id}
          />
        </div>
      </div>
    </div>
  );
}
