import ProductDetailClient from "./page-client";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { products as defaultProducts, type Product } from "@/data/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = defaultProducts.find((p) => p.id === id);

    if (!product) {
      return {
        title: "Omar Jewellers | Premium Gold Jewelry",
        description: "Discover fine gold jewelry and custom bridal wear at Omar Jewellers Chowk Shahabad.",
      };
    }

    return {
      title: `${product.name} | Omar Jewellers OJ`,
      description: `${product.description} BIS 916 Hallmarked premium gold.`,
      openGraph: {
        title: `${product.name} - Omar Jewellers`,
        description: product.description,
        images: [
          {
            url: product.image,
            width: 800,
            height: 800,
            alt: product.name,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Omar Jewellers | Premium Gold Jewelry",
      description: "Discover fine gold jewelry and custom bridal wear at Omar Jewellers Chowk Shahabad.",
    };
  }
}

export default async function Page({ params }: PageProps) {
  try {
    const { id } = await params;
    const [dbProducts, customContent] = await Promise.all([
      prisma.product.findMany({ orderBy: { id: "asc" } }).catch(() => []),
      prisma.customContent.findMany().catch(() => []),
    ]);

    const mappedProducts = dbProducts.map((p) => ({
      ...p,
      category: p.category as any,
      details: p.details ? p.details.split(" | ") : [],
    })) as Product[];

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

    // Sanitize heavy base64 payload for initial SSR HTML script tag
    const sanitizedCustomizedImages: Record<string, string> = {};
    Object.entries(customizedImages).forEach(([k, v]) => {
      if (v.startsWith("data:image/") && v.length > 150000) {
        return; // Client-side fetch will hydrate large uploaded photos asynchronously
      }
      sanitizedCustomizedImages[k] = v;
    });

    const finalProducts = mappedProducts.length > 0 ? mappedProducts : defaultProducts;

    return (
      <ProductDetailClient
        productId={id}
        initialDbProducts={finalProducts}
        initialCustomText={customText}
        initialCustomizedImages={sanitizedCustomizedImages}
      />
    );
  } catch (error) {
    console.error("Failed to load product detail server data:", error);
    // Fallback if database query fails
    return <ProductDetailClient productId={(await params).id} initialDbProducts={defaultProducts} />;
  }
}
