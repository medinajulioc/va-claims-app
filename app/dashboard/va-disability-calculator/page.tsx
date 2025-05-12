import { Metadata } from "next";
import VADisabilityCalculator from "./components/VADisabilityCalculator";
import { generateVACalculatorStructuredData } from "./structured-data";

export const metadata: Metadata = {
  title: "VA Disability Calculator | 2025 Compensation Rates",
  description:
    "Calculate your VA disability compensation with our free calculator. Updated with official 2025 VA rates for accurate disability payment estimates.",
  keywords:
    "VA disability calculator, veterans disability calculator, VA compensation calculator, VA disability rates 2025, combined VA rating calculator",
  openGraph: {
    title: "VA Disability Calculator | 2025 Compensation Rates",
    description:
      "Calculate your VA disability compensation with our free calculator. Updated with official 2025 VA rates for accurate disability payment estimates.",
    type: "website",
    url: "/dashboard/va-disability-calculator",
    siteName: "VA Claims App",
    images: [
      {
        url: "/og-va-calculator.png",
        width: 1200,
        height: 630,
        alt: "VA Disability Calculator"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "VA Disability Calculator | 2025 Compensation Rates",
    description:
      "Calculate your VA disability compensation with our free calculator. Updated with official 2025 VA rates for accurate disability payment estimates.",
    images: ["/og-va-calculator.png"]
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: "/dashboard/va-disability-calculator"
  }
};

export default function Page() {
  // Get the base URL for structured data
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://va-claims-app.vercel.app";
  const pageUrl = `${baseUrl}/dashboard/va-disability-calculator`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateVACalculatorStructuredData(pageUrl))
        }}
      />
      <VADisabilityCalculator />
    </>
  );
}
