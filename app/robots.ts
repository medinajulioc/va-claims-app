import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://va-claims-app.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/dashboard/va-disability-calculator"],
      disallow: ["/api/*", "/bdoc/*", "/dashboard/(auth)/*", "/dashboard/(guest)/*"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
