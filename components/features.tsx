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
    <section id="features" className="scroll-mt-20 bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            Features
          </span>
          <h2 className="mt-3 text-balance text-4xl font-semibold lg:text-5xl">
            Built for how <span className="text-gradient-brand">developers</span> actually work
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Smart, flexible, and fast — DevNotes gives you everything you need to
            build a second brain that speaks your language.
          </p>
        </div>

        <div className="@min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16 @min-4xl:max-w-full">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
            >
              <Card className="group bg-background h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="bg-primary/10 ring-primary/15 mx-auto mb-4 flex size-12 items-center justify-center rounded-xl ring-1 transition-colors duration-300 group-hover:bg-primary group-hover:ring-primary">
                    <feature.icon className="text-primary size-6 transition-colors duration-300 group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-medium">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
