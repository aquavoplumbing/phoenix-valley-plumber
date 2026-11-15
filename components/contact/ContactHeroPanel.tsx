import type { SiteConfig } from "@/lib/config";
import type { OpenStatus } from "@/lib/hours";
import { CallButton } from "@/components/ui/CallButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ClockIcon } from "@/components/icons/Icons";
import styles from "./ContactHeroPanel.module.css";

interface ContactHeroPanelProps {
  site: SiteConfig;
  initialStatus: OpenStatus;
}

export function ContactHeroPanel({ site, initialStatus }: ContactHeroPanelProps) {
  const schedule = site.hours.schedule;

  const days: Array<{ day: string; key: keyof typeof schedule }> = [
    { day: "Monday", key: "mon" },
    { day: "Tuesday", key: "tue" },
    { day: "Wednesday", key: "wed" },
    { day: "Thursday", key: "thu" },
    { day: "Friday", key: "fri" },
    { day: "Saturday", key: "sat" },
    { day: "Sunday", key: "sun" },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.eyebrowRow}>
        <span className={styles.primaryTag}>Fastest Service</span>
        <StatusBadge hours={site.hours} initialStatus={initialStatus} variant="dark" />
      </div>

      <h2 className={styles.title}>Speak With Dispatch Now</h2>
      <p className={styles.subtitle}>
        The fastest way to reach a licensed plumber is always to call. Local dispatch answers directly—no call centers or automated trees.
      </p>

      {/* Main Call Action */}
      <div className={styles.callWrapper}>
        <CallButton
          display={site.phone.display}
          e164={site.phone.e164}
          location="contact-hero"
          size="lg"
        />
        <p className={styles.callMicro}>
          Tap to call · Calls are answered during the hours shown below.
        </p>
      </div>

      {/* Hours Table */}
      <div className={styles.hoursCard}>
        <div className={styles.hoursHeader}>
          <ClockIcon size={16} />
          <span className={styles.hoursTitle}>Valley Dispatch Hours</span>
        </div>

        <ul className={styles.hoursList}>
          {days.map(({ day, key }) => {
            const range = schedule[key];
            const isSunday = key === "sun";
            const formatted = isSunday && !range ? "Emergency Calls Only" : range ? `${range[0]} – ${range[1]}` : "Closed";
            return (
              <li key={day} className={styles.hoursRow}>
                <span className={styles.dayLabel}>{day}</span>
                <span
                  className={`${styles.timeLabel} ${
                    isSunday && !range
                      ? styles.emergencyLabel
                      : !range
                      ? styles.closedLabel
                      : ""
                  }`}
                >
                  {formatted}
                </span>
              </li>
            );
          })}
        </ul>

        {!site.hours.is24x7 ? (
          <div className={styles.afterHoursBox}>
            <p className={styles.afterHoursTitle}>Sunday &amp; After-Hours Guidance:</p>
            <p className={styles.afterHoursText}>
              On Sundays, our dispatch team accepts emergency calls only for active flooding, burst pipes, and sewer backups. Outside of dispatch hours, please leave a message using the inquiry form. If you smell natural gas, evacuate immediately and call 911 or Southwest Gas at 877-860-6020.
            </p>
          </div>
        ) : null}
      </div>

      {/* Other Configured Channels (Section 3, Rule 5: ONLY when configured) */}
      {(site.sms || site.contactEmail || site.tty) && (
        <div className={styles.otherChannels}>
          <p className={styles.otherChannelsTitle}>Other Ways to Reach Us:</p>
          <ul className={styles.channelsList}>
            {site.sms ? (
              <li className={styles.channelItem}>
                <span>Text Message:</span>
                <a
                  href={`sms:${site.phone.e164}`}
                  className={styles.channelLink}
                  data-track-sms="contact-page"
                >
                  Send SMS to {site.phone.display}
                </a>
              </li>
            ) : null}
            {site.contactEmail ? (
              <li className={styles.channelItem}>
                <span>Email:</span>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className={styles.channelLink}
                  data-track-email="contact-page"
                >
                  {site.contactEmail}
                </a>
              </li>
            ) : null}
            {site.tty ? (
              <li className={styles.channelItem}>
                <span>TTY / Telecommunications Relay:</span>
                <span>{site.tty} (Arizona Relay 711)</span>
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  );
}
