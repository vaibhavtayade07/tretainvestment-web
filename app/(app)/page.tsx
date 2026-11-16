import { requireOrg } from "@/lib/session";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentClients } from "@/components/recent-clients";

export default async function DashboardPage() {
  const { orgId } = await requireOrg();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your practice.
        </p>
      </div>

      <DashboardStats orgId={orgId} />

      <RecentClients orgId={orgId} />
    </div>
  );
}
