"use client";

import { useEffect } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

export default function ScrollReveal() {
  useEffect(() => {
    registerGsap();
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const heroContent = document.querySelector<HTMLElement>("#top .hero-content");
      if (heroContent) {
        gsap.to(heroContent, {
          y: -100,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#top",
            start: "top top",
            end: "bottom top",
            scrub: 0.7,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 64, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".stage-panel").forEach((panel) => {
        // Work section owns its own pin + horizontal rail
        if (panel.classList.contains("work-pin")) return;
        gsap.fromTo(
          panel,
          { opacity: 0.35, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top 90%",
              end: "top 45%",
              scrub: 1,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".parallax-orb").forEach((orb, i) => {
        gsap.to(orb, {
          y: i % 2 === 0 ? -200 : -120,
          x: i % 2 === 0 ? 50 : -40,
          ease: "none",
          scrollTrigger: {
            trigger: orb.parentElement || orb,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".skill-unlock").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -28, filter: "blur(4px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.55,
            delay: (i % 8) * 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("main h2").forEach((heading) => {
        if (heading.closest(".work-heading")) return;
        gsap.fromTo(
          heading,
          { y: 40, opacity: 0, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("main .eyebrow").forEach((label) => {
        if (label.closest(".work-heading")) return;
        gsap.fromTo(
          label,
          { opacity: 0, letterSpacing: "0.5em", y: 10 },
          {
            opacity: 1,
            letterSpacing: "0.28em",
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: label,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("#contact .letter-field, #contact .btn-spell").forEach(
        (field, i) => {
          gsap.fromTo(
            field,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              delay: i * 0.06,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#contact .scroll-letter",
                start: "top 78%",
                toggleActions: "play none none reverse",
              },
            },
          );
        },
      );

      gsap.utils.toArray<HTMLElement>(".section-rule").forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.05,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: rule,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      const footer = document.querySelector("footer");
      if (footer) {
        gsap.fromTo(
          footer,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footer,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return null;
}
