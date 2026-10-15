"use client";

import { Search } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";
import { useQueryState } from "nuqs";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });

  const handleOpenPalette = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  };

  return (
    <form {...props} onClick={handleOpenPalette}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative cursor-pointer">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search notes... (Ctrl+K)"
            className="pl-8 pr-12 cursor-pointer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-command-palette"));
              }
            }}
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground select-none">
            Ctrl K
          </kbd>
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
