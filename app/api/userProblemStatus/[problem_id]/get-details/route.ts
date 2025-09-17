import prisma from "@/lib/prisma";
import { getProblemNameFromProblemIdFromDSAList } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
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
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  try {
    const problem = await prisma.userProblemStatus.findUnique({
      where: {
        user_id_problem_id: {
          user_id: userId,
          problem_id: problem_id,
        },
      },
      include: {
        codes: {
          orderBy: { updated_at: "desc" },
        },
      },
    });
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    const problemName = getProblemNameFromProblemIdFromDSAList(
      Number(problem_id)
    );
    if (!problemName) {
      return NextResponse.json(
        { error: "Problem name not found" },
        { status: 404 }
      );
    }
    const problemWithName = { ...problem, problem_name: problemName };
    return NextResponse.json(problemWithName);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
