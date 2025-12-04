import { DashboardMetrics } from "./_components/dashboard-metrics";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business metrics
        </p>
      </div>
      <DashboardMetrics />
    </div>
  );
}
