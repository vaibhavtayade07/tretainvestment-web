import Link from "next/link";

import { LoginForm } from "./login-form";

export default function LoginPage() {
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
          <h1 className="text-lg font-semibold">Sign in to your firm</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Welcome back. Enter your credentials to continue.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-neutral-500">
          No account?{" "}
          <Link
            href="/signup"
            className="font-medium text-emerald-700 hover:text-emerald-800"
          >
            Get started
          </Link>
        </p>
      </div>
    </main>
  );
}
