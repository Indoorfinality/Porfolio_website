"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, Mail, Send } from "lucide-react";
import { site } from "@/data/site";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      message: String(data.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        note?: string;
      };

      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "Something went wrong. Try email instead.");
        return;
      }

      setStatus("success");
      setMessage(json.note || `Sent to ${site.email}. I’ll get back to you soon.`);
      form.reset();
    } catch {
      setStatus("error");
      setMessage(`Network error. Email ${site.email} directly.`);
    }
  }

  return (
    <section id="contact" className="stage-panel scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="max-w-md">
            <p className="eyebrow text-xs font-medium tracking-[0.28em] text-[var(--accent-hot)] uppercase">
              Contact
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--cream)] sm:text-6xl">
              Get in touch.
            </h2>
            <div className="section-rule mt-6 max-w-xs" />
            <p className="mt-5 text-lg text-[var(--muted)]">
              Write on the parchment below. Your message goes to{" "}
              <span className="text-[var(--cream)]">{site.email}</span>.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-flex items-center gap-2 text-[var(--accent-hot)] transition-opacity hover:opacity-80"
            >
              <Mail size={18} />
              {site.email}
            </a>
          </div>

          <motion.div
            className="scroll-letter relative mx-auto w-full max-w-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="scroll-rod scroll-rod--top" aria-hidden />
            <div className="parchment-letter">
              <div className="parchment-letter__grain" aria-hidden />
              <div className="parchment-letter__frame" aria-hidden />

              <p className="relative z-[1] font-[family-name:var(--font-display)] text-2xl tracking-[0.06em] text-[var(--letter-ink)] sm:text-3xl">
                Contact form
              </p>
              <div className="relative z-[1] mt-2 flex items-center gap-3">
                <span className="h-px flex-1 bg-[var(--letter-ink)]/20" />
                <span className="font-[family-name:var(--font-display)] text-xs tracking-[0.28em] text-[var(--letter-mute)] uppercase">
                  Portfolio
                </span>
                <span className="h-px flex-1 bg-[var(--letter-ink)]/20" />
              </div>

              <form onSubmit={onSubmit} className="relative z-[1] mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block font-[family-name:var(--font-display)] text-sm text-[var(--letter-mute)]"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    maxLength={80}
                    placeholder="Your name"
                    disabled={status === "loading"}
                    className="letter-field"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block font-[family-name:var(--font-display)] text-sm text-[var(--letter-mute)]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={120}
                    placeholder="you@email.com"
                    disabled={status === "loading"}
                    className="letter-field"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block font-[family-name:var(--font-display)] text-sm text-[var(--letter-mute)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    maxLength={2000}
                    rows={5}
                    placeholder="What should we talk about?"
                    disabled={status === "loading"}
                    className="letter-field min-h-[7rem] resize-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileTap={{ scale: 0.98 }}
                    className="btn-spell inline-flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-wide disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send
                        <Send size={16} />
                      </>
                    )}
                  </motion.button>

                  {status === "success" && (
                    <p className="text-sm text-[var(--accent-hot)]" role="status">
                      {message}
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-[var(--danger)]" role="status">
                      {message}
                    </p>
                  )}
                </div>
              </form>

              <p className="mt-8 text-right font-[family-name:var(--font-display)] text-sm italic text-[var(--letter-mute)]">
                — {site.shortName}
              </p>
            </div>
            <div className="scroll-rod scroll-rod--bottom" aria-hidden />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
