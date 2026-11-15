"use client";

import { useRef, useState } from "react";
import { contactFormSchema, type ContactFormData } from "@/lib/contact-schema";
import { trackGa4Event } from "@/lib/analytics";
import { CallButton } from "@/components/ui/CallButton";
import { AlertCircleIcon, CheckIcon } from "@/components/icons/Icons";
import styles from "./ContactForm.module.css";

interface ContactFormProps {
  brand: string;
  phoneDisplay: string;
  phoneE164: string;
  services: Array<{ slug: string; name: string }>;
}

export function ContactForm({
  brand,
  phoneDisplay,
  phoneE164,
  services,
}: ContactFormProps) {
  const [mountedTime] = useState<number>(() => Date.now());
  const [formStarted, setFormStarted] = useState<boolean>(false);
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const serviceSelectRef = useRef<HTMLSelectElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const consentInputRef = useRef<HTMLInputElement>(null);

  const consentDisclaimerText = `I agree that ${brand} may contact me by phone, text or email about this request. Message and data rates may apply. Consent is not a condition of service.`;

  const handleFieldFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      trackGa4Event("form_start", {
        form_name: "contact_inquiry",
        page_path: "/contact/",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: (formData.get("name") as string)?.trim() || "",
      phone: (formData.get("phone") as string)?.trim() || "",
      email: (formData.get("email") as string)?.trim() || "",
      service: (formData.get("service") as string)?.trim() || "",
      cityOrZip: (formData.get("cityOrZip") as string)?.trim() || "",
      message: (formData.get("message") as string)?.trim() || "",
      isEmergency: isEmergency,
      consent: consentChecked,
      consentText: consentDisclaimerText,
      timestamp: mountedTime,
      hp_company: (formData.get("hp_company") as string) || "",
    };

    // Validate on client using shared Zod schema
    const validation = contactFormSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof ContactFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);

      // Track validation error (type only, no PII)
      trackGa4Event("form_submit_error", {
        form_name: "contact_inquiry",
        error_type: "client_validation",
        error_count: Object.keys(fieldErrors).length,
      });

      // Move focus to first invalid field
      if (fieldErrors.name) nameInputRef.current?.focus();
      else if (fieldErrors.phone) phoneInputRef.current?.focus();
      else if (fieldErrors.service) serviceSelectRef.current?.focus();
      else if (fieldErrors.cityOrZip) cityInputRef.current?.focus();
      else if (fieldErrors.email) emailInputRef.current?.focus();
      else if (fieldErrors.message) messageInputRef.current?.focus();
      else if (fieldErrors.consent) consentInputRef.current?.focus();

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rawData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setGeneralError(result.message || "Unable to send message. Please call us directly.");
        }
        trackGa4Event("form_submit_error", {
          form_name: "contact_inquiry",
          error_type: response.status === 429 ? "rate_limited" : "server_error",
        });
        setIsSubmitting(false);
        return;
      }

      // Success
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Track successful submission without PII
      trackGa4Event("form_submit_success", {
        form_name: "contact_inquiry",
        service_requested: rawData.service,
        is_emergency: isEmergency ? 1 : 0,
      });

      // Scroll to confirmation and focus
      setTimeout(() => {
        successRef.current?.focus();
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    } catch {
      setIsSubmitting(false);
      setGeneralError("A network error occurred. Please call our dispatch team directly.");
      trackGa4Event("form_submit_error", {
        form_name: "contact_inquiry",
        error_type: "network_exception",
      });
    }
  };

  if (submitSuccess) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className={styles.successCard}
        aria-live="assertive"
        role="status"
      >
        <div className={styles.successIcon} aria-hidden="true">
          <CheckIcon size={28} />
        </div>
        <h3 className={styles.successTitle}>Message Sent Successfully</h3>
        <p className={styles.successBody}>
          Thank you. Our dispatch staff reviews messages during regular business hours and will reach out using the phone or email you provided.
        </p>

        <div className={styles.successCallBox}>
          <p className={styles.successCallTitle}>Need Help Sooner?</p>
          <p className={styles.successCallSub}>
            If your schedule changed or you have an urgent water issue, calling is always faster:
          </p>
          <div className={styles.successCallBtn}>
            <CallButton
              display={phoneDisplay}
              e164={phoneE164}
              location="contact-form-success"
              size="lg"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.headerBlock}>
        <span className={styles.subBadge}>Non-Urgent Written Inquiries</span>
        <h2 id="contact-form-heading" className={styles.heading}>
          Can&apos;t call? Send a message.
        </h2>
        <p className={styles.subtext}>
          Fill out the details below. We read inquiries during business hours and reply by your chosen method.
        </p>
      </div>

      {generalError ? (
        <div className={styles.generalAlert} role="alert" aria-live="polite">
          <AlertCircleIcon size={18} />
          <span>{generalError}</span>
        </div>
      ) : null}

      <form
        ref={formRef}
        method="POST"
        action="/api/contact"
        onSubmit={handleSubmit}
        className={styles.form}
        noValidate
        aria-labelledby="contact-form-heading"
      >
        {/* Anti-Spam Time-Trap Hidden Input */}
        <input type="hidden" name="timestamp" value={mountedTime} />

        {/* Anti-Spam Honeypot Field */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="hp_company">Do not fill this field</label>
          <input
            id="hp_company"
            type="text"
            name="hp_company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* 1. Full Name */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-name" className={styles.label}>
            Your Name <span className={styles.requiredMark}>*</span>
          </label>
          <input
            ref={nameInputRef}
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            onFocus={handleFieldFocus}
            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name ? (
            <p id="contact-name-error" className={styles.fieldError} aria-live="polite">
              {errors.name}
            </p>
          ) : null}
        </div>

        {/* 2. Phone Number */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-phone" className={styles.label}>
            Phone Number <span className={styles.requiredMark}>*</span>
          </label>
          <input
            ref={phoneInputRef}
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            placeholder="(602) 555-0199"
            onFocus={handleFieldFocus}
            className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            aria-invalid={errors.phone ? "true" : "false"}
          />
          {errors.phone ? (
            <p id="contact-phone-error" className={styles.fieldError} aria-live="polite">
              {errors.phone}
            </p>
          ) : (
            <span className={styles.helperText}>Used for service coordination and call confirmations.</span>
          )}
        </div>

        {/* 3. Email (Optional) */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-email" className={styles.label}>
            Email Address <span className={styles.optionalMark}>(Optional)</span>
          </label>
          <input
            ref={emailInputRef}
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            onFocus={handleFieldFocus}
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email ? (
            <p id="contact-email-error" className={styles.fieldError} aria-live="polite">
              {errors.email}
            </p>
          ) : null}
        </div>

        {/* 4. Service Dropdown */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-service" className={styles.label}>
            What do you need help with? <span className={styles.requiredMark}>*</span>
          </label>
          <div className={styles.selectWrapper}>
            <select
              ref={serviceSelectRef}
              id="contact-service"
              name="service"
              required
              defaultValue=""
              onFocus={handleFieldFocus}
              className={`${styles.select} ${errors.service ? styles.inputError : ""}`}
              aria-describedby={errors.service ? "contact-service-error" : undefined}
              aria-invalid={errors.service ? "true" : "false"}
            >
              <option value="" disabled>Select a plumbing issue or service...</option>
              {services.map((svc) => (
                <option key={svc.slug} value={svc.name}>
                  {svc.name}
                </option>
              ))}
              <option value="Water Heater Service">Water Heater Repair or Replacement</option>
              <option value="Drain Cleaning / Backups">Drain Cleaning / Main Sewer Backup</option>
              <option value="Slab Leak / Concealed Leak">Slab Leak / Hidden Pipe Leak</option>
              <option value="Water Softener / Hard Water">Water Softener / Whole-Home Filtration</option>
              <option value="Fixture Installation / Repair">Toilet, Faucet or Valve Replacement</option>
              <option value="Not sure">Not sure / General Plumbing Question</option>
            </select>
          </div>
          {errors.service ? (
            <p id="contact-service-error" className={styles.fieldError} aria-live="polite">
              {errors.service}
            </p>
          ) : null}
        </div>

        {/* 5. City or ZIP */}
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-city" className={styles.label}>
            Valley City or ZIP Code <span className={styles.requiredMark}>*</span>
          </label>
          <input
            ref={cityInputRef}
            id="contact-city"
            name="cityOrZip"
            type="text"
            required
            placeholder="e.g. Phoenix, Scottsdale, Mesa or 85004"
            onFocus={handleFieldFocus}
            className={`${styles.input} ${errors.cityOrZip ? styles.inputError : ""}`}
            aria-describedby={errors.cityOrZip ? "contact-city-error" : undefined}
            aria-invalid={errors.cityOrZip ? "true" : "false"}
          />
          {errors.cityOrZip ? (
            <p id="contact-city-error" className={styles.fieldError} aria-live="polite">
              {errors.cityOrZip}
            </p>
          ) : null}
        </div>

        {/* 6. Message (Optional, 600 max) */}
        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label htmlFor="contact-message" className={styles.label}>
              Short Message <span className={styles.optionalMark}>(Optional)</span>
            </label>
            <span className={styles.charLimit}>Max 600 characters</span>
          </div>
          <textarea
            ref={messageInputRef}
            id="contact-message"
            name="message"
            rows={4}
            maxLength={600}
            placeholder="Describe the issue, location in home, or preferred contact time..."
            onFocus={handleFieldFocus}
            className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            aria-invalid={errors.message ? "true" : "false"}
          />
          {errors.message ? (
            <p id="contact-message-error" className={styles.fieldError} aria-live="polite">
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* 7. Emergency Checkbox */}
        <div className={styles.emergencyCheckWrapper}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isEmergency"
              checked={isEmergency}
              onChange={(e) => setIsEmergency(e.target.checked)}
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxText}>
              <strong>Is this an urgent plumbing emergency?</strong> (active flooding, burst pipe, sewer backing up)
            </span>
          </label>

          {isEmergency ? (
            <div className={styles.emergencyWarningBox} role="alert">
              <div className={styles.emergencyWarningHeader}>
                <AlertCircleIcon size={18} />
                <strong>For emergencies, calling is much faster:</strong>
              </div>
              <p className={styles.emergencyWarningSub}>
                Written messages are read in order during business hours. Call our dispatch line now for direct technician response:
              </p>
              <div className={styles.emergencyWarningBtn}>
                <CallButton
                  display={phoneDisplay}
                  e164={phoneE164}
                  location="contact-form-aside"
                  size="md"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* 8. Honest Consent Checkbox (Rule 4: NEVER pre-checked!) */}
        <div className={styles.consentGroup}>
          <label className={styles.checkboxLabel}>
            <input
              ref={consentInputRef}
              type="checkbox"
              name="consent"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className={styles.checkboxInput}
              aria-describedby={errors.consent ? "contact-consent-error" : undefined}
              aria-invalid={errors.consent ? "true" : "false"}
            />
            <span className={styles.consentText}>
              {consentDisclaimerText}
            </span>
          </label>
          <input type="hidden" name="consentText" value={consentDisclaimerText} />
          {errors.consent ? (
            <p id="contact-consent-error" className={styles.fieldError} aria-live="polite">
              {errors.consent}
            </p>
          ) : null}
        </div>

        {/* 9. Submit Button (Water-Blue, NEVER orange call color) */}
        <div className={styles.submitWrap}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitBtn}
          >
            {isSubmitting ? "Sending message..." : "Send message"}
          </button>
          <p className={styles.privacyMicro}>
            We respect your privacy. Information is used exclusively to answer your inquiry and is never sold.
          </p>
        </div>
      </form>
    </div>
  );
}
