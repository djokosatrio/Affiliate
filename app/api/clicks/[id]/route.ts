import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);

    // Update database
    await prisma.product.update({
      where: { id: productId },
      data: { 
        clicks: { increment: 1 },
        lastClickedAt: new Date() // Ini akan tersimpan dalam UTC (Standar Database)
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}