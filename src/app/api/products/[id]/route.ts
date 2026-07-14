import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
