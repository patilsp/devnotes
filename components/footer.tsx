import Link from "next/link";
import { DevNotesLogo, DevNotesWordmark } from "./logo";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Workflow", href: "#workflow" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Sign Up", href: "/signup" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto] md:gap-20">
          <div>
            <Link href="/" aria-label="DevNotes home" className="flex items-center gap-2">
              <DevNotesLogo />
              <DevNotesWordmark />
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm">
              The developer notebook for capturing snippets, decisions, and
              docs — organized in notebooks that scale with you.
            </p>
          </div>

          {footerLinks.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-semibold">{column.heading}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-muted-foreground mt-12 border-t pt-6 text-center text-sm">
          © {new Date().getFullYear()} DevNotes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
