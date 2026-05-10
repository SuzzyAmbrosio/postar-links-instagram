import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const {
    instagramAccountId,
    templateImageUrl,
    templateImageName,
    templateSource,
    corTitulo,
    corPreco,
  } = await req.json();

  if (!instagramAccountId) {
    return NextResponse.json(
      { error: "Conta do Instagram não informada" },
      { status: 400 }
    );
  }

  const config = await prisma.channelConfig.upsert({
    where: {
      instagramAccountId,
    },
    update: {
      templateImageUrl,
      templateImageName,
      templateSource,
      corTitulo,
      corPreco,
    },
    create: {
      userId: session.user.id,
      instagramAccountId,
      templateImageUrl,
      templateImageName,
      templateSource,
      corTitulo,
      corPreco,
    },
  });

  return NextResponse.json(config);
}