import { AppSidebar } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarSkeleton } from "@/components/skeletons/sidebar-skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Real session validation (the proxy only checks cookie existence).
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <CommandPalette />
      <Suspense fallback={<SidebarSkeleton />}>
        <AppSidebar />
      </Suspense>
      <main className="flex-1 min-w-0">{children}</main>
    </SidebarProvider>
  );
}
