import Link from "next/link";
import { redirect } from "next/navigation";

import { getOrgForUser, requireUser } from "@/lib/session";

import { CreateOrgForm } from "./create-org-form";

export default async function OnboardingPage() {
  const userId = await requireUser();
  const org = await getOrgForUser(userId);
  if (org) redirect("/app");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 py-16 text-neutral-900">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block text-center text-3xl font-bold tracking-tight text-teal-700"
        >
          tr
        </Link>
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-lg font-semibold">Set up your firm</h1>
          <p className="mt-1 text-sm text-neutral-500">
            This is the workspace all your clients and holdings will live
            under.
          </p>
          <div className="mt-6">
            <CreateOrgForm />
          </div>
        </div>
      </div>
    </main>
  );
}
