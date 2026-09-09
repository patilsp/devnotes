import { cn } from "@/lib/utils";

/** DevNotes mark: a notebook page with inline code chevrons. */
export function DevNotesLogo({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-8", className)}
      {...props}
    >
      <rect x="3" y="2" width="26" height="28" rx="6" className="fill-primary" />
      <path
        d="M10.5 12.5 7.5 16l3 3.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 12.5 24.5 16l-3 3.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 20.5l4-9"
        stroke="white"
        strokeOpacity="0.85"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M9 6.5h6"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** DevNotes wordmark: "Dev" in foreground color + "Notes" in brand gradient. */
export function DevNotesWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-2xl font-bold tracking-tight text-foreground",
        className
      )}
    >
      Dev
      <span className="text-gradient-brand">Notes</span>
    </span>
  );
}
