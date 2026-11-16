import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";

export function AppShell({
  children,
  orgName,
  userName,
}: {
  children: React.ReactNode;
  orgName: string;
  userName: string;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar orgName={orgName} userName={userName} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
