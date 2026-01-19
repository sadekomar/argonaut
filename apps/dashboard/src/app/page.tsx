import { Suspense } from "react";
import { DashboardMetrics } from "./_components/dashboard-metrics";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Hoisted static skeleton cards - avoids recreation on every render
const skeletonCards = Array.from({ length: 8 }).map((_, i) => (
  <Card key={i}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
      <div className="h-4 w-4 bg-muted animate-pulse rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-8 w-32 bg-muted animate-pulse rounded mt-2" />
    </CardContent>
  </Card>
));

// Hoisted static skeleton element
const dashboardSkeleton = (
  <div className="space-y-6">
    <div>
      <div className="h-7 w-32 bg-muted animate-pulse rounded mb-4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {skeletonCards}
      </div>
    </div>
  </div>
);

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business metrics
        </p>
      </div>
      <Suspense fallback={dashboardSkeleton}>
        <DashboardMetrics />
      </Suspense>
    </div>
  );
}
