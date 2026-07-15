import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET all Girvi records
export async function GET() {
  try {
    const records = await prisma.girviRecord.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, records });
  } catch (error: any) {
    console.error("Failed to fetch Girvi records:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch Girvi records" },
      { status: 500 }
    );
  }
}

// POST: Create single or bulk sync
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Bulk sync support
    if (Array.isArray(body)) {
      const created = [];
      for (const rec of body) {
        // Check if already exists to prevent duplicate key violations
        const existing = await prisma.girviRecord.findUnique({
          where: { id: rec.id }
        });
        if (!existing) {
          const newRec = await prisma.girviRecord.create({
            data: {
              id: rec.id,
              name: rec.name,
              sonOf: rec.sonOf || "",
              phone: rec.phone || "",
              village: rec.village || "",
              amount: rec.amount || "0",
              interestRate: rec.interestRate || "0",
              interestPeriod: rec.interestPeriod || "monthly",
              interestType: rec.interestType || "simple",
              date: rec.date,
              status: rec.status || "active",
              releasedDate: rec.releasedDate || null,
              notes: rec.notes || "",
              aadhaar: rec.aadhaar || null,
              familyGroupId: rec.familyGroupId || null,
              familyRelationship: rec.familyRelationship || null,
              ornaments: JSON.parse(JSON.stringify(rec.ornaments)),
              amountAdditions: rec.amountAdditions ? JSON.parse(JSON.stringify(rec.amountAdditions)) : null
            }
          });
          created.push(newRec);
        }
      }
      return NextResponse.json({ success: true, count: created.length });
    }

    // Single creation
    const newRec = await prisma.girviRecord.create({
      data: {
        id: body.id || Date.now().toString(),
        name: body.name,
        sonOf: body.sonOf || "",
        phone: body.phone || "",
        village: body.village || "",
        amount: body.amount || "0",
        interestRate: body.interestRate || "0",
        interestPeriod: body.interestPeriod || "monthly",
        interestType: body.interestType || "simple",
        date: body.date,
        status: body.status || "active",
        releasedDate: body.releasedDate || null,
        notes: body.notes || "",
        aadhaar: body.aadhaar || null,
        familyGroupId: body.familyGroupId || null,
        familyRelationship: body.familyRelationship || null,
        ornaments: JSON.parse(JSON.stringify(body.ornaments)),
        amountAdditions: body.amountAdditions ? JSON.parse(JSON.stringify(body.amountAdditions)) : null
      }
    });

    return NextResponse.json({ success: true, record: newRec });
  } catch (error: any) {
    console.error("Failed to create Girvi record:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Girvi record" },
      { status: 500 }
    );
  }
}

// PUT: Update record by query id parameter
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Record ID is required" }, { status: 400 });
    }

    const body = await req.json();

    const updated = await prisma.girviRecord.update({
      where: { id },
      data: {
        name: body.name,
        sonOf: body.sonOf,
        phone: body.phone,
        village: body.village,
        amount: body.amount,
        interestRate: body.interestRate,
        interestPeriod: body.interestPeriod,
        interestType: body.interestType,
        date: body.date,
        status: body.status,
        releasedDate: body.releasedDate || null,
        notes: body.notes,
        aadhaar: body.aadhaar || null,
        familyGroupId: body.familyGroupId || null,
        familyRelationship: body.familyRelationship || null,
        ornaments: JSON.parse(JSON.stringify(body.ornaments)),
        amountAdditions: body.amountAdditions ? JSON.parse(JSON.stringify(body.amountAdditions)) : null
      }
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error: any) {
    console.error("Failed to update Girvi record:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update Girvi" },
      { status: 500 }
    );
  }
}

// DELETE: Delete record by query id parameter
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Record ID is required" }, { status: 400 });
    }

    await prisma.girviRecord.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete Girvi record:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete Girvi" },
      { status: 500 }
    );
  }
}
