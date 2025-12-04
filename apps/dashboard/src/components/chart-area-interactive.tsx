"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

interface ChartAreaInteractiveProps {
  data: Array<Record<string, any>>;
  config: ChartConfig;
  title: string;
  description: string;
  dataKeys: string[]; // Keys to display in the chart (e.g., ["won", "lost", "pending"])
  defaultTimeRange?: "7d" | "30d" | "90d";
  showTimeRangeSelector?: boolean;
}

export function ChartAreaInteractive({
  data,
  config,
  title,
  description,
  dataKeys,
  defaultTimeRange = "90d",
  showTimeRangeSelector = true,
}: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState<string>(defaultTimeRange);

  // Get the latest date from the data to use as reference
  const latestDate = React.useMemo(() => {
    if (data.length === 0) return new Date();
    const dates = data.map((item) => new Date(item.date as string));
    return new Date(Math.max(...dates.map((d) => d.getTime())));
  }, [data]);

  const filteredData = React.useMemo(() => {
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(latestDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return data.filter((item) => {
      const date = new Date(item.date as string);
      return date >= startDate;
    });
  }, [data, timeRange, latestDate]);

  // Generate unique gradient IDs based on data keys
  const gradientIds = React.useMemo(() => {
    return dataKeys.map(
      (key) => `fill${key.charAt(0).toUpperCase() + key.slice(1)}`
    );
  }, [dataKeys]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {showTimeRangeSelector && (
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={config}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {dataKeys.map((key, index) => {
                const gradientId = gradientIds[index];
                const colorVar = `var(--color-${key})`;
                return (
                  <linearGradient
                    key={gradientId}
                    id={gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={colorVar} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colorVar} stopOpacity={0.1} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {dataKeys.map((key, index) => {
              const gradientId = gradientIds[index];
              const colorVar = `var(--color-${key})`;
              return (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  fill={`url(#${gradientId})`}
                  stroke={colorVar}
                  stackId="a"
                />
              );
            })}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
