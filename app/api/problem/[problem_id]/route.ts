import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ problem_id: string }> }
) {
  const params = await context.params;
  const problem_id = params?.problem_id;
  if (!problem_id) {
    return NextResponse.json({ error: "Missing problem_id" }, { status: 400 });
  }
  try {
    const problem = await prisma.problem.findUnique({
      where: { problem_id: Number(problem_id) },
      include: {
        codes: {
          orderBy: { updated_at: "desc" },
        },
      },
    });
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    return NextResponse.json(problem);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
