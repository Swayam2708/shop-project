import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products as defaultProducts } from "@/data/products";

export const dynamic = "force-dynamic";

// GET all products (seeds defaults if DB is empty)
export async function GET() {
  try {
    let dbProducts = await prisma.product.findMany();

    if (dbProducts.length === 0) {
      // Seed default products
      for (const p of defaultProducts) {
        await prisma.product.create({
          data: {
            id: p.id,
            name: p.name,
            category: p.category,
            subCategory: p.subCategory,
            price: p.price,
            rating: p.rating,
            image: p.image,
            description: p.description,
            materials: p.materials,
            details: p.details.join(" | "),
          },
        });
      }
      dbProducts = await prisma.product.findMany();
    }

    const mapped = dbProducts.map((p) => ({
      ...p,
      details: p.details ? p.details.split(" | ") : [],
    }));

    return NextResponse.json({
      success: true,
      products: mapped,
    });
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
