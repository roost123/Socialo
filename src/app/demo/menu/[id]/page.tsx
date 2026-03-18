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
  Plus,
  Trash,
  SpinnerGap,
  FloppyDisk,
} from "@phosphor-icons/react";
import type { MenuData, MenuCategory, MenuItem } from "@/lib/types";

type Tab = "edit" | "preview";

export default function MenuDashboard() {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<Tab>("edit");
  const qrRef = useRef<HTMLDivElement>(null);

  const menuUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/menu/${menu?.id ?? id}`
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

  const saveMenu = async () => {
    if (!menu) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menu),
      });
      if (res.ok) {
        const updated = await res.json();
        setMenu(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // silently fail for demo
    }
    setSaving(false);
  };

  const updateBranding = (field: string, value: string) => {
    if (!menu) return;
    setMenu({
      ...menu,
      branding: { ...menu.branding, [field]: value },
    });
    setSaved(false);
  };

  const updateCategory = (index: number, name: string) => {
    if (!menu) return;
    const cats = [...menu.categories];
    cats[index] = { ...cats[index], name };
    setMenu({ ...menu, categories: cats });
    setSaved(false);
  };

  const addCategory = () => {
    if (!menu) return;
    setMenu({
      ...menu,
      categories: [
        ...menu.categories,
        { name: "New Category", items: [] },
      ],
    });
    setSaved(false);
  };

  const removeCategory = (index: number) => {
    if (!menu) return;
    setMenu({
      ...menu,
      categories: menu.categories.filter((_, i) => i !== index),
    });
    setSaved(false);
  };

  const updateItem = (
    catIndex: number,
    itemIndex: number,
    field: keyof MenuItem,
    value: string | null
  ) => {
    if (!menu) return;
    const cats = [...menu.categories];
    const items = [...cats[catIndex].items];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    cats[catIndex] = { ...cats[catIndex], items };
    setMenu({ ...menu, categories: cats });
    setSaved(false);
  };

  const addItem = (catIndex: number) => {
    if (!menu) return;
    const cats = [...menu.categories];
    cats[catIndex] = {
      ...cats[catIndex],
      items: [
        ...cats[catIndex].items,
        { name: "", description: null, price: null, imageUrl: null },
      ],
    };
    setMenu({ ...menu, categories: cats });
    setSaved(false);
  };

  const removeItem = (catIndex: number, itemIndex: number) => {
    if (!menu) return;
    const cats = [...menu.categories];
    cats[catIndex] = {
      ...cats[catIndex],
      items: cats[catIndex].items.filter((_, i) => i !== itemIndex),
    };
    setMenu({ ...menu, categories: cats });
    setSaved(false);
  };

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
      a.download = `menu-qr-${menu?.id ?? id}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-cream">
        <div className="text-warm-gray text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4 bg-cream">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-2">Not found</h1>
          <a
            href="/demo/menu"
            className="text-sm text-sage hover:text-sage/80"
          >
            Go back
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
    <div className="min-h-[100dvh] bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-cream/80 backdrop-blur-xl border-b border-charcoal/5 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a
            href="/demo/menu"
            className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-charcoal transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Back</span>
          </a>

          <div className="flex items-center gap-2">
            {/* Tab switcher */}
            <div className="flex rounded-full bg-charcoal/[0.04] p-0.5">
              <button
                onClick={() => setTab("edit")}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tab === "edit"
                    ? "bg-charcoal text-cream"
                    : "text-warm-gray hover:text-charcoal"
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tab === "preview"
                    ? "bg-charcoal text-cream"
                    : "text-warm-gray hover:text-charcoal"
                }`}
              >
                Share
              </button>
            </div>

            <button
              onClick={saveMenu}
              disabled={saving || saved}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 active:scale-[0.98] ${
                saved
                  ? "bg-sage text-white"
                  : "bg-charcoal text-cream hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
              }`}
            >
              {saving ? (
                <SpinnerGap size={14} weight="bold" className="animate-spin" />
              ) : saved ? (
                <Check size={14} weight="bold" />
              ) : (
                <FloppyDisk size={14} weight="bold" />
              )}
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {tab === "edit" ? (
          <div className="max-w-3xl mx-auto">
            {/* Branding */}
            <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5 mb-6">
              <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray mb-4">
                  Restaurant details
                </h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs text-warm-gray/60 mb-1.5">
                      Restaurant name
                    </label>
                    <input
                      type="text"
                      value={menu.branding.restaurantName}
                      onChange={(e) =>
                        updateBranding("restaurantName", e.target.value)
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-cream border border-charcoal/[0.08] text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-warm-gray/60 mb-1.5">
                      Tagline (optional)
                    </label>
                    <input
                      type="text"
                      value={menu.branding.tagline ?? ""}
                      onChange={(e) =>
                        updateBranding("tagline", e.target.value || null as unknown as string)
                      }
                      placeholder="e.g. Traditional Italian since 1987"
                      className="w-full px-3 py-2.5 rounded-xl bg-cream border border-charcoal/[0.08] text-sm text-charcoal placeholder:text-warm-gray/30 focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-xs text-warm-gray/50">
                {menu.categories.length} categories, {totalItems} items
              </p>
              <p className="text-xs text-warm-gray/50">
                Review and edit everything below, then hit Save.
              </p>
            </div>

            {/* Categories */}
            {menu.categories.map((category, catIndex) => (
              <div
                key={catIndex}
                className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5 mb-4"
              >
                <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-6">
                  {/* Category header */}
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) =>
                        updateCategory(catIndex, e.target.value)
                      }
                      className="text-sm font-semibold uppercase tracking-[0.1em] text-sage bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                    />
                    <button
                      onClick={() => removeCategory(catIndex)}
                      className="p-1.5 text-warm-gray/30 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash size={14} weight="light" />
                    </button>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="group relative p-3 rounded-xl bg-cream/50 border border-charcoal/[0.04]"
                      >
                        <button
                          onClick={() => removeItem(catIndex, itemIndex)}
                          className="absolute top-2 right-2 p-1 text-warm-gray/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash size={12} weight="light" />
                        </button>
                        <div className="grid gap-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                updateItem(
                                  catIndex,
                                  itemIndex,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Dish name"
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-charcoal/[0.06] text-sm font-medium text-charcoal placeholder:text-warm-gray/30 focus:outline-none focus:ring-1 focus:ring-sage/20 transition-all"
                            />
                            <input
                              type="text"
                              value={item.price ?? ""}
                              onChange={(e) =>
                                updateItem(
                                  catIndex,
                                  itemIndex,
                                  "price",
                                  e.target.value || null
                                )
                              }
                              placeholder="Price"
                              className="w-24 px-2.5 py-1.5 rounded-lg bg-white border border-charcoal/[0.06] text-sm text-charcoal placeholder:text-warm-gray/30 focus:outline-none focus:ring-1 focus:ring-sage/20 transition-all text-right"
                            />
                          </div>
                          <textarea
                            value={item.description ?? ""}
                            onChange={(e) =>
                              updateItem(
                                catIndex,
                                itemIndex,
                                "description",
                                e.target.value || null
                              )
                            }
                            placeholder="Description (optional)"
                            rows={1}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-charcoal/[0.06] text-xs text-warm-gray placeholder:text-warm-gray/30 focus:outline-none focus:ring-1 focus:ring-sage/20 transition-all resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add item */}
                  <button
                    onClick={() => addItem(catIndex)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-sage hover:text-sage/80 font-medium transition-colors"
                  >
                    <Plus size={12} weight="bold" />
                    Add dish
                  </button>
                </div>
              </div>
            ))}

            {/* Add category */}
            <button
              onClick={addCategory}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-charcoal/[0.08] text-sm text-warm-gray/40 hover:text-warm-gray hover:border-charcoal/[0.15] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} weight="bold" />
              Add category
            </button>
          </div>
        ) : (
          /* Share tab */
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-charcoal mb-2">
                Your menu is ready
              </h2>
              <p className="text-sm text-warm-gray font-light">
                Print the QR code and put it on your tables. Guests scan it,
                pick their language, and read your menu.
              </p>
            </div>

            {/* QR Code */}
            <div className="rounded-[2rem] bg-charcoal/[0.03] ring-1 ring-charcoal/[0.05] p-1.5 mb-6">
              <div className="rounded-[calc(2rem-0.375rem)] bg-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] p-10 flex flex-col items-center">
                <div ref={qrRef}>
                  <QRCodeSVG
                    value={menuUrl}
                    size={220}
                    bgColor="#FDFBF7"
                    fgColor="#1A1A18"
                    level="M"
                  />
                </div>
                <p className="mt-4 text-sm font-medium text-charcoal">
                  {menu.branding.restaurantName}
                </p>
                <p className="mt-1 text-xs text-warm-gray/50">
                  Scan to view menu in 80+ languages
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={downloadQR}
                className="group flex items-center justify-center gap-2 rounded-full bg-charcoal text-cream px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98]"
              >
                <DownloadSimple size={16} weight="bold" />
                Download QR code (print-ready)
              </button>

              <button
                onClick={copyLink}
                className="group flex items-center justify-center gap-2 rounded-full bg-charcoal/[0.04] text-charcoal px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:bg-charcoal/[0.08] active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check size={16} weight="bold" className="text-sage" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} weight="bold" />
                    Copy menu link
                  </>
                )}
              </button>

              <a
                href={`/menu/${menu.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 rounded-full bg-charcoal/[0.04] text-charcoal px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:bg-charcoal/[0.08] active:scale-[0.98]"
              >
                <Eye size={16} weight="bold" />
                Preview as guest
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
