import { prisma } from "@/lib/prisma";
import PageClient from "./page-client";
import { products as defaultProducts, type Product } from "@/data/products";

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

    // Pass all custom images from database directly (includes user uploaded photos)
    const sanitizedCustomizedImages: Record<string, string> = customizedImages;

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
