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

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

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
    // {
    //   name: "Argonaut Sales",
    //   logo: TrendingUp,
    //   plan: "Professional",
    // },
    // {
    //   name: "Argonaut Operations",
    //   logo: Briefcase,
    //   plan: "Standard",
    // },
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
          title: "Won Quotes",
          url: "/quotes?status=won",
        },
        {
          title: "Pending Quotes",
          url: "/quotes?status=pending",
        },
        {
          title: "Lost Quotes",
          url: "/quotes?status=lost",
        },
        {
          title: "Create Quote",
          url: "/quotes/new",
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
      title: "Analytics",
      url: "/analytics",
      icon: PieChart,
      items: [
        {
          title: "Quote Performance",
          url: "/analytics/quotes",
        },
        {
          title: "Company Overview",
          url: "/analytics/companies",
        },
        {
          title: "Project Status",
          url: "/analytics/projects",
        },
        {
          title: "Revenue Reports",
          url: "/analytics/revenue",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Users & Permissions",
          url: "/settings/users",
        },
        {
          title: "Company Settings",
          url: "/settings/company",
        },
        {
          title: "Currency & Rates",
          url: "/settings/currency",
        },
      ],
    },
  ],
  projects: [
    {
      name: "MEP Engineering",
      url: "/projects/mep",
      icon: Building2,
    },
    {
      name: "EPC Ventures",
      url: "/projects/epc",
      icon: Handshake,
    },
    {
      name: "Quality Assurance",
      url: "/projects/quality",
      icon: UserCheck,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
