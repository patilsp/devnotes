"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Blocks,
  CloudCog,
  Code,
  GitBranch,
  NotebookPen,
  Search,
} from "lucide-react";
import { ReactNode } from "react";
import { motion } from "motion/react";

const features = [
  {
    icon: NotebookPen,
    title: "Quick Capture",
    description:
      "Jot ideas the moment they strike with keyboard-first input and zero-friction note creation.",
  },
  {
    icon: Code,
    title: "Code-First Editor",
    description:
      "Syntax-highlighted snippets, markdown, and fenced code blocks rendered exactly like your IDE.",
  },
  {
    icon: Blocks,
    title: "Notebooks & Nesting",
    description:
      "Group notes into notebooks per project, stack, or sprint — everything stays where you expect it.",
  },
  {
    icon: Search,
    title: "Instant Search",
    description:
      "Find any note in milliseconds across every notebook, so knowledge is never lost twice.",
  },
  {
    icon: GitBranch,
    title: "Version Awareness",
    description:
      "Git-style history on notes keeps track of what changed, when, and why it mattered.",
  },
  {
    icon: CloudCog,
    title: "Private & Synced",
    description:
      "Your second brain syncs securely across devices while staying private to your account.",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-zinc-50/70 py-16 md:py-28 dark:bg-zinc-950/30 border-y border-border/40">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase">
            Features
          </span>
          <h2 className="mt-3 text-balance text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Built for how <span className="text-gradient-brand">developers</span> actually work
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed">
            Smart, flexible, and fast — DevNotes gives you everything you need to
            build a second brain that speaks your language.
          </p>
        </div>

        <div className="mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
              className="h-full"
            >
              <Card className="group bg-card h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 text-center flex flex-col justify-between">
                <CardHeader className="pb-2 pt-6">
                  <div className="bg-primary/10 ring-primary/15 mx-auto mb-4 flex size-12 items-center justify-center rounded-xl ring-1 transition-colors duration-200 group-hover:bg-primary group-hover:ring-primary">
                    <feature.icon className="text-primary size-5 sm:size-6 transition-colors duration-200 group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-base tracking-tight">{feature.title}</h3>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
