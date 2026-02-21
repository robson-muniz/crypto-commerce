import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Strict role check: Only Admins can approve/reject products
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate the requested status
    const validStatuses = ["PENDING_REVIEW", "ACTIVE", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status provided" }, { status: 400 });
    }

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error("[PRODUCT_STATUS_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}
