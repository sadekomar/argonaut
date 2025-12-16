"use client";

import * as React from "react";
import {
  Building2,
  FileText,
  Users,
  ClipboardList,
  Home,
  DollarSign,
  MessageCircle,
  Folder,
  BadgeCheck,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { usePathname } from "next/navigation";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const data = {
  teams: [
    {
      name: "Argonaut Engineering",
      logo: Building2,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Quotes",
      url: "/quotes",
      icon: DollarSign,
    },
    {
      title: "Follow ups",
      url: "/follow-ups",
      icon: MessageCircle,
    },
    {
      title: "RFQs",
      url: "/rfqs",
      icon: ClipboardList,
    },
    {
      title: "Companies",
      url: "/companies",
      icon: Building2,
    },
    {
      title: "People",
      url: "/people",
      icon: Users,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Folder,
    },
    {
      title: "Registrations",
      url: "/registrations",
      icon: BadgeCheck,
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
  const isLoginPage = pathname === "/login" || pathname === "/signup";
  const { data: session } = authClient.useSession();

  // Get user data from session or use fallback
  const user = React.useMemo(() => {
    if (session?.user) {
      return {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image || "/avatars/user.jpg",
      };
    }
    // Fallback for when session is loading or not available
    return {
      name: "User",
      email: "",
      avatar: "/avatars/user.jpg",
    };
  }, [session]);

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
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  ) : null;
}
