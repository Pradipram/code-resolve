import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code_id: string }> }
) {
  const params = await context.params;
  const code_id = params?.code_id;
  if (!code_id) {
    return NextResponse.json({ error: "Missing code_id" }, { status: 400 });
  }
  try {
    const code = await prisma.code.findUnique({
      where: { code_id },
      select: {
        code_id: true,
        title: true,
        language: true,
        code: true,
        created_at: true,
        updated_at: true,
        problem_id: true,
        // note: true, // Uncomment if you want to return note
      },
    });
    if (!code) {
      return NextResponse.json({ error: "Code not found" }, { status: 404 });
    }
    return NextResponse.json(code);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
