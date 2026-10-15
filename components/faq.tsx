import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is DevNotes free to use?",
    answer:
      "Yes. Create an account with email or Google and start writing right away — notebooks and notes are unlimited while we're in early access.",
  },
  {
    question: "Can I use code blocks and markdown?",
    answer:
      "Absolutely. The editor is built for developers: fenced code blocks, markdown formatting, and syntax highlighting work out of the box.",
  },
  {
    question: "How do notebooks work?",
    answer:
      "Notebooks are containers for related notes — one per project, feature, or topic. The sidebar keeps every notebook and its notes one click away.",
  },
  {
    question: "Is my data private?",
    answer:
      "Your notes belong to your account alone. Authentication is handled by battle-tested session-based auth, and notes are only ever visible to you.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-zinc-50/70 py-16 md:py-28 dark:bg-zinc-950/30 border-t border-border/40">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase">
            FAQ
          </span>
          <h2 className="mt-3 text-balance text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Questions, answered
          </h2>
        </div>

        <div className="mt-8 space-y-3 md:mt-12">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group bg-card rounded-xl border shadow-xs transition-all duration-200 open:shadow-md hover:border-primary/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 font-medium [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl text-sm sm:text-base">
                <span>{faq.question}</span>
                <ChevronDown className="text-muted-foreground size-4 sm:size-5 shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="text-muted-foreground px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
