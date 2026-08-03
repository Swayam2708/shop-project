import { prisma } from "@/lib/prisma";
import PageClient from "./page-client";
import { products as defaultProducts, type Product } from "@/data/products";

// Enable Incremental Static Regeneration (ISR) - Revalidate cached page every 60 seconds
export const revalidate = 60;

export default async function Page() {
  try {
    // Parallelize database queries for fast execution
    const [dbProducts, customContent] = await Promise.all([
      prisma.product.findMany({ orderBy: { id: "asc" } }).catch(() => []),
      prisma.customContent.findMany().catch(() => []),
    ]);

    // Map DB products to split specs details
    const mappedProducts = dbProducts.map((p) => ({
      ...p,
      category: p.category as any,
      details: p.details ? p.details.split(" | ") : [],
    })) as Product[];

    // Resolve overrides
    const customizedImages: Record<string, string> = {};
    const customText: Record<string, string> = {};

    customContent.forEach((item) => {
      if (item.key.startsWith("oj_custom_txt_")) {
        const cleanKey = item.key.replace("oj_custom_txt_", "");
        customText[cleanKey] = item.value;
      } else if (item.key.startsWith("oj_custom_img_")) {
        const cleanKey = item.key.replace("oj_custom_img_", "");
        customizedImages[cleanKey] = item.value;
      } else {
        if (
          item.key.startsWith("rev_avatar_") ||
          item.key.startsWith("cat_img_") ||
          item.key.startsWith("sil_cat_") ||
          item.key.startsWith("gallery_") ||
          item.key.includes("photo") ||
          item.key.includes("banner") ||
          item.value.startsWith("data:image/") ||
          item.value.startsWith("http")
        ) {
          customizedImages[item.key] = item.value;
        } else {
          customText[item.key] = item.value;
        }
      }
    });

    // Sanitize heavy base64 payload for initial SSR HTML script tag to keep page bundle under 200KB
    const sanitizedCustomizedImages: Record<string, string> = {};
    Object.entries(customizedImages).forEach(([k, v]) => {
      if (v.startsWith("data:image/") && v.length > 150000) {
        return; // Client-side fetch will hydrate large uploaded photos asynchronously
      }
      sanitizedCustomizedImages[k] = v;
    });

    return (
      <PageClient
        initialDbProducts={mappedProducts.length > 0 ? mappedProducts : defaultProducts}
        initialCustomText={customText}
        initialCustomizedImages={sanitizedCustomizedImages}
      />
    );
  } catch (error) {
    console.error("Failed to load page server data:", error);
    return (
      <PageClient
        initialDbProducts={defaultProducts}
        initialCustomText={{}}
        initialCustomizedImages={{}}
      />
    );
  }
}
