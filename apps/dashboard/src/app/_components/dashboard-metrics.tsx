"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { getDashboardMetrics } from "../_utils/get-metrics";
import { getQuotesTimeSeries } from "../_utils/get-quotes-time-series";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  Building2,
  Users,
  UserCheck,
  FileCheck,
  Eye,
  CheckCircle2,
  PauseCircle,
  Target,
  ClipboardList,
} from "lucide-react";

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function MetricCard({
  title,
  value,
  icon: Icon,
  unit,
  description,
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} {unit}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

const quotesChartConfig = {
  won: {
    label: "Won",
    color: "var(--chart-2)",
  },
  lost: {
    label: "Lost",
    color: "var(--chart-1)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function DashboardMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: getDashboardMetrics,
  });

  const { data: quotesTimeSeries, isLoading: isLoadingQuotesChart } = useQuery({
    queryKey: ["quotes-time-series"],
    queryFn: () => getQuotesTimeSeries(90),
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted animate-pulse rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return <div>Failed to load metrics</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quotations Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quotations</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <MetricCard
            title="Total Quotations Value"
            unit="EGP"
            value={formatNumber(metrics.quotations.totalValue)}
            icon={FileText}
            description="Sum of all quotation values"
          />
          <MetricCard
            title="Won Quotations"
            value={metrics.quotations.won}
            icon={TrendingUp}
            description="Successfully won"
          />
          <MetricCard
            title="Lost Quotations"
            value={metrics.quotations.lost}
            icon={TrendingDown}
            description="Unsuccessful"
          />
          <MetricCard
            title="Pending Quotations"
            value={metrics.quotations.pending}
            icon={Clock}
            description="Awaiting outcome"
          />
          <MetricCard
            title="Won Quotations Value"
            unit="EGP"
            value={formatNumber(metrics.quotations.wonValue)}
            icon={TrendingUp}
            description="Total value of won quotations"
          />
          <MetricCard
            title="Lost Quotations Value"
            unit="EGP"
            value={formatNumber(metrics.quotations.lostValue)}
            icon={TrendingDown}
            description="Total value of lost quotations"
          />
          <MetricCard
            title="Pending Quotations Value"
            unit="EGP"
            value={formatNumber(metrics.quotations.pendingValue)}
            icon={Clock}
            description="Total value of pending quotations"
          />
        </div>
        {!isLoadingQuotesChart &&
          quotesTimeSeries &&
          quotesTimeSeries.length > 0 && (
            <ChartAreaInteractive
              data={quotesTimeSeries}
              config={quotesChartConfig}
              title="Number of Quotations Over Time"
              description="Total number of quotations grouped by outcome"
              dataKeys={["won", "lost", "pending"]}
              defaultTimeRange="90d"
              showTimeRangeSelector={true}
            />
          )}
      </div>

      {/* Projects & Companies Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Projects & Companies</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard
            title="Total Projects"
            value={metrics.projects.total}
            icon={Target}
            description="All projects"
          />
          <MetricCard
            title="Total Companies"
            value={metrics.companies.total}
            icon={Building2}
            description="All companies"
          />
        </div>
      </div>

      {/* Registrations Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Registrations</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Total Registrations"
            value={metrics.registrations.total}
            icon={ClipboardList}
            description="All registrations"
          />
          <MetricCard
            title="Consultant Registrations"
            value={metrics.registrations.consultant}
            icon={UserCheck}
            description="Consultant companies"
          />
          <MetricCard
            title="Under Review"
            value={metrics.registrations.underReview}
            icon={Eye}
            description="Registration status"
          />
          <MetricCard
            title="Verified"
            value={metrics.registrations.verified}
            icon={CheckCircle2}
            description="Registration status"
          />
          <MetricCard
            title="On Hold"
            value={metrics.registrations.onHold}
            icon={PauseCircle}
            description="Registration status"
          />
          <MetricCard
            title="Pursuing"
            value={metrics.registrations.pursuing}
            icon={Target}
            description="Registration status"
          />
        </div>
      </div>

      {/* RFQs Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">RFQs</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total RFQs"
            value={metrics.rfqs.total}
            icon={FileCheck}
            description="All RFQs"
          />
        </div>
      </div>
    </div>
  );
}
