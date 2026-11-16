"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function ClientListSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    startTransition(() => {
      router.push(`/app/clients?${params.toString()}`);
    });
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search clients by name..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
      />
      <svg
        className="absolute top-2.5 left-3 h-4 w-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      {isPending && (
        <div className="absolute top-2.5 right-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-teal-600" />
      )}
    </div>
  );
}
