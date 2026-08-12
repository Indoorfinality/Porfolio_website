"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hue: number;
  spin: number;
  rot: number;
  kind: "petal" | "glint" | "star";
};

const MAX = 52;

/** Site-wide cursor trail — night star glitter / day warm petals + sparkles. */
export default function SkyCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const last = useRef({ x: 0, y: 0 });
  const { skyTheme } = useTheme();
  const isDark = skyTheme === "dark";
  const reduce = useReducedMotion();
  const modeRef = useRef(isDark);

  useEffect(() => {
    modeRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, burst = 2) => {
      const night = modeRef.current;
      for (let i = 0; i < burst; i++) {
        if (sparks.current.length >= MAX) sparks.current.shift();
        const angle = Math.random() * Math.PI * 2;

        if (night) {
          const speed = 0.15 + Math.random() * 0.55;
          sparks.current.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed * 0.7,
            life: 0,
            max: 0.55 + Math.random() * 0.7,
            size: 1 + Math.random() * 2.2,
            hue: 200 + Math.random() * 40,
            spin: (Math.random() - 0.5) * 0.2,
            rot: Math.random() * Math.PI,
            kind: "star",
          });
        } else {
          // Warm petals + bold sparkles — readable on light pages
          const isGlint = Math.random() > 0.55;
          const speed = 0.12 + Math.random() * 0.35;
          sparks.current.push({
            x: x + (Math.random() - 0.5) * 16,
            y: y + (Math.random() - 0.5) * 16,
            vx: Math.cos(angle) * speed,
            vy: 0.15 + Math.random() * 0.45 + Math.sin(angle) * 0.1,
            life: 0,
            max: isGlint ? 0.55 + Math.random() * 0.45 : 0.85 + Math.random() * 0.7,
            size: isGlint ? 2.2 + Math.random() * 2.4 : 4 + Math.random() * 5.5,
            hue: isGlint ? 32 + Math.random() * 18 : 8 + Math.random() * 28,
            spin: (Math.random() - 0.5) * 0.18,
            rot: Math.random() * Math.PI * 2,
            kind: isGlint ? "glint" : "petal",
          });
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const dx = x - last.current.x;
      const dy = y - last.current.y;
      const dist = Math.hypot(dx, dy);
      last.current = { x, y };
      if (dist < 4) return;
      spawn(x, y, Math.min(4, 1 + Math.floor(dist / 20)));
    };

    const tick = () => {
      if (!running) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);
      const night = modeRef.current;

      sparks.current = sparks.current.filter((s) => {
        s.life += 1 / 60;
        const t = s.life / s.max;
        if (t >= 1) return false;

        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.spin;

        if (night) {
          s.vx *= 0.98;
          s.vy *= 0.98;
          const alpha = (1 - t) * (0.55 + 0.45 * Math.sin(t * Math.PI));
          const r = s.size * (1 - t * 0.35);
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(t * 2.2 + s.spin * 10);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `hsla(${s.hue}, 90%, 92%, 1)`;
          ctx.shadowColor = `hsla(${s.hue}, 100%, 80%, 0.9)`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const a = (i * Math.PI) / 2;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            ctx.lineTo(
              Math.cos(a + Math.PI / 4) * r * 0.28,
              Math.sin(a + Math.PI / 4) * r * 0.28,
            );
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else if (s.kind === "glint") {
          const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI);
          const alpha = (1 - t) * (0.75 + 0.25 * pulse);
          const r = s.size * (0.75 + pulse * 0.55);
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rot);
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = `hsla(${s.hue}, 95%, 42%, 1)`;
          ctx.shadowColor = `hsla(${s.hue}, 100%, 55%, 0.95)`;
          ctx.shadowBlur = 10;
          ctx.lineWidth = 1.35;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(-r, 0);
          ctx.lineTo(r, 0);
          ctx.moveTo(0, -r * 0.85);
          ctx.lineTo(0, r * 0.85);
          ctx.stroke();
          // bright core
          ctx.fillStyle = `hsla(${s.hue + 15}, 100%, 88%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Soft petal — terracotta / peach, strong enough on cream
          const alpha = (1 - t) * 0.78;
          const w = s.size * (1 - t * 0.2);
          const h = w * 0.55;
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rot);
          ctx.globalAlpha = alpha;
          ctx.shadowColor = `hsla(${s.hue}, 70%, 35%, 0.35)`;
          ctx.shadowBlur = 6;
          const grad = ctx.createLinearGradient(0, -h, 0, h);
          grad.addColorStop(0, `hsla(${s.hue + 12}, 78%, 72%, 1)`);
          grad.addColorStop(0.5, `hsla(${s.hue}, 72%, 58%, 1)`);
          grad.addColorStop(1, `hsla(${s.hue - 6}, 65%, 48%, 1)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, -h);
          ctx.bezierCurveTo(w, -h * 0.3, w, h * 0.3, 0, h);
          ctx.bezierCurveTo(-w, h * 0.3, -w, -h * 0.3, 0, -h);
          ctx.closePath();
          ctx.fill();
          // thin vein for definition
          ctx.strokeStyle = `hsla(${s.hue - 8}, 55%, 38%, 0.45)`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(0, -h * 0.7);
          ctx.lineTo(0, h * 0.7);
          ctx.stroke();
          ctx.restore();
        }

        return true;
      });

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      sparks.current = [];
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[70]"
      aria-hidden
    />
  );
}
