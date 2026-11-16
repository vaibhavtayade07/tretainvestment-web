"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import type { FormState } from "@/lib/actions/clients";

export function DeleteButton({
  action,
  confirmMessage,
  label = "Delete",
  id,
  idName = "clientId",
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  confirmMessage: string;
  label?: string;
  id: string;
  idName?: string;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, {});

  const handleSubmit = (e: React.FormEvent) => {
    if (!window.confirm(confirmMessage)) {
      e.preventDefault();
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <input type="hidden" name={idName} value={id} />
      {state.error && (
        <p className="mb-2 text-sm text-red-600">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        {isPending ? "Deleting..." : label}
      </button>
    </form>
  );
}
