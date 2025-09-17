import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    const problems = await prisma.userProblemStatus.findMany({
      where: { user_id: userId },
      select: {
        problem_id: true,
        user_id: true,
        status: true,
        note: true,
        _count: {
          select: { codes: true },
        },
      },
    });
    // Optionally, you can flatten _count.codes to codeCount for easier frontend use
    const problemsWithCodeCount = problems.map((p) => ({
      ...p,
      codeCount: p._count.codes,
    }));
    return NextResponse.json(problemsWithCodeCount);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
