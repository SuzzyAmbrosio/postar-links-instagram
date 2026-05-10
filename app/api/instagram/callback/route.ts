import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error ||!code) {
    return NextResponse.redirect(new URL('/dashboard/canais-grupos?error=auth_failed', req.url))
  }

  try {
    // 1. Troca code por access_token
    const tokenRes = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/instagram/callback`,
        code
      })
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) throw new Error('Token não recebido')

    // 2. Pega as páginas do Facebook
    const pagesRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`)
    const pagesData = await pagesRes.json()
    
    if (!pagesData.data || pagesData.data.length === 0) {
      throw new Error('Nenhuma página do Facebook encontrada')
    }

    // 3. Pega a primeira página e busca o Instagram conectado
    const page = pagesData.data[0]
    const igRes = await fetch(
      `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
    )
    const igData = await igRes.json()

    if (!igData.instagram_business_account) {
      throw new Error('Nenhuma conta do Instagram Business conectada à página')
    }

    const igAccountId = igData.instagram_business_account.id

    // 4. Pega dados do Instagram
    const igDetailsRes = await fetch(
      `https://graph.facebook.com/v18.0/${igAccountId}?fields=username,profile_picture_url,followers_count&access_token=${page.access_token}`
    )
    const igDetails = await igDetailsRes.json()

    // 5. Salva no banco
    const account = await prisma.instagramAccount.upsert({
      where: { instagramUserId: igAccountId },
      update: {
        username: igDetails.username,
        accessToken: page.access_token,
        profilePicture: igDetails.profile_picture_url,
        followersCount: igDetails.followers_count || 0,
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        instagramUserId: igAccountId,
        username: igDetails.username,
        accountId: page.id,
        accessToken: page.access_token,
        profilePicture: igDetails.profile_picture_url,
        followersCount: igDetails.followers_count || 0,
        isActive: true
      }
    })

    // 6. Cria config padrão
    await prisma.instagramConfig.upsert({
      where: { accountId: account.id },
      update: {},
      create: {
        accountId: account.id,
        userId: account.userId,
      }
    })

    // 7. REDIRECIONA PRA PÁGINA DE EDIÇÃO
    return NextResponse.redirect(new URL(`/dashboard/canais-grupos/${account.id}`, req.url))

  } catch (e: any) {
    console.error('Erro no callback:', e)
    return NextResponse.redirect(new URL(`/dashboard/canais-grupos?error=${encodeURIComponent(e.message)}`, req.url))
  }
}