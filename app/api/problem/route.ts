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
