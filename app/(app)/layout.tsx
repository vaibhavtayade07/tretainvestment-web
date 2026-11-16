import { requireOrg, getOrgForUser } from "@/lib/session";
import { AppShell } from "@/components/app-shell";
import { auth } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await requireOrg();
  const [session, org] = await Promise.all([auth(), getOrgForUser(userId)]);

  const orgName = org?.name ?? "My Firm";
  const userName = session?.user?.name ?? session?.user?.email ?? "User";

  return (
    <AppShell orgName={orgName} userName={userName}>
      {children}
    </AppShell>
  );
}
