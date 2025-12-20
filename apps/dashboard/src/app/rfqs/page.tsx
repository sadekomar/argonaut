"use client";

import { useQuery } from "@tanstack/react-query";
import { RfqsTable } from "./_components/rfqs-table";
import { readRfqsMetadata } from "./_utils/read-rfqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { CreateRfqModal } from "./_components/create-rfq-modal";

export default function RfqsPage() {
  const { data: metadata, isLoading: metadataLoading } = useQuery({
    queryKey: ["rfqs-metadata"],
    queryFn: readRfqsMetadata,
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">RFQs</h1>
        <CreateRfqModal />
      </div>
      <h1 className="mb-6 text-2xl font-bold">All RFQs</h1>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total RFQs</CardTitle>
          </CardHeader>
          <CardContent>
            {metadataLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-4xl font-bold">{metadata?.totalRfqs ?? 0}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>With Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            {metadataLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-4xl font-bold">
                {metadata?.rfqsWithQuotes ?? 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Received</CardTitle>
          </CardHeader>
          <CardContent>
            {metadataLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-4xl font-bold">
                {metadata?.rfqsReceived ?? 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            {metadataLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-4xl font-bold">{metadata?.rfqsPending ?? 0}</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>RFQs</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <RfqsTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
