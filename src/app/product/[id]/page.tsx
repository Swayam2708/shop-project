import ProductDetailClient from "./page-client";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { products as defaultProducts, type Product } from "@/data/products";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: { id },
    });

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
    const dbProducts = await prisma.product.findMany({
      orderBy: { id: "asc" }
    });
    const customContent = await prisma.customContent.findMany();

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

    const finalProducts = mappedProducts.length > 0 ? mappedProducts : defaultProducts;

    return (
      <ProductDetailClient
        productId={id}
        initialDbProducts={finalProducts}
        initialCustomText={customText}
        initialCustomizedImages={customizedImages}
      />
    );
  } catch (error) {
    console.error("Failed to load product detail server data:", error);
    // Fallback if database query fails
    return <ProductDetailClient productId={(await params).id} initialDbProducts={defaultProducts} />;
  }
}
