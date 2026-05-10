import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function cleanChannelConfigPayload(data: any) {
  const allowedKeys = [
    "isActive",
    "postInLoop",
    "interval",
    "random",
    "horaInicio",
    "horaFim",
    "idioma",
    "moeda",
    "pais",
    "productLink",
    "keepLinkInPost",
    "header",
    "footer",
    "shopeeVideoLink",
    "useShopeeVideo",
    "precoOriginal",
    "precoAtual",
    "sufixoPreco",
    "precoParcelado",
    "descricao",
    "agendamento",
    "corTitulo",
    "corPreco",
    "templateImageUrl",
    "templateImageName",
    "templateSource",
    "tipoCupom",
    "valorDesconto",
    "valorMinimo",
    "valorMaximo",
    "codigoCupom",
    "postAuto",
    "desativarComentario",
    "agendamentoAtivo",
    "storyTemplateUrl",
    "textoRespostaStory",
    "textoBotaoLink",
    "diasSelecionados",
    "horariosSelecionados",
  ]

  return allowedKeys.reduce((acc: any, key) => {
    if (data[key] !== undefined) acc[key] = data[key]
    return acc
  }, {})
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params

    const account = await prisma.instagramAccount.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!account) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 })
    }

    const config = await prisma.channelConfig.upsert({
      where: { instagramAccountId: id },
      update: {},
      create: {
        userId: session.user.id,
        instagramAccountId: id,
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error("Erro ao buscar configuração do canal:", error)
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
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params
    const data = cleanChannelConfigPayload(await req.json())

    const account = await prisma.instagramAccount.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!account) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 })
    }

    const config = await prisma.channelConfig.upsert({
      where: { instagramAccountId: id },
      update: data,
      create: {
        userId: session.user.id,
        instagramAccountId: id,
        ...data,
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error("Erro ao salvar configuração do canal:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
