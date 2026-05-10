import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // MUDOU: Promise
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params // ADICIONA await aqui

    const account = await prisma.instagramAccount.findFirst({
      where: {
        id: id, // USA id
        userId: session.user.id,
      }
    })

    if (!account) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 })
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error("Erro ao buscar conta:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // MUDOU: Promise
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params // ADICIONA await aqui
    const data = await req.json()

    const account = await prisma.instagramAccount.updateMany({
      where: {
        id: id, // USA id
        userId: session.user.id,
      },
      data: {
        isActive: data.isActive,
        username: data.username,
        profilePicture: data.profilePicture,
      }
    })

    if (account.count === 0) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao atualizar conta:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // MUDOU: Promise
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params // ADICIONA await aqui

    await prisma.instagramAccount.deleteMany({
      where: {
        id: id, // USA id
        userId: session.user.id,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar conta:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}