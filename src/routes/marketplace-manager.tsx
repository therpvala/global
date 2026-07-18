import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MarketplaceTopBar, type SectionId } from "@/components/marketplace/TopBar";
import { DashboardSection } from "@/components/marketplace/sections/DashboardSection";
import * as S from "@/components/marketplace/sections";

export const Route = createFileRoute("/marketplace-manager")({
  head: () => ({ meta: [{ title: "Marketplace Manager — SaaS Vala" }] }),
  component: MarketplaceManagerPage,
});

function MarketplaceManagerPage() {
  const [section, setSection] = useState<SectionId>("dashboard");
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background text-foreground">
      <MarketplaceTopBar active={section} onChange={setSection} />
      <main>{renderSection(section)}</main>
    </div>
  );
}

function renderSection(id: SectionId) {
  const map: Record<string, React.ComponentType> = {
    dashboard: DashboardSection,
    hero: S.HeroBannerSection, categories: S.CategoriesSection, walls: S.WallsSection,
    placement: S.PlacementSection, cards: S.CardsSection, actions: S.ActionsSection,
    offers: S.OffersSection, popups: S.PopupsSection, partners: S.PartnersSection,
    trust: S.TrustSection, reviews: S.ReviewsSection, faq: S.FaqSection,
    contact: S.ContactSection, search: S.SearchSection, ai: S.AiSection,
    seo: S.SeoSection, sticky: S.StickySection, analytics: S.AnalyticsSection,
    settings: S.SettingsSection, storefronttopbar: S.StorefrontTopBarSection,
    footer: S.FooterSection, filters: S.FiltersSection, upcoming: S.UpcomingSection,
    notifications: S.NotificationsSection, layoutorder: S.LayoutOrderSection,
    deployment: S.DeploymentSection, integrity: S.IntegritySection,
    microfeatures: S.MicroFeaturesSection, toolkit: S.ToolkitSection,
    topbarmanager: S.TopBarManagerSection, homepagerows: S.HomepageRowsSection,
    cardmanager: S.CardManagerSection, products: S.ProductsSection,
    productcontent: S.ProductContentSection, productmedia: S.ProductMediaSection,
    demo: S.DemoSection, blog: S.BlogSection, pricing: S.PricingSection,
    license: S.LicenseSection, downloads: S.DownloadsSection, customers: S.CustomersSection,
    orders: S.OrdersSection, payments: S.PaymentsSection, releases: S.ReleasesSection,
    authors: S.AuthorsSection, vendors: S.VendorsSection, resellers: S.ResellersSection,
    affiliate: S.AffiliateSection, influencer: S.InfluencerSection, qr: S.QrSection,
    support: S.SupportSection, media: S.MediaLibrarySection,
    aiproviders: S.AiProvidersSection, api: S.ApiSection, reports: S.ReportsSection,
    marketing: S.MarketingSection, automation: S.AutomationSection,
    security: S.SecuritySection, system: S.SystemSection, integrations: S.IntegrationsSection,
    extra: S.ExtraSection, authorapproval: S.AuthorApprovalSection,
    moderation: S.ModerationSection, demodomain: S.DemoDomainSection,
    demosandbox: S.DemoSandboxSection, producturl: S.ProductUrlSection,
    faviconprotection: S.FaviconProtectionSection, seoautomation: S.SeoAutomationSection,
    leads: S.LeadsSection, aicontent: S.AiContentSection,
    securityscan: S.SecurityScanSection, qualitycheck: S.QualityCheckSection,
    productanalytics: S.ProductAnalyticsSection, auditlog: S.AuditLogSection,
  };
  const C = map[id] ?? DashboardSection;
  return <C />;
}
