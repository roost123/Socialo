"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  UploadSimple,
  Image as ImageIcon,
  SpinnerGap,
  ArrowRight,
} from "@phosphor-icons/react";
import { DEMO_MENUS } from "@/lib/demo-menus";

export default function MenuDemoPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setPreview(URL.createObjectURL(file));
      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/menu/extract", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Extraction failed");

        const menu = await res.json();
        router.push(`/demo/menu/${menu.id}`);
      } catch {
        setError(
          "Could not read the menu from this image. Try a clearer photo."
        );
        setUploading(false);
      }
    },
    [router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a
            href="/"
            className="text-sm font-semibold tracking-tight text-charcoal"
          >
            Socialo
          </a>
          <span className="inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-sage bg-sage-light/60 ring-1 ring-sage/10">
            Demo
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="max-w-xl w-full text-center">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-charcoal mb-4">
            Menu Translator
          </h1>
          <p className="text-lg text-warm-gray font-light mb-12 max-w-md mx-auto">
            Upload a photo of your menu. We&apos;ll turn it into a multilingual
            page your guests can read in any language.
          </p>

          {/* Upload zone */}
          {!uploading ? (
            <div
              {...getRootProps()}
              className={`group cursor-pointer rounded-[2rem] bg-charcoal/[0.03] ring-1 p-1.5 transition-all duration-300 ${
                isDragActive
                  ? "ring-sage/30 bg-sage-light/20"
                  : "ring-charcoal/[0.05] hover:ring-charcoal/[0.1]"
              }`}
            >
              <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-12 md:p-16">
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Menu preview"
                      className="w-32 h-32 object-cover rounded-xl mb-2"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-sage-light/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {isDragActive ? (
                        <ImageIcon
                          size={28}
                          weight="light"
                          className="text-sage"
                        />
                      ) : (
                        <UploadSimple
                          size={28}
                          weight="light"
                          className="text-sage"
                        />
                      )}
                    </div>
                  )}
                  <div>
                    <p className="text-base font-medium text-charcoal">
                      {isDragActive
                        ? "Drop your menu here"
                        : "Drop a menu photo here, or click to upload"}
                    </p>
                    <p className="mt-1 text-sm text-warm-gray/60">
                      JPG, PNG or WebP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Loading state */
            <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-12 md:p-16">
                <div className="flex flex-col items-center gap-4">
                  {preview && (
                    <img
                      src={preview}
                      alt="Menu preview"
                      className="w-32 h-32 object-cover rounded-xl mb-2 opacity-60"
                    />
                  )}
                  <SpinnerGap
                    size={32}
                    weight="light"
                    className="text-sage animate-spin"
                  />
                  <div>
                    <p className="text-base font-medium text-charcoal">
                      Reading your menu...
                    </p>
                    <p className="mt-1 text-sm text-warm-gray/60">
                      This takes about 10 seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-600/80">{error}</p>
          )}

          {/* Demo menus */}
          <div className="mt-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-warm-gray/50 mb-4">
              Or try a demo menu
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {DEMO_MENUS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => router.push(`/demo/menu/${demo.id}`)}
                  className="group inline-flex items-center gap-2 rounded-full bg-charcoal/[0.04] px-5 py-2.5 text-sm font-medium text-warm-gray hover:bg-charcoal/[0.08] hover:text-charcoal transition-all duration-300"
                >
                  <span>
                    {demo.id === "demo-italian"
                      ? "Italian Restaurant"
                      : "Dutch Bistro"}
                  </span>
                  <ArrowRight
                    size={14}
                    weight="bold"
                    className="text-warm-gray/40 group-hover:text-sage group-hover:translate-x-0.5 transition-all duration-300"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
