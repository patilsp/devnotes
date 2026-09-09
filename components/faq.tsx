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
    <section id="faq" className="scroll-mt-20 bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            FAQ
          </span>
          <h2 className="mt-3 text-balance text-4xl font-semibold lg:text-5xl">
            Questions, answered
          </h2>
        </div>

        <div className="mt-8 space-y-3 md:mt-12">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group bg-card rounded-xl border shadow-xs transition-shadow open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="text-muted-foreground size-5 shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
