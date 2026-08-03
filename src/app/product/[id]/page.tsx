import ProductDetailClient from "./page-client";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const product = await prisma.product.findFirst({
      where: { id: params.id },
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

export default function Page() {
  return <ProductDetailClient />;
}
