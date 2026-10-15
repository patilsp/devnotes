import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "./header";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
    },
  },
};

const containerVariants = {
  container: {
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.75,
      },
    },
  },
  ...transitionVariants,
};

const previewStats = [
  { label: "Snippets saved", value: "12.4k" },
  { label: "Notebooks", value: "38" },
  { label: "Sync latency", value: "0.4s" },
];

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <section className="relative">
          {/* Ambient background: brand glow + fading grid */}
          <div aria-hidden className="bg-brand-glow absolute inset-x-0 top-0 -z-10 h-[560px]" />
          <div aria-hidden className="bg-grid-fade absolute inset-x-0 top-0 -z-10 h-[560px]" />

          <div className="relative pt-28 md:pt-36">
            <div className="mx-auto max-w-5xl px-6">
              <div className="lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={containerVariants}>
                  <Link
                    href="/signup"
                    className="group bg-background/60 ring-border mb-6 flex w-fit max-w-full items-center gap-2 rounded-full border p-1 pr-3 text-xs sm:text-sm shadow-xs backdrop-blur transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="bg-gradient-brand flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-full text-white">
                      <Sparkles className="size-3 sm:size-3.5" />
                    </span>
                    <span className="text-muted-foreground truncate">
                      Now with instant markdown + code blocks
                    </span>
                    <ArrowRight className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-4 max-w-3xl text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight"
                >
                  Notes that think in code.
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="text-muted-foreground mt-5 max-w-2xl text-pretty text-base sm:text-lg md:text-xl leading-relaxed"
                >
                  DevNotes is the developer notebook built for shipping — capture
                  snippets, document architecture, and organize your second brain
                  without breaking flow.
                </TextEffect>

                <AnimatedGroup variants={containerVariants} className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3">
                  <div className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                    <Button asChild size="lg" className="rounded-xl px-5 sm:px-6 text-sm sm:text-base h-11 sm:h-12 shadow-sm">
                      <Link href="/dashboard">
                        <span className="text-nowrap">Start Writing — It&apos;s Free</span>
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                  <Button asChild size="lg" variant="outline" className="rounded-xl px-5 sm:px-6 text-sm sm:text-base h-11 sm:h-12">
                    <Link href="#features">
                      <Terminal className="size-4" />
                      <span>See Features</span>
                    </Link>
                  </Button>
                </AnimatedGroup>

                {/* Floating app preview card */}
                <AnimatedGroup variants={containerVariants}>
                  <div className="relative mt-12 sm:mt-16 md:mt-24">
                    <div
                      aria-hidden
                      className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-40% pointer-events-none"
                    />
                    <div className="bg-background/85 ring-border inset-shadow-2xs relative mx-auto max-w-4xl overflow-hidden rounded-2xl border p-3 sm:p-4 shadow-xl backdrop-blur ring-1">
                      {/* Fake editor chrome */}
                      <div className="bg-muted/60 flex items-center gap-2 border-b px-2.5 pb-2.5 sm:px-3 sm:pb-3">
                        <span className="bg-destructive/70 size-2.5 rounded-full" />
                        <span className="bg-chart-4 size-2.5 rounded-full" />
                        <span className="bg-chart-5 size-2.5 rounded-full" />
                        <span className="text-muted-foreground ml-2 sm:ml-3 font-mono text-[11px] sm:text-xs truncate">
                          ~/notes/architecture.md
                        </span>
                      </div>
                      {/* Fake note content */}
                      <div className="space-y-3 p-3.5 sm:p-5 font-mono text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-[11px] font-medium">
                            # Decision
                          </span>
                          <span className="text-muted-foreground text-[11px]">edited just now</span>
                        </div>
                        <div className="bg-foreground/80 h-2.5 sm:h-3 w-3/4 rounded" />
                        <div className="bg-foreground/25 h-2.5 sm:h-3 w-full rounded" />
                        <div className="bg-foreground/25 h-2.5 sm:h-3 w-5/6 rounded" />
                        <div className="text-primary/90 rounded border border-dashed border-primary/20 bg-primary/[0.03] p-2.5 sm:p-3 text-[11px] sm:text-xs overflow-x-auto">
                          <code>const cache = new LRUCache(&#123; max: 500 &#125;);</code>
                        </div>
                        <div className="bg-foreground/25 h-2.5 sm:h-3 w-2/3 rounded" />
                      </div>

                      {/* Stats strip */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t pt-3 sm:pt-4 px-2">
                        {previewStats.map((stat) => (
                          <div key={stat.label} className="text-center">
                            <div className="text-base sm:text-lg font-semibold tracking-tight">{stat.value}</div>
                            <div className="text-muted-foreground text-[11px] sm:text-xs truncate">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedGroup>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
