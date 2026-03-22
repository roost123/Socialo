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
const CONNECTION_DISTANCE = 0.32; // fraction of canvas width
const LOOP_DURATION = 8;
const CHAOS_END = 2.5;
const TO_ORDER_END = 3.5;
const ORDER_END = 6.5;
const MOUSE_REPULSION_RADIUS = 120;
const MOUSE_REPULSION_STRENGTH = 30;

/* ─── Colors (brand blues only, no purple) ─── */
const NODE_COLORS_DARK = [
  "#6B9FD4", "#7CAED4", "#9BC4F0", "#4B749F",
  "#6B9FD4", "#9BC4F0", "#7CAED4", "#4B749F",
  "#6B9FD4", "#9BC4F0", "#7CAED4", "#4B749F",
];
const NODE_COLORS_LIGHT = [
  "#3A5E77", "#4B749F", "#243748", "#3A5E77",
  "#4B749F", "#243748", "#3A5E77", "#4B749F",
  "#243748", "#3A5E77", "#4B749F", "#243748",
];
const LINE_COLOR_DARK = "rgba(107, 159, 212, ";   // #6B9FD4
const LINE_COLOR_LIGHT = "rgba(74, 116, 159, ";    // close to #4B749F
const PULSE_COLOR_DARK = "#9BC4F0";
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

    /* ─── Create nodes in dataflow layout ─── */
    const nodes: NetworkNode[] = [];

    // Dataflow positions: left-to-right pipeline with branches
    // [x, y, radius] — x flows left→right, y spreads vertically
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

      // Chaos positions: scattered randomly
      const seed = i * 7 + 3;
      const chaosX = 0.05 + (Math.sin(seed * 127.1) * 0.5 + 0.5) * 0.9;
      const chaosY = 0.05 + (Math.cos(seed * 311.7) * 0.5 + 0.5) * 0.9;

      nodes.push({
        x: chaosX,
        y: chaosY,
        orderX,
        orderY,
        chaosX,
        chaosY,
        radius,
        noiseOffsetX: Math.random() * 100,
        noiseOffsetY: Math.random() * 100,
        speed: 0.3 + Math.random() * 0.4,
        baseColor: isDark() ? NODE_COLORS_DARK[i] : NODE_COLORS_LIGHT[i],
        glowIntensity: 0,
      });
    }

    /* ─── Dataflow paths (left→right routes through the network) ─── */
    const flowPaths = [
      [0, 4, 7, 10, 13],     // top route
      [1, 5, 8, 11, 14],     // middle route
      [2, 6, 9, 12, 15],     // bottom route
      [3, 6, 8, 11, 13],     // cross bottom→mid→top
      [0, 4, 8, 12, 15],     // cross top→bottom
      [1, 5, 7, 10, 14],     // cross mid→top→mid
      [2, 5, 8, 11, 14],     // another mid route
      [3, 6, 9, 11, 13],     // bottom cross
    ];

    /* ─── Pulses ─── */
    const pulses: (Pulse & { pathIdx: number; stepIdx: number })[] = [];
    for (let i = 0; i < 8; i++) {
      pulses.push({
        fromIdx: 0, toIdx: 0, progress: 0,
        speed: 0.7 + Math.random() * 0.5,
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

      /* ── Phase blend ── */
      let blend = 0; // 0=chaos, 1=order
      if (loopTime < CHAOS_END) {
        blend = 0;
      } else if (loopTime < TO_ORDER_END) {
        blend = smoothstep((loopTime - CHAOS_END) / (TO_ORDER_END - CHAOS_END));
      } else if (loopTime < ORDER_END) {
        blend = 1;
      } else {
        blend = 1 - smoothstep((loopTime - ORDER_END) / (LOOP_DURATION - ORDER_END));
      }

      /* ── Update node positions ── */
      nodes.forEach((node, i) => {
        // Perlin noise drift for chaos
        const nx = noise(node.noiseOffsetX + elapsed * node.speed * 0.3, i * 10) * 0.08;
        const ny = noise(node.noiseOffsetY + elapsed * node.speed * 0.3, i * 10 + 5) * 0.08;

        const chaosX = node.chaosX + nx;
        const chaosY = node.chaosY + ny;

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

        // Glow intensity (closer to mouse = more glow)
        node.glowIntensity = dist < MOUSE_REPULSION_RADIUS * 1.5
          ? (1 - dist / (MOUSE_REPULSION_RADIUS * 1.5)) * 0.8
          : 0;
      });

      /* ── Clear ── */
      ctx.clearRect(0, 0, width, height);

      /* ── Draw connections (distance-based, dynamic) ── */
      const connThreshold = CONNECTION_DISTANCE * width;
      const activeConnections: [number, number, number][] = []; // [fromIdx, toIdx, opacity]

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ax = nodes[i].x * width;
          const ay = nodes[i].y * height;
          const bx = nodes[j].x * width;
          const by = nodes[j].y * height;
          const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);

          if (dist < connThreshold) {
            const opacity = (1 - dist / connThreshold) * (0.06 + blend * 0.35);
            activeConnections.push([i, j, opacity]);

            const lineColor = dark ? LINE_COLOR_DARK : LINE_COLOR_LIGHT;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = lineColor + opacity.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      /* ── Spawn pulses in order phase (follow dataflow paths) ── */
      if (blend > 0.7 && elapsed - lastPulseSpawn > 0.35) {
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
          // Advance to next step in the flow path
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

        // Glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = pulseColor;
        ctx.shadowColor = pulseColor;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = 0.6 * blend;
        ctx.fill();
        ctx.restore();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pulseColor;
        ctx.globalAlpha = 0.9 * blend;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      /* ── Draw nodes ── */
      nodes.forEach((node) => {
        const px = node.x * width;
        const py = node.y * height;
        const r = node.radius + blend * 1; // slightly larger in order

        // Glow on hover
        if (node.glowIntensity > 0.01) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, r + 8, 0, Math.PI * 2);
          ctx.fillStyle = node.baseColor;
          ctx.shadowColor = node.baseColor;
          ctx.shadowBlur = 15;
          ctx.globalAlpha = node.glowIntensity * 0.4;
          ctx.fill();
          ctx.restore();
        }

        // Breathing pulse
        const breathe = Math.sin(elapsed * 1.5 + node.noiseOffsetX) * 0.15 + 0.85;

        // Node body
        ctx.beginPath();
        ctx.arc(px, py, r * breathe, 0, Math.PI * 2);
        ctx.fillStyle = node.baseColor;
        ctx.globalAlpha = 0.6 + blend * 0.3 + node.glowIntensity * 0.3;
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
