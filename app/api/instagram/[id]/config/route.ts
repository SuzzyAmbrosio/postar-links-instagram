import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verifica se a conta pertence ao usuário
    const account = await prisma.instagramAccount.findFirst({
      where: { id, userId: session.user.id }
    })

    if (!account) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 })
    }

    // Busca ou cria config
    let config = await prisma.instagramConfig.findUnique({
      where: { accountId: id }
    })

    if (!config) {
      config = await prisma.instagramConfig.create({
        data: {
          accountId: id,
          userId: session.user.id,
        },
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Erro ao buscar config:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await req.json()

    // Verifica se a conta pertence ao usuário
    const account = await prisma.instagramAccount.findFirst({
      where: { id, userId: session.user.id }
    })

    if (!account) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 })
    }

    const config = await prisma.instagramConfig.upsert({
      where: { accountId: id },
      update: data,
      create: {
        accountId: id,
        ...data
      }
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error("Erro ao salvar config:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}