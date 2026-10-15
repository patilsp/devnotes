import * as React from "react";

import { SearchForm } from "@/components/search-form";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getNotebooks } from "@/server/notebooks";
import { SidebarData } from "./sidebar-data";
import Link from "next/link";
import { DevNotesLogo, DevNotesWordmark } from "./logo";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const notebooks = await getNotebooks();

  const data = {
    navMain: [
      ...(notebooks.notebooks?.map((notebook) => ({
        title: notebook.name,
        url: `/dashboard/notebook/${notebook.id}`,
        items: notebook.notes.map((note) => ({
          title: note.title,
          url: `/dashboard/notebook/${notebook.id}/note/${note.id}`,
        })),
      })) ?? []),
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-3">
        <Link href="/dashboard" className="flex items-center gap-2 pl-1 py-1">
          <DevNotesLogo />
          <DevNotesWordmark className="text-xl" />
        </Link>

        <React.Suspense>
          <SearchForm />
        </React.Suspense>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-1">
        <SidebarData data={data} />
      </SidebarContent>

      <SidebarFooter className="border-t p-2.5">
        <Link
          href="/dashboard"
          className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-sidebar-accent"
        >
          <span className="font-medium">Command Palette</span>
          <kbd className="rounded border bg-muted/80 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            Ctrl+K
          </kbd>
        </Link>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
