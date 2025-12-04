"use client";

import {
  GetRegistrationsResponse,
  useGetRegistrations,
  useGetRegistrationsMetadata,
} from "./_components/use-registrations";
import { RegistrationsTable } from "./registrations-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddRegistrationModal } from "./_components/add-registration-modal";

export default function RegistrationsPage() {
  const [
    { data: registrations, isPending },
    { data: registrationsMetadata, isPending: registrationsMetadataPending },
  ] = [
    useGetRegistrations({ perPage: 1000 }), // Fetch more registrations for potential future chart
    useGetRegistrationsMetadata(),
  ];

  return (
    <>
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Registrations</h1>
            <p className="text-muted-foreground mt-2">
              Manage company registrations and their status
            </p>
          </div>
          <AddRegistrationModal />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {registrationsMetadataPending ? (
                <Skeleton className="h-10 w-10" />
              ) : (
                <p className="text-4xl font-bold">
                  {registrationsMetadata?.totalRegistrations ?? 0}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Verified</CardTitle>
            </CardHeader>
            <CardContent>
              {registrationsMetadata?.verifiedRegistrations != undefined ? (
                <p className="text-4xl font-bold">
                  {registrationsMetadata.verifiedRegistrations}
                </p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              {registrationsMetadata?.underReviewRegistrations != undefined ? (
                <p className="text-4xl font-bold">
                  {registrationsMetadata.underReviewRegistrations}
                </p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>On Hold</CardTitle>
            </CardHeader>
            <CardContent>
              {registrationsMetadata?.onHoldRegistrations != undefined ? (
                <p className="text-4xl font-bold">
                  {registrationsMetadata.onHoldRegistrations}
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
              <CardTitle>Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <RegistrationsTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
