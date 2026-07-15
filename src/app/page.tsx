import { prisma } from "@/lib/prisma";
import PageClient from "./page-client";
import { products as defaultProducts } from "@/data/products";

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
      details: p.details ? p.details.split(" | ") : [],
    }));

    // Resolve overrides
    const customizedImages: Record<string, string> = {};
    const customText: Record<string, string> = {};

    customContent.forEach((item) => {
      if (item.key.startsWith("oj_custom_txt_")) {
        customText[item.key.replace("oj_custom_txt_", "")] = item.value;
      } else if (item.key.startsWith("oj_custom_img_")) {
        customizedImages[item.key.replace("oj_custom_img_", "")] = item.value;
      }
    });

    return (
      <PageClient
        initialDbProducts={mappedProducts.length > 0 ? mappedProducts : defaultProducts}
        initialCustomText={customText}
        initialCustomizedImages={customizedImages}
      />
    );
  } catch (error) {
    console.error("Failed to load page server data:", error);
    // Fallback gracefully to defaults if database fails to connect
    return (
      <PageClient
        initialDbProducts={defaultProducts}
        initialCustomText={{}}
        initialCustomizedImages={{}}
      />
    );
  }
}
