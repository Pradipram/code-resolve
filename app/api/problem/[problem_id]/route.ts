import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { problem_id: string } }
) {
  const { problem_id } = params;
  if (!problem_id) {
    return NextResponse.json({ error: "Missing problem_id" }, { status: 400 });
  }
  try {
    const problem = await prisma.problem.findUnique({
      where: { problem_id: Number(problem_id) },
      include: { codes: true },
    });
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    return NextResponse.json(problem);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
