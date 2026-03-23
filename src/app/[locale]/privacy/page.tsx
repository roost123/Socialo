import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return {
    title: t("title") + " — Socialo",
    description: t("metaDescription"),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <main className="min-h-screen py-24 md:py-32 px-6">
      <div className="max-w-[680px] mx-auto">
        <a
          href={`/${locale === "nl" ? "" : locale}`}
          className="inline-flex items-center gap-1.5 text-small text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors mb-10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {t("backToHome")}
        </a>

        <h1 className="text-display text-[var(--text-heading)] mb-4">
          {t("title")}
        </h1>
        <p className="text-body text-[var(--text-muted)] mb-12">
          {t("lastUpdated")}
        </p>

        <div className="space-y-10 text-body text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-h2 text-[var(--text-heading)] mb-3">{t("sections.controller.heading")}</h2>
            <p>{t("sections.controller.body")}</p>
          </section>

          <section>
            <h2 className="text-h2 text-[var(--text-heading)] mb-3">{t("sections.whatData.heading")}</h2>
            <p className="mb-3">{t("sections.whatData.intro")}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{t("sections.whatData.items.name")}</li>
              <li>{t("sections.whatData.items.email")}</li>
              <li>{t("sections.whatData.items.chat")}</li>
              <li>{t("sections.whatData.items.technical")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 text-[var(--text-heading)] mb-3">{t("sections.purpose.heading")}</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{t("sections.purpose.items.contact")}</li>
              <li>{t("sections.purpose.items.improve")}</li>
              <li>{t("sections.purpose.items.security")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 text-[var(--text-heading)] mb-3">{t("sections.legal.heading")}</h2>
            <p>{t("sections.legal.body")}</p>
          </section>

          <section>
            <h2 className="text-h2 text-[var(--text-heading)] mb-3">{t("sections.thirdParties.heading")}</h2>
            <p className="mb-3">{t("sections.thirdParties.intro")}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{t("sections.thirdParties.items.cloudflare")}</li>
              <li>{t("sections.thirdParties.items.vercel")}</li>
              <li>{t("sections.thirdParties.items.resend")}</li>
            </ul>
            <p className="mt-3">{t("sections.thirdParties.noTracking")}</p>
          </section>

          <section>
            <h2 className="text-h2 text-[var(--text-heading)] mb-3">{t("sections.cookies.heading")}</h2>
            <p>{t("sections.cookies.body")}</p>
          </section>

          <section>
            <h2 className="text-h2 text-[var(--text-heading)] mb-3">{t("sections.retention.heading")}</h2>
            <p>{t("sections.retention.body")}</p>
          </section>

          <section>
            <h2 className="text-h2 text-[var(--text-heading)] mb-3">{t("sections.rights.heading")}</h2>
            <p className="mb-3">{t("sections.rights.intro")}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{t("sections.rights.items.access")}</li>
              <li>{t("sections.rights.items.rectification")}</li>
              <li>{t("sections.rights.items.erasure")}</li>
              <li>{t("sections.rights.items.objection")}</li>
              <li>{t("sections.rights.items.portability")}</li>
            </ul>
            <p className="mt-3">{t("sections.rights.contact")}</p>
          </section>

          <section>
            <h2 className="text-h2 text-[var(--text-heading)] mb-3">{t("sections.changes.heading")}</h2>
            <p>{t("sections.changes.body")}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
