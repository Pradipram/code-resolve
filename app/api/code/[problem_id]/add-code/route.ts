import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ problem_id: string }> }
) {
  // Await params because Next's RouteContext provides params as a Promise
  const params = await context.params;
  const problem_id = params?.problem_id;
  // console.log("Adding code for problem_id:", problem_id);
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

    // Also update the updated_at of the related problem
    await prisma.problem.update({
      where: { problem_id: Number(problem_id) },
      data: { updated_at: new Date() },
    });

    return NextResponse.json(newCode);
  } catch {
    return NextResponse.json({ error: "Failed to add code" }, { status: 500 });
  }
}
