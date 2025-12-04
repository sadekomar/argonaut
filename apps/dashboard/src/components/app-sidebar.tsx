"use client";

import * as React from "react";
import {
  Building2,
  FileText,
  Handshake,
  PieChart,
  Settings2,
  Users,
  ClipboardList,
  TrendingUp,
  Briefcase,
  UserCheck,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { usePathname } from "next/navigation";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

const data = {
  user: {
    name: "Mohamed Shoukry",
    email: "mohamed@argonaut.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Argonaut Engineering",
      logo: Building2,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Quotes",
      url: "/quotes",
      icon: FileText,
      isActive: true,
      items: [
        {
          title: "All Quotes",
          url: "/quotes",
        },
        {
          title: "Follow ups",
          url: "/follow-ups",
        },
        {
          title: "Won Quotes",
          url: "/quotes?quoteOutcome=WON",
        },
        {
          title: "Pending Quotes",
          url: "/quotes?quoteOutcome=PENDING",
        },
        {
          title: "Lost Quotes",
          url: "/quotes?quoteOutcome=LOST",
        },
      ],
    },
    {
      title: "RFQs",
      url: "/rfqs",
      icon: ClipboardList,
      items: [
        {
          title: "All RFQs",
          url: "/rfqs",
        },
        {
          title: "Open RFQs",
          url: "/rfqs?status=open",
        },
        {
          title: "Create RFQ",
          url: "/rfqs/new",
        },
      ],
    },
    {
      title: "Companies",
      url: "/companies",
      icon: Building2,
      items: [
        {
          title: "All Companies",
          url: "/companies",
        },
        {
          title: "Clients",
          url: "/companies?type=client",
        },
        {
          title: "Suppliers",
          url: "/companies?type=supplier",
        },
        {
          title: "Contractors",
          url: "/companies?type=contractor",
        },
        {
          title: "Consultants",
          url: "/companies?type=consultant",
        },
        {
          title: "Add Company",
          url: "/companies/new",
        },
      ],
    },
    {
      title: "People",
      url: "/people",
      icon: Users,
      items: [
        {
          title: "All People",
          url: "/people",
        },
        {
          title: "Internal Team",
          url: "/people?type=internal",
        },
        {
          title: "External Contacts",
          url: "/people?type=external",
        },
        {
          title: "Add Person",
          url: "/people/new",
        },
      ],
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Briefcase,
      items: [
        {
          title: "All Projects",
          url: "/projects",
        },
        {
          title: "In Hand",
          url: "/projects?status=in_hand",
        },
        {
          title: "Tenders",
          url: "/projects?status=tender",
        },
        {
          title: "Add Project",
          url: "/projects/new",
        },
      ],
    },
    {
      title: "Registrations",
      url: "/registrations",
      icon: UserCheck,
      items: [
        {
          title: "All Registrations",
          url: "/registrations",
        },
        {
          title: "Verified",
          url: "/registrations?registrationStatus=VERIFIED",
        },
        {
          title: "Under Review",
          url: "/registrations?registrationStatus=UNDER_REVIEW",
        },
        {
          title: "On Hold",
          url: "/registrations?registrationStatus=ON_HOLD",
        },
        {
          title: "Pursuing",
          url: "/registrations?registrationStatus=PURSUING",
        },
      ],
    },
    {
      title: "Resources",
      url: "/resources",
      icon: FileText,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return !isLoginPage ? (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center justify-center min-h-[2.5rem] group-data-[collapsible=icon]:hidden"
        >
          <Image
            src="/argonaut-horizontal-small.webp"
            alt="Argonaut"
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  ) : null;
}

export function BreadcrumbsAndTrigger() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  return !isLoginPage ? (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
      </div>
    </header>
  ) : null;
}
