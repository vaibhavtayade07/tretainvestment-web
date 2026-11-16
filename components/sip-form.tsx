"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import type { FormState } from "@/lib/actions/sips";

export function SipForm({
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
    monthlyAmount: string;
    dayOfMonth: number;
    startDate: string;
    status: string;
  };
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="clientId" value={clientId} />
      {initialData && (
        <input type="hidden" name="sipId" value={initialData.id} />
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="monthlyAmount" className="block text-sm font-medium text-gray-700">
            Monthly Amount (₹) *
          </label>
          <input
            id="monthlyAmount"
            name="monthlyAmount"
            type="number"
            step="0.01"
            required
            defaultValue={initialData?.monthlyAmount ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="dayOfMonth" className="block text-sm font-medium text-gray-700">
            Day of Month (1-31) *
          </label>
          <input
            id="dayOfMonth"
            name="dayOfMonth"
            type="number"
            min={1}
            max={31}
            required
            defaultValue={initialData?.dayOfMonth ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date *
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            defaultValue={initialData?.startDate?.split("T")[0] ?? ""}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {mode === "edit" && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initialData?.status ?? "active"}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="stopped">Stopped</option>
          </select>
        </div>
      )}

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
              ? "Add SIP"
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
