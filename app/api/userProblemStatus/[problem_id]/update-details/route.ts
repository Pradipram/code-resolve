import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserProblemStatusUpdatingInterface } from "@/data/types";

// Function to handle updating a problem
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

    // Build update data dynamically
    const updateData: UserProblemStatusUpdatingInterface = {};
    if (body.code !== undefined) updateData.code = body.code;
    if (body.note !== undefined) updateData.note = body.note;

    const updated = await prisma.userProblemStatus.upsert({
      where: {
        user_id_problem_id: {
          problem_id: problem_id,
          user_id: userId,
        },
      },
      create: {
        user_id: userId,
        problem_id: problem_id,
        status: body.status || "Unsolved",
        ...updateData,
      },
      update: {
        ...updateData,
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating user problem status:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
