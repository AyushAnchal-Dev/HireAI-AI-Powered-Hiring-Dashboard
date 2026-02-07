import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                receivedMessages: {
                    include: { from: { select: { name: true, email: true } } },
                    orderBy: { createdAt: 'desc' }
                },
                sentMessages: {
                    include: { to: { select: { name: true, email: true } } },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        return NextResponse.json({
            received: user.receivedMessages,
            sent: user.sentMessages
        });
    } catch (error) {
        console.error("[MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { toId, toEmail, content } = await req.json();

        const sender = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!sender) return new NextResponse("User not found", { status: 404 });

        let receiverId = toId;

        // If email provided, lookup ID
        if (!receiverId && toEmail) {
            const receiver = await prisma.user.findUnique({
                where: { email: toEmail }
            });
            if (!receiver) return new NextResponse("Recipient user not found", { status: 404 });
            receiverId = receiver.id;
        }

        if (!receiverId) {
            return new NextResponse("Recipient required (toId or toEmail)", { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                fromId: sender.id,
                toId: receiverId,
                content,
            }
        });

        // SIMULATION: Offline Notification
        console.log(`[SIMULATION] Sending email notification to user ${toId}: "You have a new message from ${sender.name}"`);

        return NextResponse.json(message);
    } catch (error) {
        console.error("[MESSAGES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
