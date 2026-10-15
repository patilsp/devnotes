import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";
import { Logout } from "./logout";
import { ModeToggle } from "./mode-toggle";
import { Fragment } from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  breadcrumbs: {
    label: string;
    href: string;
  }[];
}

export function PageWrapper({ children, breadcrumbs }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md md:px-6 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger className="-ml-1" />

          <div className="h-4 w-px bg-border hidden sm:block" />

          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="text-xs sm:text-sm font-medium">
              {breadcrumbs.map((breadcrumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <Fragment key={breadcrumb.label}>
                    <BreadcrumbItem className="min-w-0">
                      {isLast ? (
                        <BreadcrumbPage className="max-w-[140px] sm:max-w-[240px] md:max-w-none truncate text-foreground font-semibold">
                          {breadcrumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={breadcrumb.href}
                          className="max-w-[100px] sm:max-w-[160px] md:max-w-none truncate text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator className="text-muted-foreground/40" />}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ModeToggle />
          <Logout />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {children}
      </div>
    </div>
  );
}
