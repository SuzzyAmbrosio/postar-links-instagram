import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

const allowedKeys = [
  "instagramAccountId",
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

function sanitizePayload(body: any) {
  return allowedKeys.reduce((acc: any, key) => {
    if (body[key] !== undefined) acc[key] = body[key]
    return acc
  }, {})
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const instagramAccountId = searchParams.get("instagramAccountId")

    if (!instagramAccountId) {
      return NextResponse.json({ error: "Conta não informada" }, { status: 400 })
    }

    const account = await prisma.instagramAccount.findFirst({
      where: { id: instagramAccountId, userId: session.user.id },
    })

    if (!account) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 })
    }

    const config = await prisma.channelConfig.upsert({
      where: { instagramAccountId },
      update: {},
      create: {
        userId: session.user.id,
        instagramAccountId,
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error("Erro ao buscar configuração do Instagram:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = sanitizePayload(await req.json())
    const instagramAccountId = body.instagramAccountId

    if (!instagramAccountId) {
      return NextResponse.json({ error: "Conta não informada" }, { status: 400 })
    }

    const account = await prisma.instagramAccount.findFirst({
      where: { id: instagramAccountId, userId: session.user.id },
    })

    if (!account) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 })
    }

    delete body.instagramAccountId

    const config = await prisma.channelConfig.upsert({
      where: { instagramAccountId },
      update: body,
      create: {
        ...body,
        userId: session.user.id,
        instagramAccountId,
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error("Erro ao salvar configuração do Instagram:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
