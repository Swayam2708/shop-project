import { prisma } from "@/lib/prisma";
import CategoryPageClient from "./page-client";
import { products as defaultProducts, type Product } from "@/data/products";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    // Prefetch all products and customizations on the server side (instant)
    const dbProducts = await prisma.product.findMany({
      orderBy: { id: "asc" }
    });
    const customContent = await prisma.customContent.findMany();

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

    return (
      <CategoryPageClient
        initialDbProducts={mappedProducts.length > 0 ? mappedProducts : defaultProducts}
        initialCustomText={customText}
        initialCustomizedImages={customizedImages}
      />
    );
  } catch (error) {
    console.error("Failed to load category server data:", error);
    return (
      <CategoryPageClient
        initialDbProducts={defaultProducts}
        initialCustomText={{}}
        initialCustomizedImages={{}}
      />
    );
  }
}
