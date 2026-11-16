import { signOut } from "@/lib/auth";

export function TopBar({
  orgName,
  userName,
}: {
  orgName: string;
  userName: string;
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-gray-900">{orgName}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{userName}</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
