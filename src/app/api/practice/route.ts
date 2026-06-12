import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// GET /api/practice — Get user's practice records
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  const results = await prisma.practiceResult.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return Response.json({ results });
}

// POST /api/practice — Save a practice result
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { wpm, accuracy, maxCombo, durationSec, contentType, difficulty, mode } = body;

    if (typeof wpm !== "number" || typeof accuracy !== "number") {
      return Response.json({ error: "参数错误" }, { status: 400 });
    }

    const result = await prisma.practiceResult.create({
      data: {
        userId: session.user.id,
        wpm,
        accuracy,
        maxCombo: maxCombo || 0,
        durationSec: durationSec || 0,
        contentType: contentType || "english",
        difficulty: difficulty || "easy",
        mode: mode || "practice",
      },
    });

    return Response.json({ result }, { status: 201 });
  } catch (error) {
    console.error("Save practice error:", error);
    return Response.json({ error: "保存失败" }, { status: 500 });
  }
}
