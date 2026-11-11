import type { SiteConfig } from "@/lib/config";
import { CallButton } from "@/components/ui/CallButton";
import { ScrollReveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./HowItWorks.module.css";

export function HowItWorks({ site }: { site: SiteConfig }) {
  const steps = [
    {
      num: "1",
      title: "Call us",
      body: "Tell us what's happening. We'll ask a few quick questions.",
    },
    {
      num: "2",
      title: "Get an arrival window",
      body: "We'll tell you when a licensed plumber can be there.",
    },
    {
      num: "3",
      title: "Fix it right",
      body: "Your plumber explains the problem and the options before starting work.",
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="how-it-works-heading">
      <div className="container">
        <SectionHeading
          id="how-it-works-heading"
          eyebrow="Simple Call-First Process"
          title="Fast Plumbing Help in 3 Simple Steps"
          subtitle="No long forms or back-and-forth emails. One phone call starts the dispatch process."
        />

        <ScrollReveal className={styles.timelineWrap}>
          <svg
            className={styles.connectorSvg}
            viewBox="0 0 800 12"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="40"
              y1="6"
              x2="760"
              y2="6"
              stroke="#1E9BD7"
              strokeWidth="3"
              strokeDasharray="10 10"
              className={styles.connectorLine}
            />
          </svg>

          <ol className={styles.steps}>
            {steps.map((step) => (
              <li key={step.num} className={styles.step}>
                <div className={styles.badge}>{step.num}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </ScrollReveal>

        <div className={styles.ctaRow}>
          <CallButton
            display={site.phone.display}
            e164={site.phone.e164}
            location="how-it-works"
            size="lg"
          />
        </div>
      </div>
    </section>
  );
}

