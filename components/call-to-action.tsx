import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section id="pricing" className="scroll-mt-20 py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="bg-gradient-brand relative overflow-hidden rounded-3xl px-8 py-16 text-center shadow-xl md:py-24">
          {/* Decorative rings */}
          <div
            aria-hidden
            className="absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full border border-white/20"
          />
          <div
            aria-hidden
            className="absolute -top-12 left-1/2 size-72 -translate-x-1/2 rounded-full border border-white/15"
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-semibold text-white md:text-5xl">
              Your future self will thank you
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-white/85">
              Free while in early access. Set up your notebooks once, and never
              lose a hard-won insight again.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="rounded-xl px-6 text-base">
                <Link href="/signup">
                  Create Free Account
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-base text-white hover:bg-white/10 hover:text-white rounded-xl px-6"
              >
                <Link href="/login">I already have one</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
