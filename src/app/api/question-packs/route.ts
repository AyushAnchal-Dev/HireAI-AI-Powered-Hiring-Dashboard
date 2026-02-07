import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // Daily, Weekly

        const where: any = {};
        if (type) where.type = type;

        const packs = await prisma.questionPack.findMany({
            where,
            orderBy: { date: 'desc' },
            include: {
                problems: {
                    select: {
                        id: true,
                        title: true,
                        difficulty: true,
                        tags: true
                    }
                }
            },
            take: 5 // Latest 5 packs
        });

        return NextResponse.json(packs);
    } catch (error) {
        console.error("[PACKS_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
