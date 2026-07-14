import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET all custom content edits
export async function GET() {
  try {
    const items = await prisma.customContent.findMany();
    // Convert array of [{ key, value }] to dictionary { key: value }
    const dictionary: Record<string, string> = {};
    items.forEach((item) => {
      dictionary[item.key] = item.value;
    });

    return NextResponse.json({
      success: true,
      content: dictionary,
    });
  } catch (error: any) {
    console.error("Failed to fetch custom content:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch custom content" },
      { status: 500 }
    );
  }
}

// POST/UPSERT custom content edits
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Key is required" },
        { status: 400 }
      );
    }

    const item = await prisma.customContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error: any) {
    console.error("Failed to update custom content:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update custom content" },
      { status: 500 }
    );
  }
}

// DELETE all custom content edits (Reset defaults)
export async function DELETE() {
  try {
    await prisma.customContent.deleteMany();
    return NextResponse.json({
      success: true,
      message: "All custom content successfully deleted.",
    });
  } catch (error: any) {
    console.error("Failed to delete custom content:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset custom content" },
      { status: 500 }
    );
  }
}
