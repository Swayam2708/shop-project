import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products as defaultProducts } from "@/data/products";

export const dynamic = "force-dynamic";

// GET all products (seeds defaults if DB is empty)
export async function GET() {
  try {
    let dbProducts = await prisma.product.findMany();

    // Dynamically seed/backfill missing products
    let dbUpdated = false;
    for (const p of defaultProducts) {
      const exists = dbProducts.some((dp) => dp.id === p.id);
      if (!exists) {
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
        dbUpdated = true;
      }
    }

    if (dbUpdated) {
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

// POST handler to add a new product to the catalog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, subCategory, price, rating, image, description, materials, details } = body;

    const created = await prisma.product.create({
      data: {
        id: id || `oj-custom-${Date.now()}`,
        name,
        category: category || "new-arrivals",
        subCategory: subCategory || "Rings",
        price: parseFloat(price) || 0,
        rating: parseFloat(rating) || 5.0,
        image: image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
        description: description || "",
        materials: materials || "",
        details: Array.isArray(details) ? details.join(" | ") : details || "",
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        ...created,
        details: created.details ? created.details.split(" | ") : [],
      },
    });
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
