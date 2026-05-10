import { NextResponse } from "next/server"

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/instagram/callback`,
    scope: 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement',
    response_type: 'code',
    state: 'instagram_auth'
  })

  const url = `https://www.facebook.com/v18.0/dialog/oauth?${params}`
  return NextResponse.json({ url })
}