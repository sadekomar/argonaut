"use client";

import { useReadPeople, useGetPeopleMetadata } from "./_components/use-people";
import { PersonsTable } from "./persons-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddPersonModal } from "./_components/add-person-modal";
import { Suspense } from "react";

export default function PeopleAllPage() {
  const [
    { data: people, isPending },
    { data: peopleMetadata, isPending: peopleMetadataPending },
  ] = [
    useReadPeople({ perPage: 1000 }), // Fetch more people for stats
    useGetPeopleMetadata(),
  ];

  return (
    <>
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">People</h1>
          <AddPersonModal />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total People</CardTitle>
            </CardHeader>
            <CardContent>
              {peopleMetadataPending ? (
                <Skeleton className="h-10 w-10" />
              ) : (
                <p className="text-4xl font-bold">
                  {peopleMetadata?.totalPeople ?? 0}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Authors</CardTitle>
            </CardHeader>
            <CardContent>
              {peopleMetadata?.authors != undefined ? (
                <p className="text-4xl font-bold">{peopleMetadata.authors}</p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Persons</CardTitle>
            </CardHeader>
            <CardContent>
              {peopleMetadata?.contactPersons != undefined ? (
                <p className="text-4xl font-bold">
                  {peopleMetadata.contactPersons}
                </p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Internal</CardTitle>
            </CardHeader>
            <CardContent>
              {peopleMetadata?.internal != undefined ? (
                <p className="text-4xl font-bold">{peopleMetadata.internal}</p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>People</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense>
                <PersonsTable />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
