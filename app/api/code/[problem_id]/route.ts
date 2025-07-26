import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { problem_id: string } }
) {
  const { problem_id } = params;
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
    return NextResponse.json(newCode);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add code" }, { status: 500 });
  }
}
