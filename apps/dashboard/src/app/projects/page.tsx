"use client";

import {
  GetProjectsResponse,
  useReadProjects,
  useGetProjectsMetadata,
} from "./_components/use-projects";
import { ProjectsTable } from "./_components/projects-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function ProjectsPage() {
  const [
    { data: projects, isPending },
    { data: projectsMetadata, isPending: projectsMetadataPending },
  ] = [
    useReadProjects({ perPage: 1000 }), // Fetch more projects for potential future use
    useGetProjectsMetadata(),
  ];

  return (
    <>
      <main className="flex-1 p-8">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsMetadataPending ? (
                <Skeleton className="h-10 w-10" />
              ) : (
                <p className="text-4xl font-bold">
                  {projectsMetadata?.totalProjects ?? 0}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>In Hand</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsMetadata?.inHandProjects != undefined ? (
                <p className="text-4xl font-bold">
                  {projectsMetadata.inHandProjects}
                </p>
              ) : (
                <Skeleton className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tender</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsMetadata?.tenderProjects != undefined ? (
                <p className="text-4xl font-bold">
                  {projectsMetadata.tenderProjects}
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
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense>
                <ProjectsTable />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
