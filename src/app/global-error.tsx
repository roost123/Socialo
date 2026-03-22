"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="nl">
      <body
        style={{
          fontFamily: '"Outfit", system-ui, sans-serif',
          backgroundColor: "#FAFAFA",
          color: "#1A1A1A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "48px",
            opacity: 0.5,
          }}
        >
          S O C I A L O
        </p>
        <h1
          style={{
            fontSize: "clamp(30px, 5vw, 56px)",
            fontWeight: 600,
            letterSpacing: "-1px",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          Er ging iets mis
        </h1>
        <p
          style={{
            fontSize: "clamp(15px, 1.2vw, 18px)",
            color: "#737373",
            marginBottom: "32px",
            maxWidth: "400px",
          }}
        >
          Er is een onverwachte fout opgetreden. Probeer het opnieuw.
        </p>
        <button
          onClick={reset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 32px",
            backgroundColor: "#1A1A1A",
            color: "#FFFFFF",
            fontWeight: 500,
            fontSize: "15px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Probeer opnieuw
        </button>
      </body>
    </html>
  );
}
