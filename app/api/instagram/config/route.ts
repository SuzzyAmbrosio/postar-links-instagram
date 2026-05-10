import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const instagramAccountId = searchParams.get("instagramAccountId");

  if (!instagramAccountId) {
    return NextResponse.json(
      { error: "Conta não informada" },
      { status: 400 }
    );
  }

  const config = await prisma.channelConfig.findUnique({
    where: {
      instagramAccountId,
    },
  });

  return NextResponse.json(config || {});
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const config = await prisma.channelConfig.upsert({
    where: {
      instagramAccountId: body.instagramAccountId,
    },
    update: body,
    create: {
      ...body,
      userId: session.user.id,
    },
  });

  return NextResponse.json(config);
}