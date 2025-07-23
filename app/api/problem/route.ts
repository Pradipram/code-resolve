import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    const body = await req.json();
    const newProblem = await prisma.problem.create({
      data: {
        user_id: userId,
        problem_name: body.problemName,
        problem_link: body.problemLink,
        platform: body.platform,
        level: body.level.toString(),
        status: body.status,
        language: body.language,
        code: body.code || "",
      },
    });

    return NextResponse.json(newProblem);
  } catch (error) {
    console.error("Error saving problem:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    const body = await req.json();
    const problemId = body.problem_id;
    if (!problemId) {
      return NextResponse.json(
        { error: "Missing problem_id" },
        { status: 400 }
      );
    }
    // Only delete if the problem belongs to the current user
    const deleted = await prisma.problem.deleteMany({
      where: {
        problem_id: problemId,
        user_id: userId,
      },
    });
    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Problem not found or not authorized" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    const problems = await prisma.problem.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function PUT(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    const body = await req.json();
    const problemId = body.problem_id;
    if (!problemId) {
      return NextResponse.json(
        { error: "Missing problem_id" },
        { status: 400 }
      );
    }

    // Build update data dynamically
    const updateData: any = { updated_at: new Date() };
    if (body.status !== undefined) updateData.status = body.status;
    if (body.code !== undefined) updateData.code = body.code;
    if (body.note !== undefined) updateData.note = body.note;

    const updated = await prisma.problem.updateMany({
      where: {
        problem_id: problemId,
        user_id: userId,
      },
      data: updateData,
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Problem not found or not authorized" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating problem:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
