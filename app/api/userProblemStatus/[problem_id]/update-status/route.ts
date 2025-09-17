import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ problem_id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const params = await context.params;
  const problem_id = params?.problem_id;
  if (!problem_id) {
    return NextResponse.json({ error: "Missing problem_id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    if (!body.status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    const updatedUserProblemStatus = await prisma.userProblemStatus.upsert({
      where: {
        user_id_problem_id: {
          user_id: userId,
          problem_id: problem_id,
        },
      },
      create: {
        user_id: userId,
        problem_id: problem_id,
        status: body.status,
      },
      update: {
        status: body.status,
      },
    });
    return NextResponse.json({ updatedUserProblemStatus });
  } catch (error) {
    console.error("Error updating user problem status:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
