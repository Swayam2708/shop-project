import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET endpoint to verify database connectivity
export async function GET() {
  try {
    // Perform a basic query to check connection
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      success: true,
      connected: true,
    });
  } catch (error: any) {
    console.error("Database connection check failed:", error);
    return NextResponse.json({
      success: false,
      connected: false,
      error: error.message || "Database connection failed",
    });
  }
}
