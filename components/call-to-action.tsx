import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section id="pricing" className="scroll-mt-20 py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="bg-gradient-brand relative overflow-hidden rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-12 sm:py-16 md:py-20 text-center shadow-xl">
          {/* Decorative rings */}
          <div
            aria-hidden
            className="absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full border border-white/20 pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute -top-12 left-1/2 size-72 -translate-x-1/2 rounded-full border border-white/15 pointer-events-none"
          />
          <div className="relative">
            <h2 className="text-balance text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
              Your future self will thank you
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
              Free while in early access. Set up your notebooks once, and never
              lose a hard-won insight again.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
              <Button asChild size="lg" variant="secondary" className="rounded-xl px-6 text-sm sm:text-base font-semibold shadow-sm h-11 sm:h-12">
                <Link href="/signup">
                  Create Free Account
                  <ArrowRight className="size-4 ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-sm sm:text-base text-white hover:bg-white/10 hover:text-white rounded-xl px-6 h-11 sm:h-12"
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
