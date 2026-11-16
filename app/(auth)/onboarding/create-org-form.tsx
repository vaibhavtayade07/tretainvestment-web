"use client";

import { useActionState } from "react";

import { createOrgAction, type FormState } from "../actions";

const initialState: FormState = {};

export function CreateOrgForm() {
  const [state, formAction, pending] = useActionState(
    createOrgAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-neutral-700"
        >
          Firm name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="e.g. TRETAINVESTMENT"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="arnCode"
          className="block text-sm font-medium text-neutral-700"
        >
          ARN code <span className="font-normal text-neutral-400">(optional)</span>
        </label>
        <input
          id="arnCode"
          name="arnCode"
          type="text"
          placeholder="e.g. ARN-123456"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
        />
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating firm…" : "Create firm"}
      </button>
    </form>
  );
}
