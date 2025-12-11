"use client";

import {
  GetFollowUpsResponse,
  useGetFollowUps,
  useGetFollowUpsMetadata,
} from "./_components/use-follow-ups";
import { FollowUpsTable } from "./follow-ups-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { generateEmptyMonths } from "@/lib/utils";
import { Suspense, useState } from "react";
import { CreateFollowUpModal } from "./_components/create-follow-up-modal";

export default function FollowUpsPage() {
  const [
    { data: followUps, isPending },
    { data: followUpsMetadata, isPending: followUpsMetadataPending },
  ] = [
    useGetFollowUps({ perPage: 1000 }), // Fetch more follow-ups for chart
    useGetFollowUpsMetadata(),
  ];
  const [isAddFollowUpModalOpen, setIsAddFollowUpModalOpen] = useState(false);

  const chartData = getChartData(followUps);

  return (
    <>
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Follow ups</h1>
          <CreateFollowUpModal
            open={isAddFollowUpModalOpen}
            onOpenChange={setIsAddFollowUpModalOpen}
          />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Follow-Ups</CardTitle>
            </CardHeader>
            <CardContent>
              {followUpsMetadataPending ? (
                <Skeleton className="h-10 w-10" />
              ) : (
                <p className="text-4xl font-bold">
                  {followUpsMetadata?.totalFollowUps ?? 0}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              {followUpsMetadata?.followUpsThisMonth != undefined ? (
                <p className="text-4xl font-bold">
                  {followUpsMetadata.followUpsThisMonth}
                </p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              {followUpsMetadata?.followUpsThisWeek != undefined ? (
                <p className="text-4xl font-bold">
                  {followUpsMetadata.followUpsThisWeek}
                </p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Follow-Ups</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense>
                <FollowUpsTable />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

function getChartData(
  followUps: GetFollowUpsResponse | undefined
): { date: string; followUps: number }[] {
  const allMonths = generateEmptyMonths("2023-06-01", "2025-06-01");

  const chartData = followUps?.data?.reduce(
    (acc: Record<string, number>, followUp: { createdAt: Date | string }) => {
      const date = new Date(followUp.createdAt);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const key = `${year}-${month}-01`;

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const formattedChartData: { date: string; followUps: number }[] =
    allMonths.map((month) => ({
      date: month,
      followUps: chartData?.[month] || 0,
    }));

  return formattedChartData;
}
