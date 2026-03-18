---
name: scroll-animations
description: Scroll-driven animations and motion choreography using Framer Motion and GSAP
---

# Scroll Animations & Motion Choreography

Expert-level scroll-driven animations combining Framer Motion (React) and GSAP ScrollTrigger for cinematic web experiences.

## FRAMER MOTION — Primary for React Components

### Core Pattern
Wrap HTML elements with `motion.` prefix: `motion.div`, `motion.section`, `motion.button`.

### Scroll Entry Animations
```tsx
// Fade up on scroll into view
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
```

### Staggered Children
```tsx
// Parent container with stagger
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

<motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map(i => <motion.div key={i} variants={item} />)}
</motion.div>
```

### Spring Physics for Interactions
```tsx
// Hover with spring physics
<motion.div
  whileHover={{ scale: 1.02, y: -2 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
```

### Exit Animations
Always wrap conditional renders with `AnimatePresence`:
```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="unique"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

### Layout Animations
Use `layout` prop for automatic position/size transitions:
```tsx
<motion.div layout transition={{ type: "spring", stiffness: 200, damping: 25 }} />
```

## GSAP SCROLLTRIGGER — For Complex Scroll Sequences

### When to Use GSAP Over Framer Motion
- Horizontal scroll sections
- Pinned/sticky scroll sequences
- Scrub-linked animations (animation progress tied to scroll position)
- Complex multi-element timelines synced to scroll
- Video playback tied to scroll position

### Core ScrollTrigger Pattern
```tsx
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".element", {
    scrollTrigger: {
      trigger: ".element",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1, // smooth scrubbing
      // pin: true, // for pinned sections
    },
    y: 0,
    opacity: 1,
    duration: 1,
  });

  return () => ScrollTrigger.getAll().forEach(t => t.kill());
}, []);
```

### Horizontal Scroll Section
```tsx
useEffect(() => {
  const sections = gsap.utils.toArray(".panel");
  gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".horizontal-container",
      pin: true,
      scrub: 1,
      end: () => "+=" + document.querySelector(".horizontal-container").offsetWidth,
    },
  });
}, []);
```

### Parallax Effect
```tsx
gsap.to(".parallax-bg", {
  yPercent: -30,
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});
```

## MOTION PRINCIPLES

### Performance Rules (CRITICAL)
- ONLY animate `transform` and `opacity` — NEVER `top`, `left`, `width`, `height`, `margin`, `padding`
- Use `will-change: transform` sparingly and only on elements that will animate
- `backdrop-blur` only on fixed/sticky elements, never on scrolling content
- Always cleanup: kill ScrollTriggers on unmount, use `viewport={{ once: true }}` for one-shot animations
- Respect `prefers-reduced-motion`: disable animations for users who request it

### Custom Easing (Use Instead of Defaults)
```
Standard ease-out: [0.16, 1, 0.3, 1]
Smooth decelerate: [0.22, 1, 0.36, 1]
Spring-like: type: "spring", stiffness: 200-400, damping: 20-30
Scroll scrub: "none" (linear)
```

### Animation Timing Guidelines
- Fade-in entries: 500-700ms
- Hover transitions: 200-300ms
- Page transitions: 400-600ms
- Stagger delay: 80-120ms between items
- Spring animations: stiffness 200-400, damping 20-30

### Scroll Entry Pattern (Default for All Sections)
Every section entering the viewport should:
1. Start invisible: `opacity: 0, translateY(20-30px)`
2. Animate to visible: `opacity: 1, translateY(0)`
3. Duration: 600ms with `[0.16, 1, 0.3, 1]` easing
4. Trigger: when element is 100px inside viewport
5. Fire once: `viewport={{ once: true }}`

## PITFALLS TO AVOID
- Never nest ScrollTriggers inside timeline tweens — apply to parent timeline
- Never forget `AnimatePresence` for exit animations
- Never use continuous scroll listeners — use IntersectionObserver or ScrollTrigger
- Never animate layout properties (reflows kill performance)
- Always add unique `key` props to animated list items
