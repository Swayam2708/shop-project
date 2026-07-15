import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET handler to retrieve a single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const p = await prisma.product.findUnique({
      where: { id },
    });
    if (!p) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    const mapped = {
      ...p,
      details: p.details ? p.details.split(" | ") : [],
    };
    return NextResponse.json({ success: true, product: mapped });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT handler to update details of a product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, price, subCategory, description, materials, image } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        subCategory,
        description,
        materials,
        image,
      },
    });

    return NextResponse.json({
      success: true,
      product: updated,
    });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}
