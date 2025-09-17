import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ problem_id: string }> }
) {
  const params = await context.params;
  const problem_id = params?.problem_id;
  if (!problem_id) {
    return NextResponse.json({ error: "Missing problem_id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const newCode = await prisma.code.create({
      data: {
        problem_id: Number(problem_id),
        title: body.title,
        language: body.language,
        note: body.note,
        code: body.code,
      },
    });
    return NextResponse.json(newCode);
  } catch {
    return NextResponse.json({ error: "Failed to add code" }, { status: 500 });
  }
}
