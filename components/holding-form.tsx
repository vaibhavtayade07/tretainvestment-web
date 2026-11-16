"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import type { FormState } from "@/lib/actions/holdings";

export function HoldingForm({
  mode,
  clientId,
  initialData,
  action,
}: {
  mode: "create" | "edit";
  clientId: string;
  initialData?: {
    id: string;
    schemeName: string;
    amfiCode: string | null;
    category: string;
    folioNo: string | null;
    units: string;
    avgCost: string;
    currentNav: string;
  };
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="clientId" value={clientId} />
      {initialData && (
        <input type="hidden" name="holdingId" value={initialData.id} />
      )}

      <div>
        <label htmlFor="schemeName" className="block text-sm font-medium text-gray-700">
          Scheme Name *
        </label>
        <input
          id="schemeName"
          name="schemeName"
          type="text"
          required
          defaultValue={initialData?.schemeName ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="amfiCode" className="block text-sm font-medium text-gray-700">
            AMFI Code
          </label>
          <input
            id="amfiCode"
            name="amfiCode"
            type="text"
            defaultValue={initialData?.amfiCode ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            id="category"
            name="category"
            defaultValue={initialData?.category ?? "equity"}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          >
            <option value="equity">Equity</option>
            <option value="debt">Debt</option>
            <option value="hybrid">Hybrid</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="folioNo" className="block text-sm font-medium text-gray-700">
          Folio No
        </label>
        <input
          id="folioNo"
          name="folioNo"
          type="text"
          defaultValue={initialData?.folioNo ?? ""}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="units" className="block text-sm font-medium text-gray-700">
            Units *
          </label>
          <input
            id="units"
            name="units"
            type="number"
            step="0.0001"
            required
            defaultValue={initialData?.units ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="avgCost" className="block text-sm font-medium text-gray-700">
            Avg Cost (₹) *
          </label>
          <input
            id="avgCost"
            name="avgCost"
            type="number"
            step="0.000001"
            required
            defaultValue={initialData?.avgCost ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="currentNav" className="block text-sm font-medium text-gray-700">
            Current NAV (₹) *
          </label>
          <input
            id="currentNav"
            name="currentNav"
            type="number"
            step="0.000001"
            required
            defaultValue={initialData?.currentNav ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700 disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : mode === "create"
              ? "Add Holding"
              : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
