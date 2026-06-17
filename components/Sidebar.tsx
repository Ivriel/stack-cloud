"use client";
import { SIDEBAR_ITEMS, USER_ICON } from "@/lib/constants";
import { Layers } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Progress from "./Progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  fullName: string;
  fileSize: string;
  usedPercent: number;
}

const AppSidebar = ({ fullName, fileSize, usedPercent }: AppSidebarProps) => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-gray-100 bg-white [--sidebar-accent:var(--color-froly)] [--sidebar-accent-foreground:var(--color-white)]">
      {/* Logo */}
      <SidebarHeader className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <Layers className="w-9 h-9 text-froly" />
          <span className="font-semibold text-xl">UpThings</span>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_ITEMS.map(({ name, icon: Icon, url }) => {
                const isActive = pathname === url;
                return (
                  <SidebarMenuItem key={url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      size="lg"
                      className="rounded-md gap-3 font-medium text-gray-700"
                    >
                      <Link href={url}>
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Storage + user */}
      <SidebarFooter className="px-4 pb-4 gap-4">
        <div className="bg-froly rounded-xl px-4 pt-3 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Storage</span>
            <span className="text-white/80 text-xs font-medium">{usedPercent}% used</span>
          </div>
          <span className="text-white/80 text-xs mt-0.5 block">{fileSize} of 2 GB</span>
          <Progress percentage={usedPercent} />
        </div>

        <div className="flex items-center gap-3">
          <Image
            src={USER_ICON}
            alt="user avatar"
            width={38}
            height={38}
            className="rounded-full object-cover"
            unoptimized
          />
          <span className="font-medium text-gray-700 text-sm truncate">
            {fullName}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
