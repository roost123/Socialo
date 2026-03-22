"use client";

import { useRef, useEffect, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createNoise } from "@/lib/noise";

gsap.registerPlugin(ScrollTrigger);

/* ─── Constants ─── */
const NODE_COUNT = 15;
const CONNECTION_DIST = 0.35;
const NODE_OPACITY = 0.2;
const LINE_OPACITY = 0.1;

/* ─── Colors ─── */
const NODE_COLORS_DARK = [
  "#5EEAD4", "#67E8F9", "#7DD3FC", "#6BB8E8",
  "#5EEAD4", "#7DD3FC", "#67E8F9", "#6BB8E8",
  "#5EEAD4", "#7DD3FC", "#67E8F9", "#6BB8E8",
  "#5EEAD4", "#67E8F9", "#7DD3FC",
];
const NODE_COLORS_LIGHT = [
  "#3A5E77", "#4B749F", "#243748", "#3A5E77",
  "#4B749F", "#243748", "#3A5E77", "#4B749F",
  "#243748", "#3A5E77", "#4B749F", "#243748",
  "#3A5E77", "#4B749F", "#243748",
];

const LINE_COLOR_DARK = "rgba(94, 234, 212, ";
const LINE_COLOR_LIGHT = "rgba(74, 116, 159, ";
const PULSE_COLOR_DARK = "#67E8F9";
const PULSE_COLOR_LIGHT = "#4B749F";

/* ─── Node ─── */
interface NetNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
  speed: number;
  color: string;
}

/* ─── Pulse ─── */
interface NetPulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  active: boolean;
}

/* ─── Node positions — loose grid for wide aspect ratio ─── */
const NODE_POSITIONS: [number, number, number][] = [
  [0.08, 0.22, 4], [0.10, 0.55, 5], [0.06, 0.82, 4],
  [0.30, 0.18, 6], [0.32, 0.62, 5], [0.28, 0.88, 5],
  [0.50, 0.25, 7], [0.52, 0.65, 6], [0.48, 0.85, 5],
  [0.70, 0.18, 6], [0.68, 0.62, 5], [0.72, 0.88, 5],
  [0.92, 0.22, 4], [0.90, 0.55, 5], [0.94, 0.82, 4],
];

/* ─── Flow paths for pulses ─── */
const FLOW_PATHS = [
  [0, 3, 6, 9, 12], [1, 4, 7, 10, 13], [2, 5, 8, 11, 14],
  [0, 3, 7, 10, 13], [1, 4, 8, 11, 14], [2, 5, 7, 9, 12],
];

interface NetworkBgProps {
  triggerRef: RefObject<HTMLElement | null>;
  className?: string;
}

export function NetworkBg({ triggerRef, className = "" }: NetworkBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d")!;
    const noise = createNoise();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId: number;
    const isVisible = { current: false };

    function resize() {
      if (!container || !canvas) return;
      dpr = Math.min(window.devicePixelRatio, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function isDark(): boolean {
      return document.documentElement.classList.contains("dark");
    }

    /* ─── Create nodes ─── */
    const nodes: NetNode[] = NODE_POSITIONS.map(([bx, by, r], i) => ({
      x: bx, y: by, baseX: bx, baseY: by, radius: r,
      noiseOffsetX: Math.random() * 100,
      noiseOffsetY: Math.random() * 100,
      speed: 0.3 + Math.random() * 0.3,
      color: isDark() ? NODE_COLORS_DARK[i] : NODE_COLORS_LIGHT[i],
    }));

    /* ─── Create pulses ─── */
    const pulses: (NetPulse & { pathIdx: number; stepIdx: number })[] = [];
    for (let i = 0; i < 6; i++) {
      pulses.push({
        fromIdx: 0, toIdx: 0, progress: 0,
        speed: 0.4 + Math.random() * 0.3,
        active: false, pathIdx: 0, stepIdx: 0,
      });
    }

    let lastPulseSpawn = 0;

    /* ─── Animation ─── */
    function animate(now: number) {
      if (!isVisible.current) {
        animId = requestAnimationFrame(animate);
        return;
      }

      animId = requestAnimationFrame(animate);
      const elapsed = now / 1000;
      const dark = isDark();

      /* Update node colors */
      nodes.forEach((n, i) => {
        n.color = dark ? NODE_COLORS_DARK[i] : NODE_COLORS_LIGHT[i];
      });

      /* Update node positions — gentle noise drift */
      nodes.forEach((node, i) => {
        const nx = noise(node.noiseOffsetX + elapsed * node.speed * 0.5, i * 10) * 0.03;
        const ny = noise(node.noiseOffsetY + elapsed * node.speed * 0.5, i * 10 + 5) * 0.03;

        const breathe = Math.sin(elapsed * 1.2 + node.noiseOffsetX) * 0.005;

        node.x = node.baseX + nx + breathe;
        node.y = node.baseY + ny;

        node.x = Math.max(0.03, Math.min(0.97, node.x));
        node.y = Math.max(0.03, Math.min(0.97, node.y));
      });

      /* Clear */
      ctx.clearRect(0, 0, width, height);

      /* Draw connections */
      const lineColor = dark ? LINE_COLOR_DARK : LINE_COLOR_LIGHT;
      const connThreshold = CONNECTION_DIST * width;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ax = nodes[i].x * width;
          const ay = nodes[i].y * height;
          const bx = nodes[j].x * width;
          const by = nodes[j].y * height;
          const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);

          if (dist >= connThreshold) continue;

          const opacity = (1 - dist / connThreshold) * LINE_OPACITY;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = lineColor + opacity.toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      /* Spawn pulses */
      if (elapsed - lastPulseSpawn > 1.5) {
        lastPulseSpawn = elapsed;
        const inactive = pulses.find(p => !p.active);
        if (inactive) {
          const pathIdx = Math.floor(Math.random() * FLOW_PATHS.length);
          const path = FLOW_PATHS[pathIdx];
          inactive.pathIdx = pathIdx;
          inactive.stepIdx = 0;
          inactive.fromIdx = path[0];
          inactive.toIdx = path[1];
          inactive.progress = 0;
          inactive.active = true;
        }
      }

      /* Draw & update pulses */
      const pulseColor = dark ? PULSE_COLOR_DARK : PULSE_COLOR_LIGHT;
      pulses.forEach(pulse => {
        if (!pulse.active) return;
        pulse.progress += (1 / 60) * pulse.speed;
        if (pulse.progress > 1) {
          pulse.stepIdx++;
          const path = FLOW_PATHS[pulse.pathIdx];
          if (pulse.stepIdx < path.length - 1) {
            pulse.fromIdx = path[pulse.stepIdx];
            pulse.toIdx = path[pulse.stepIdx + 1];
            pulse.progress = 0;
          } else {
            pulse.active = false;
            return;
          }
        }

        const from = nodes[pulse.fromIdx];
        const to = nodes[pulse.toIdx];
        const px = (from.x + (to.x - from.x) * pulse.progress) * width;
        const py = (from.y + (to.y - from.y) * pulse.progress) * height;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = pulseColor;
        ctx.shadowColor = pulseColor;
        ctx.shadowBlur = dark ? 15 : 8;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = dark ? "#FFFFFF" : pulseColor;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      /* Draw nodes */
      nodes.forEach((node) => {
        const px = node.x * width;
        const py = node.y * height;
        const breathe = Math.sin(elapsed * 1.5 + node.noiseOffsetX) * 0.08 + 1;

        if (dark) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, node.radius + 4, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 10;
          ctx.globalAlpha = 0.08;
          ctx.fill();
          ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(px, py, node.radius * breathe, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = NODE_OPACITY;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    animId = requestAnimationFrame(animate);

    /* ─── ScrollTrigger: only animate when visible ─── */
    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => { isVisible.current = true; },
      onLeave: () => { isVisible.current = false; },
      onEnterBack: () => { isVisible.current = true; },
      onLeaveBack: () => { isVisible.current = false; },
    });

    return () => {
      cancelAnimationFrame(animId);
      trigger.kill();
      window.removeEventListener("resize", resize);
    };
  }, [mounted, triggerRef]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      {mounted && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
