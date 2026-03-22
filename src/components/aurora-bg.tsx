"use client";

export function AuroraBG() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ backgroundColor: "var(--bg-page)" }}>
      {/* Ambient gradient orbs */}
      <div
        className="hero-blob absolute w-[600px] h-[600px] rounded-full opacity-[0.08]"
        style={{
          background: "radial-gradient(circle, var(--gradient-from) 0%, transparent 70%)",
          top: "-10%",
          right: "-5%",
          animation: "blob1 25s ease-in-out infinite",
          filter: "blur(80px)",
        }}
      />
      <div
        className="hero-blob absolute w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, var(--gradient-to) 0%, transparent 70%)",
          bottom: "10%",
          left: "-8%",
          animation: "blob2 30s ease-in-out infinite",
          filter: "blur(100px)",
        }}
      />
      <div
        className="hero-blob absolute w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, var(--gradient-from) 0%, transparent 70%)",
          top: "40%",
          left: "30%",
          animation: "blob3 35s ease-in-out infinite",
          filter: "blur(120px)",
        }}
      />
    </div>
  );
}
