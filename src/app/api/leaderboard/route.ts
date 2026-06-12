import { prisma } from "@/lib/prisma";

// GET /api/leaderboard — Top 50 users by best WPM
export async function GET() {
  try {
    // Get best result for each user, ordered by WPM
    const results = await prisma.practiceResult.findMany({
      orderBy: { wpm: "desc" },
      take: 200,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // Deduplicate by user — keep only their best result
    const seen = new Set<string>();
    const entries = results
      .filter((r) => {
        if (seen.has(r.userId)) return false;
        seen.add(r.userId);
        return true;
      })
      .slice(0, 50)
      .map((r, i) => ({
        rank: i + 1,
        name: r.user.name || r.user.email.split("@")[0],
        wpm: Math.round(r.wpm),
        accuracy: Math.round(r.accuracy),
        maxCombo: r.maxCombo,
        date: r.createdAt.toISOString(),
      }));

    return Response.json({ entries });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return Response.json({ entries: [] });
  }
}
