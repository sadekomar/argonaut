"use client";

import {
  GetCompaniesResponse,
  useGetCompanies,
  useGetCompaniesMetadata,
} from "./_components/use-companies";
import { CompaniesTable } from "./companies-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompaniesPage() {
  const [
    { data: companies, isPending },
    { data: companiesMetadata, isPending: companiesMetadataPending },
  ] = [
    useGetCompanies({ perPage: 1000 }), // Fetch more companies for potential future use
    useGetCompaniesMetadata(),
  ];

  return (
    <>
      <main className="flex-1 p-8">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-5">
          <Card>
            <CardHeader>
              <CardTitle>Total Companies</CardTitle>
            </CardHeader>
            <CardContent>
              {companiesMetadataPending ? (
                <Skeleton className="h-10 w-10" />
              ) : (
                <p className="text-4xl font-bold">
                  {companiesMetadata?.totalCompanies ?? 0}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              {companiesMetadata?.suppliers != undefined ? (
                <p className="text-4xl font-bold">
                  {companiesMetadata.suppliers}
                </p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Clients</CardTitle>
            </CardHeader>
            <CardContent>
              {companiesMetadata?.clients != undefined ? (
                <p className="text-4xl font-bold">
                  {companiesMetadata.clients}
                </p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contractors</CardTitle>
            </CardHeader>
            <CardContent>
              {companiesMetadata?.contractors != undefined ? (
                <p className="text-4xl font-bold">
                  {companiesMetadata.contractors}
                </p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Consultants</CardTitle>
            </CardHeader>
            <CardContent>
              {companiesMetadata?.consultants != undefined ? (
                <p className="text-4xl font-bold">
                  {companiesMetadata.consultants}
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
              <CardTitle>Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <CompaniesTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
