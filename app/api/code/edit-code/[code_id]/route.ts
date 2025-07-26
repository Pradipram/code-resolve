import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { code_id: string } }
) {
  const { code_id } = params;
  if (!code_id) {
    return NextResponse.json({ error: "Missing code_id" }, { status: 400 });
  }
  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    // Update the code
    const updated = await prisma.code.update({
      where: { code_id },
      data: {
        code: data.code,
        updated_at: new Date(),
      },
      select: {
        code_id: true,
        title: true,
        language: true,
        code: true,
        note: true,
        updated_at: true,
        problem_id: true,
      },
    });

    // Also update the updated_at of the related problem
    if (data.problem_id) {
      await prisma.problem.update({
        where: { problem_id: data.problem_id },
        data: { updated_at: new Date() },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
