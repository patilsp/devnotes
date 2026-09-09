"use client";

import { motion } from "motion/react";
import { FilePlus2, FolderTree, Rocket } from "lucide-react";

const steps = [
  {
    icon: FilePlus2,
    step: "01",
    title: "Capture",
    description:
      "Open DevNotes and type. Snippets, decisions, and links land in a note instantly — no folders to untangle first.",
  },
  {
    icon: FolderTree,
    step: "02",
    title: "Organize",
    description:
      "Drag notes into project notebooks. Tag by stack, sprint, or mood — your structure stays as flexible as your codebase.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Ship",
    description:
      "When it's time to build, everything you documented is one search away. Less re-Googling, more shipping.",
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="scroll-mt-20 py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            Workflow
          </span>
          <h2 className="mt-3 text-balance text-4xl font-semibold lg:text-5xl">
            From spark to <span className="text-gradient-brand">shipped</span> in three steps
          </h2>
        </div>

        <div className="relative mt-8 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
          {/* Connector line (desktop) */}
          <div
            aria-hidden
            className="from-border via-primary/40 to-border absolute top-8 right-[16%] left-[16%] hidden h-px bg-gradient-to-r md:block"
          />
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
              className="relative text-center"
            >
              <div className="bg-background ring-border relative z-10 mx-auto flex size-16 items-center justify-center rounded-2xl shadow-md ring-1">
                <step.icon className="text-primary size-7" />
                <span className="bg-gradient-brand absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-white">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mx-auto mt-2 max-w-xs text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
