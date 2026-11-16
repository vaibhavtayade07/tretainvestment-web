import Link from "next/link";

import { SignupForm } from "./signup-form";

export default function SignupPage() {
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
          <h1 className="text-lg font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-neutral-500">
            One account per distributor. You&apos;ll set up your firm next.
          </p>
          <div className="mt-6">
            <SignupForm />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-emerald-700 hover:text-emerald-800"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
