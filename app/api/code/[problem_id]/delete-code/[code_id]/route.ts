import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { problem_id: string; code_id: string } }
) {
  try {
    const { problem_id, code_id } = params;
    // Delete the code entry with matching code_id and problem_id
    const deleted = await prisma.code.deleteMany({
      where: {
        code_id,
        problem_id: Number(problem_id),
      },
    });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Code not found" }, { status: 404 });
    }

    // Update the updated_at of the related problem
    await prisma.problem.update({
      where: { problem_id: Number(params.problem_id) },
      data: { updated_at: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete code" },
      { status: 500 }
    );
  }
}
