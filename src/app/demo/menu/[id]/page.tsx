"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  Check,
  Copy,
  DownloadSimple,
  ArrowLeft,
  Eye,
} from "@phosphor-icons/react";
import type { MenuData } from "@/lib/types";

export default function MenuDashboard() {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const menuUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/menu/${id}`
      : `/menu/${id}`;

  useEffect(() => {
    fetch(`/api/menu/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: MenuData) => {
        setMenu(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      if (ctx) {
        ctx.fillStyle = "#FDFBF7";
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.drawImage(img, 0, 0, 1024, 1024);
      }
      const a = document.createElement("a");
      a.download = `menu-qr-${id}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="text-warm-gray text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-2">
            Menu not found
          </h1>
          <a
            href="/demo/menu"
            className="text-sm text-sage hover:text-sage/80 transition-colors"
          >
            Go back to upload
          </a>
        </div>
      </div>
    );
  }

  const totalItems = menu.categories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  return (
    <div className="min-h-[100dvh]">
      {/* Header */}
      <header className="px-4 py-6 border-b border-charcoal/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a
            href="/demo/menu"
            className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-charcoal transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Back</span>
          </a>
          <span className="inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-sage bg-sage-light/60 ring-1 ring-sage/10">
            Demo
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: QR code and share */}
          <div className="lg:w-2/5">
            <h1 className="text-2xl font-bold tracking-[-0.02em] text-charcoal mb-2">
              Your menu is ready
            </h1>
            <p className="text-sm text-warm-gray font-light mb-8">
              {menu.categories.length} categories, {totalItems} items detected.
              Print the QR code and put it on your tables.
            </p>

            {/* QR Code card */}
            <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5 mb-6">
              <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-8 flex flex-col items-center">
                <div ref={qrRef}>
                  <QRCodeSVG
                    value={menuUrl}
                    size={200}
                    bgColor="#FDFBF7"
                    fgColor="#1A1A18"
                    level="M"
                  />
                </div>
                <p className="mt-4 text-xs text-warm-gray/50 text-center">
                  Scan to view menu in any language
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={downloadQR}
                className="group flex items-center justify-center gap-2 rounded-full bg-charcoal text-cream px-6 py-3 text-sm font-medium transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98]"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>Download QR code</span>
              </button>

              <button
                onClick={copyLink}
                className="group flex items-center justify-center gap-2 rounded-full bg-charcoal/[0.04] text-charcoal px-6 py-3 text-sm font-medium transition-all duration-300 hover:bg-charcoal/[0.08] active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check size={16} weight="bold" className="text-sage" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} weight="bold" />
                    <span>Copy link</span>
                  </>
                )}
              </button>

              <a
                href={`/menu/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-full bg-charcoal/[0.04] text-charcoal px-6 py-3 text-sm font-medium transition-all duration-300 hover:bg-charcoal/[0.08] active:scale-[0.98]"
              >
                <Eye size={16} weight="bold" />
                <span>Preview as guest</span>
              </a>
            </div>
          </div>

          {/* Right: Menu preview */}
          <div className="lg:w-3/5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray mb-6">
              Menu preview
            </h2>
            <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-6 md:p-8 max-h-[600px] overflow-y-auto">
                {menu.categories.map((category, i) => (
                  <div key={i} className="mb-8 last:mb-0">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-sage mb-3">
                      {category.name}
                    </h3>
                    <div className="space-y-1">
                      {category.items.map((item, j) => (
                        <div
                          key={j}
                          className="py-2.5 border-b border-charcoal/[0.04] last:border-0"
                        >
                          <div className="flex justify-between items-baseline gap-4">
                            <span className="text-sm font-medium text-charcoal">
                              {item.name}
                            </span>
                            {item.price && (
                              <span className="text-xs font-medium text-charcoal/70 flex-shrink-0">
                                {item.price}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="mt-0.5 text-xs text-warm-gray leading-relaxed font-light">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
