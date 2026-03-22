"use client";

import { useRef, useEffect, useState } from "react";

/* ─── Simplex-inspired noise (compact, no dependencies) ─── */
function createNoise() {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
  function grad(hash: number, x: number, y: number) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }

  return function noise2d(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const a = perm[X] + Y;
    const b = perm[X + 1] + Y;
    return lerp(
      lerp(grad(perm[a], xf, yf), grad(perm[b], xf - 1, yf), u),
      lerp(grad(perm[a + 1], xf, yf - 1), grad(perm[b + 1], xf - 1, yf - 1), u),
      v
    );
  };
}

/* ─── Smoothstep ─── */
function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/* ─── Node definition ─── */
interface NetworkNode {
  x: number;
  y: number;
  orderX: number;
  orderY: number;
  chaosX: number;
  chaosY: number;
  radius: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
  speed: number;
  baseColor: string;
  glowIntensity: number;
}

/* ─── Debris particle (chaos clutter) ─── */
interface Debris {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
  speed: number;
  opacity: number;
  flickerRate: number;
  color: string;
}

/* ─── Pulse definition ─── */
interface Pulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  active: boolean;
}

/* ─── Constants ─── */
const NODE_COUNT = 16;
const DEBRIS_COUNT = 35;
const LOOP_DURATION = 10;
const CHAOS_END = 3.0;
const TO_ORDER_END = 5.0;
const ORDER_END = 8.0;
const MOUSE_REPULSION_RADIUS = 120;
const MOUSE_REPULSION_STRENGTH = 30;

/* ─── Colors ─── */
// Dark mode: vibrant cyans and electric blues for premium dark feel
const NODE_COLORS_DARK = [
  "#5EEAD4", "#67E8F9", "#7DD3FC", "#6BB8E8",
  "#5EEAD4", "#7DD3FC", "#67E8F9", "#6BB8E8",
  "#5EEAD4", "#7DD3FC", "#67E8F9", "#6BB8E8",
  "#5EEAD4", "#7DD3FC", "#67E8F9", "#6BB8E8",
];
// Light mode: deep blues
const NODE_COLORS_LIGHT = [
  "#3A5E77", "#4B749F", "#243748", "#3A5E77",
  "#4B749F", "#243748", "#3A5E77", "#4B749F",
  "#243748", "#3A5E77", "#4B749F", "#243748",
  "#3A5E77", "#4B749F", "#243748", "#3A5E77",
];

// Chaos debris colors — messy, noisy, some warm accents
const DEBRIS_COLORS_DARK = [
  "#4B5563", "#6B7280", "#9CA3AF", "#F87171",
  "#FBBF24", "#6B7280", "#4B5563", "#FB923C",
  "#9CA3AF", "#6B7280", "#EF4444", "#F59E0B",
];
const DEBRIS_COLORS_LIGHT = [
  "#9CA3AF", "#6B7280", "#D1D5DB", "#E5E7EB",
  "#D97706", "#9CA3AF", "#6B7280", "#DC2626",
  "#D1D5DB", "#9CA3AF", "#B45309", "#6B7280",
];

const LINE_COLOR_DARK = "rgba(94, 234, 212, ";     // teal glow
const LINE_COLOR_LIGHT = "rgba(74, 116, 159, ";
const CHAOS_LINE_COLOR_DARK = "rgba(107, 114, 128, ";  // gray mess
const CHAOS_LINE_COLOR_LIGHT = "rgba(156, 163, 175, ";
const PULSE_COLOR_DARK = "#67E8F9";
const PULSE_COLOR_LIGHT = "#4B749F";

export function Hero3D() {
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

    /* ─── Resize ─── */
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

    /* ─── Dark mode detection ─── */
    function isDark(): boolean {
      return document.documentElement.classList.contains("dark");
    }

    /* ─── Create main nodes (dataflow layout) ─── */
    const nodes: NetworkNode[] = [];

    const flowPositions: [number, number, number][] = [
      // Layer 1: inputs (left edge)
      [0.05, 0.18, 4],   // 0
      [0.04, 0.42, 5],   // 1
      [0.06, 0.65, 4],   // 2
      [0.08, 0.85, 4],   // 3
      // Layer 2: first processing
      [0.22, 0.28, 6],   // 4
      [0.20, 0.55, 7],   // 5
      [0.24, 0.78, 6],   // 6
      // Layer 3: central hub
      [0.44, 0.30, 8],   // 7: main hub
      [0.42, 0.58, 7],   // 8: secondary hub
      [0.46, 0.80, 6],   // 9
      // Layer 4: second processing
      [0.65, 0.22, 6],   // 10
      [0.63, 0.48, 7],   // 11
      [0.67, 0.72, 6],   // 12
      // Layer 5: outputs (right edge)
      [0.85, 0.30, 5],   // 13
      [0.88, 0.55, 5],   // 14
      [0.84, 0.78, 5],   // 15
    ];

    for (let i = 0; i < NODE_COUNT; i++) {
      const [orderX, orderY, radius] = flowPositions[i];
      // Chaos: scattered wildly
      const seed = i * 7 + 3;
      const chaosX = 0.02 + (Math.sin(seed * 127.1) * 0.5 + 0.5) * 0.96;
      const chaosY = 0.02 + (Math.cos(seed * 311.7) * 0.5 + 0.5) * 0.96;

      nodes.push({
        x: chaosX, y: chaosY,
        orderX, orderY, chaosX, chaosY,
        radius,
        noiseOffsetX: Math.random() * 100,
        noiseOffsetY: Math.random() * 100,
        speed: 0.4 + Math.random() * 0.5,
        baseColor: isDark() ? NODE_COLORS_DARK[i] : NODE_COLORS_LIGHT[i],
        glowIntensity: 0,
      });
    }

    /* ─── Create debris particles (chaos clutter) ─── */
    const debris: Debris[] = [];
    for (let i = 0; i < DEBRIS_COUNT; i++) {
      const dark = isDark();
      debris.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.003,
        radius: 1 + Math.random() * 3,
        noiseOffsetX: Math.random() * 200,
        noiseOffsetY: Math.random() * 200,
        speed: 0.5 + Math.random() * 0.8,
        opacity: 0.15 + Math.random() * 0.5,
        flickerRate: 1 + Math.random() * 3,
        color: dark
          ? DEBRIS_COLORS_DARK[i % DEBRIS_COLORS_DARK.length]
          : DEBRIS_COLORS_LIGHT[i % DEBRIS_COLORS_LIGHT.length],
      });
    }

    /* ─── Dataflow paths ─── */
    const flowPaths = [
      [0, 4, 7, 10, 13],
      [1, 5, 8, 11, 14],
      [2, 6, 9, 12, 15],
      [3, 6, 8, 11, 13],
      [0, 4, 8, 12, 15],
      [1, 5, 7, 10, 14],
      [2, 5, 8, 11, 14],
      [3, 6, 9, 11, 13],
    ];

    /* ─── Pulses ─── */
    const pulses: (Pulse & { pathIdx: number; stepIdx: number })[] = [];
    for (let i = 0; i < 10; i++) {
      pulses.push({
        fromIdx: 0, toIdx: 0, progress: 0,
        speed: 0.6 + Math.random() * 0.5,
        active: false, pathIdx: 0, stepIdx: 0,
      });
    }

    /* ─── Mouse ─── */
    const mouse = { x: -1000, y: -1000 };
    function onMouseMove(e: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onTouchMove(e: TouchEvent) {
      if (!container || e.touches.length === 0) return;
      const rect = container.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
    function onLeave() { mouse.x = -1000; mouse.y = -1000; }

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("mouseleave", onLeave);

    /* ─── Animation ─── */
    let animId: number;
    let startTime = performance.now();
    let lastPulseSpawn = 0;

    function animate(now: number) {
      animId = requestAnimationFrame(animate);
      const elapsed = (now - startTime) / 1000;
      const loopTime = elapsed % LOOP_DURATION;
      const dark = isDark();

      // Update colors on theme change
      nodes.forEach((n, i) => {
        n.baseColor = dark ? NODE_COLORS_DARK[i] : NODE_COLORS_LIGHT[i];
      });
      debris.forEach((d, i) => {
        d.color = dark
          ? DEBRIS_COLORS_DARK[i % DEBRIS_COLORS_DARK.length]
          : DEBRIS_COLORS_LIGHT[i % DEBRIS_COLORS_LIGHT.length];
      });

      /* ── Phase blend ── */
      let blend = 0; // 0 = pure chaos, 1 = pure order
      if (loopTime < CHAOS_END) {
        blend = 0;
      } else if (loopTime < TO_ORDER_END) {
        blend = smoothstep((loopTime - CHAOS_END) / (TO_ORDER_END - CHAOS_END));
      } else if (loopTime < ORDER_END) {
        blend = 1;
      } else {
        blend = 1 - smoothstep((loopTime - ORDER_END) / (LOOP_DURATION - ORDER_END));
      }

      // Chaos intensity — peaks during chaos, used for effects
      const chaosIntensity = 1 - blend;

      /* ── Update main node positions ── */
      nodes.forEach((node, i) => {
        // Perlin noise drift — much more erratic in chaos
        const noiseScale = 0.04 + chaosIntensity * 0.2; // 0.04 in order, 0.24 in chaos
        const jitterSpeed = node.speed * (0.3 + chaosIntensity * 0.8);
        const nx = noise(node.noiseOffsetX + elapsed * jitterSpeed, i * 10) * noiseScale;
        const ny = noise(node.noiseOffsetY + elapsed * jitterSpeed, i * 10 + 5) * noiseScale;

        // Extra high-frequency jitter in chaos for nervous feel
        const jitterX = chaosIntensity * Math.sin(elapsed * 12 + i * 2.7) * 0.008;
        const jitterY = chaosIntensity * Math.cos(elapsed * 14 + i * 3.1) * 0.008;

        const chaosX = node.chaosX + nx + jitterX;
        const chaosY = node.chaosY + ny + jitterY;

        // Blend between chaos and order
        node.x = chaosX + (node.orderX - chaosX) * blend;
        node.y = chaosY + (node.orderY - chaosY) * blend;

        // Mouse repulsion
        const px = node.x * width;
        const py = node.y * height;
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_REPULSION_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_REPULSION_RADIUS) * MOUSE_REPULSION_STRENGTH;
          node.x += (dx / dist) * force / width;
          node.y += (dy / dist) * force / height;
        }

        node.glowIntensity = dist < MOUSE_REPULSION_RADIUS * 1.5
          ? (1 - dist / (MOUSE_REPULSION_RADIUS * 1.5)) * 0.8
          : 0;
      });

      /* ── Update debris positions ── */
      debris.forEach((d, i) => {
        const nx = noise(d.noiseOffsetX + elapsed * d.speed * 0.5, i * 7) * 0.15;
        const ny = noise(d.noiseOffsetY + elapsed * d.speed * 0.5, i * 7 + 3) * 0.15;
        d.x = 0.5 + nx + Math.sin(elapsed * 0.3 + i) * 0.3;
        d.y = 0.5 + ny + Math.cos(elapsed * 0.25 + i * 1.3) * 0.3;

        // Clamp
        d.x = Math.max(0, Math.min(1, d.x));
        d.y = Math.max(0, Math.min(1, d.y));
      });

      /* ── Clear ── */
      ctx.clearRect(0, 0, width, height);

      /* ── Draw debris (chaos clutter) — fades out as blend → 1 ── */
      if (chaosIntensity > 0.01) {
        // Scattered messy lines between random debris pairs
        const chaosLineColor = dark ? CHAOS_LINE_COLOR_DARK : CHAOS_LINE_COLOR_LIGHT;
        for (let i = 0; i < debris.length; i++) {
          for (let j = i + 1; j < Math.min(i + 6, debris.length); j++) {
            const ax = debris[i].x * width;
            const ay = debris[i].y * height;
            const bx = debris[j].x * width;
            const by = debris[j].y * height;
            const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
            const maxDist = 0.3 * width;

            if (dist < maxDist) {
              const lineOpacity = (1 - dist / maxDist) * 0.12 * chaosIntensity;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(bx, by);
              ctx.strokeStyle = chaosLineColor + lineOpacity.toFixed(3) + ")";
              ctx.lineWidth = 0.5 + Math.random() * 0.5 * chaosIntensity;
              ctx.stroke();
            }
          }
        }

        // Draw debris dots
        debris.forEach((d, i) => {
          const px = d.x * width;
          const py = d.y * height;
          const flicker = Math.sin(elapsed * d.flickerRate + i) * 0.3 + 0.7;
          const alpha = d.opacity * chaosIntensity * flicker;

          ctx.beginPath();
          ctx.arc(px, py, d.radius * (0.8 + chaosIntensity * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = d.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        // Chaotic cross-connections between main nodes and debris
        const crossLineColor = dark ? CHAOS_LINE_COLOR_DARK : CHAOS_LINE_COLOR_LIGHT;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = 0; j < debris.length; j += 3) {
            const ax = nodes[i].x * width;
            const ay = nodes[i].y * height;
            const bx = debris[j].x * width;
            const by = debris[j].y * height;
            const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
            const maxDist = 0.25 * width;

            if (dist < maxDist) {
              const lineOpacity = (1 - dist / maxDist) * 0.06 * chaosIntensity;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(bx, by);
              ctx.strokeStyle = crossLineColor + lineOpacity.toFixed(3) + ")";
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      /* ── Draw main node connections ── */
      const connThreshold = (0.32 + chaosIntensity * 0.15) * width; // wider in chaos
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ax = nodes[i].x * width;
          const ay = nodes[i].y * height;
          const bx = nodes[j].x * width;
          const by = nodes[j].y * height;
          const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);

          if (dist < connThreshold) {
            // In chaos: gray messy lines. In order: clean teal/blue lines
            const chaosOpacity = (1 - dist / connThreshold) * 0.08 * chaosIntensity;
            const orderOpacity = (1 - dist / connThreshold) * 0.4 * blend;

            // Chaos lines
            if (chaosOpacity > 0.003) {
              const chaosLineColor = dark ? CHAOS_LINE_COLOR_DARK : CHAOS_LINE_COLOR_LIGHT;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(bx, by);
              ctx.strokeStyle = chaosLineColor + chaosOpacity.toFixed(3) + ")";
              ctx.lineWidth = 0.5 + chaosIntensity * 1;
              ctx.stroke();
            }

            // Order lines
            if (orderOpacity > 0.003) {
              const lineColor = dark ? LINE_COLOR_DARK : LINE_COLOR_LIGHT;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(bx, by);
              ctx.strokeStyle = lineColor + orderOpacity.toFixed(3) + ")";
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      /* ── Spawn pulses in order phase ── */
      if (blend > 0.7 && elapsed - lastPulseSpawn > 0.3) {
        lastPulseSpawn = elapsed;
        const inactivePulse = pulses.find(p => !p.active);
        if (inactivePulse) {
          const pathIdx = Math.floor(Math.random() * flowPaths.length);
          const path = flowPaths[pathIdx];
          inactivePulse.pathIdx = pathIdx;
          inactivePulse.stepIdx = 0;
          inactivePulse.fromIdx = path[0];
          inactivePulse.toIdx = path[1];
          inactivePulse.progress = 0;
          inactivePulse.active = true;
        }
      }

      /* ── Draw & update pulses ── */
      const pulseColor = dark ? PULSE_COLOR_DARK : PULSE_COLOR_LIGHT;
      pulses.forEach(pulse => {
        if (!pulse.active) return;
        pulse.progress += (1 / 60) * pulse.speed;
        if (pulse.progress > 1) {
          pulse.stepIdx++;
          const path = flowPaths[pulse.pathIdx];
          if (pulse.stepIdx < path.length - 1 && blend > 0.5) {
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

        // Glow trail
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = pulseColor;
        ctx.shadowColor = pulseColor;
        ctx.shadowBlur = dark ? 20 : 12;
        ctx.globalAlpha = 0.5 * blend;
        ctx.fill();
        ctx.restore();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = dark ? "#FFFFFF" : pulseColor;
        ctx.globalAlpha = 0.9 * blend;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      /* ── Draw main nodes ── */
      nodes.forEach((node, i) => {
        const px = node.x * width;
        const py = node.y * height;

        // In chaos: nodes are bigger, jittery, less uniform
        const chaosScale = 1 + chaosIntensity * (0.3 + Math.sin(elapsed * 3 + i) * 0.2);
        const orderScale = 1 + blend * 0.1;
        const r = node.radius * (chaosIntensity > 0.5 ? chaosScale : orderScale);

        // Breathing pulse (calm in order)
        const breatheSpeed = 1.5 + chaosIntensity * 2;
        const breatheAmount = 0.05 + chaosIntensity * 0.15;
        const breathe = Math.sin(elapsed * breatheSpeed + node.noiseOffsetX) * breatheAmount + (1 - breatheAmount);

        // Glow on hover
        if (node.glowIntensity > 0.01) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, r + 10, 0, Math.PI * 2);
          ctx.fillStyle = node.baseColor;
          ctx.shadowColor = node.baseColor;
          ctx.shadowBlur = dark ? 25 : 15;
          ctx.globalAlpha = node.glowIntensity * 0.5;
          ctx.fill();
          ctx.restore();
        }

        // Order glow (always-on subtle glow in dark mode when ordered)
        if (dark && blend > 0.5) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, r + 6, 0, Math.PI * 2);
          ctx.fillStyle = node.baseColor;
          ctx.shadowColor = node.baseColor;
          ctx.shadowBlur = 15;
          ctx.globalAlpha = 0.15 * blend;
          ctx.fill();
          ctx.restore();
        }

        // Node body
        ctx.beginPath();
        ctx.arc(px, py, r * breathe, 0, Math.PI * 2);

        // In chaos: more muted/gray. In order: vivid
        if (chaosIntensity > 0.3) {
          // Mix the base color with a muted gray
          const grayMix = dark ? "#6B7280" : "#9CA3AF";
          ctx.fillStyle = chaosIntensity > 0.7 ? grayMix : node.baseColor;
        } else {
          ctx.fillStyle = node.baseColor;
        }

        ctx.globalAlpha = 0.5 + blend * 0.4 + node.glowIntensity * 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    animId = requestAnimationFrame(animate);

    /* ─── Cleanup ─── */
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [mounted]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: 500 }}
      aria-hidden="true"
      role="presentation"
    >
      {mounted && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
