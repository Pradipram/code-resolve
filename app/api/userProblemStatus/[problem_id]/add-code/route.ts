import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
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
    return NextResponse.json(
      { error: "Problem ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      // Ensure userProblemStatus exists
      const userProblemStatus = await tx.userProblemStatus.upsert({
        where: {
          user_id_problem_id: {
            user_id: userId,
            problem_id: problem_id,
          },
        },
        update: {}, // nothing to update if already exists
        create: {
          user_id: userId,
          problem_id: problem_id,
          status: "Unsolved",
        },
      });

      // Create code linked to userProblemStatus
      const newCode = await tx.code.create({
        data: {
          user_problem_status_id: userProblemStatus.id,
          title: body.title,
          language: body.language,
          note: body.note,
          code: body.code,
        },
      });

      return newCode;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add code" }, { status: 500 });
  }
}
