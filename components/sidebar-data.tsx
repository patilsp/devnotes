"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { ChevronRight, FileText, Folder, SearchX } from "lucide-react";
import { useQueryState } from "nuqs";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarDataProps {
  data: {
    navMain: {
      title: string;
      url: string;
      items: { title: string; url: string }[];
    }[];
  };
}

export function SidebarData({ data }: SidebarDataProps) {
  const [search] = useQueryState("search", { defaultValue: "" });
  const pathname = usePathname();

  const filteredData = data.navMain.filter((item) => {
    const notebookMatches = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const noteMatches = item.items.some((note) =>
      note.title.toLowerCase().includes(search.toLowerCase())
    );

    return notebookMatches || noteMatches;
  });

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        {search ? (
          <>
            <SearchX className="size-5 text-muted-foreground/60 mb-2" />
            <p className="text-xs text-muted-foreground">
              No notes matching &ldquo;{search}&rdquo;
            </p>
          </>
        ) : (
          <>
            <Folder className="size-5 text-muted-foreground/60 mb-2" />
            <p className="text-xs text-muted-foreground">No notebooks yet</p>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {filteredData.map((item) => {
        const isNotebookActive = pathname === item.url;

        return (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup className="py-1">
              <SidebarGroupLabel
                asChild
                className={`group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-xs font-medium tracking-tight rounded-md transition-colors ${
                  isNotebookActive ? "bg-sidebar-accent font-semibold" : ""
                }`}
              >
                <CollapsibleTrigger>
                  <span className="truncate">{item.title}</span>
                  {item.items.length > 0 && (
                    <ChevronRight className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0.5 mt-0.5">
                    {item.items.map((note) => {
                      const isNoteActive = pathname === note.url;

                      return (
                        <SidebarMenuItem key={note.url}>
                          <SidebarMenuButton
                            asChild
                            isActive={isNoteActive}
                            className={`h-8 text-xs transition-colors rounded-md ${
                              isNoteActive
                                ? "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Link href={note.url} className="flex items-center gap-2">
                              <FileText className={`size-3.5 shrink-0 ${isNoteActive ? "text-primary" : "text-muted-foreground/70"}`} />
                              <span className="truncate">{note.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        );
      })}
    </>
  );
}
