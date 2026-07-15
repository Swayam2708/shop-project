import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET all Udhaar records
export async function GET() {
  try {
    const records = await prisma.udhaarRecord.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, records });
  } catch (error: any) {
    console.error("Failed to fetch Udhaar records:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch Udhaar records" },
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
        const existing = await prisma.udhaarRecord.findUnique({
          where: { id: rec.id }
        });
        if (!existing) {
          const newRec = await prisma.udhaarRecord.create({
            data: {
              id: rec.id,
              name: rec.name,
              sonOf: rec.sonOf || "",
              phone: rec.phone || "",
              village: rec.village || "",
              amount: rec.amount || "0",
              discount: rec.discount || "0",
              paid: rec.paid || "0",
              dues: rec.dues || "0",
              date: rec.date,
              notes: rec.notes || "",
              aadhaar: rec.aadhaar || null,
              familyGroupId: rec.familyGroupId || null,
              familyRelationship: rec.familyRelationship || null,
              ornaments: rec.ornaments ? JSON.parse(JSON.stringify(rec.ornaments)) : null
            }
          });
          created.push(newRec);
        }
      }
      return NextResponse.json({ success: true, count: created.length });
    }

    // Single creation
    const newRec = await prisma.udhaarRecord.create({
      data: {
        id: body.id || Date.now().toString(),
        name: body.name,
        sonOf: body.sonOf || "",
        phone: body.phone || "",
        village: body.village || "",
        amount: body.amount || "0",
        discount: body.discount || "0",
        paid: body.paid || "0",
        dues: body.dues || "0",
        date: body.date,
        notes: body.notes || "",
        aadhaar: body.aadhaar || null,
        familyGroupId: body.familyGroupId || null,
        familyRelationship: body.familyRelationship || null,
        ornaments: body.ornaments ? JSON.parse(JSON.stringify(body.ornaments)) : null
      }
    });

    return NextResponse.json({ success: true, record: newRec });
  } catch (error: any) {
    console.error("Failed to create Udhaar record:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Udhaar record" },
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

    const updated = await prisma.udhaarRecord.update({
      where: { id },
      data: {
        name: body.name,
        sonOf: body.sonOf,
        phone: body.phone,
        village: body.village,
        amount: body.amount,
        discount: body.discount,
        paid: body.paid,
        dues: body.dues,
        date: body.date,
        notes: body.notes,
        aadhaar: body.aadhaar || null,
        familyGroupId: body.familyGroupId || null,
        familyRelationship: body.familyRelationship || null,
        ornaments: body.ornaments ? JSON.parse(JSON.stringify(body.ornaments)) : null
      }
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error: any) {
    console.error("Failed to update Udhaar record:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update Udhaar" },
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

    await prisma.udhaarRecord.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete Udhaar record:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete Udhaar" },
      { status: 500 }
    );
  }
}
