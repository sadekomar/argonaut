"use client";

import { useQuery } from "@tanstack/react-query";
import { RfqsTable } from "./_components/rfqs-table";
import { readRfqsMetadata } from "./_utils/read-rfqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RfqsPage() {
  const { data: metadata, isLoading: metadataLoading } = useQuery({
    queryKey: ["rfqs-metadata"],
    queryFn: readRfqsMetadata,
  });

  return (
    <div className="container mx-auto py-10">
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

      <Card>
        <CardHeader>
          <CardTitle>RFQs</CardTitle>
        </CardHeader>
        <CardContent>
          <RfqsTable />
        </CardContent>
      </Card>
    </div>
  );
}
