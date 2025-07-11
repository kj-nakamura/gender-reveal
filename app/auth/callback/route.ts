import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // パスワードリセットの場合は reset-password ページにリダイレクト
      const type = searchParams.get('type')
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/reset-password', request.url))
      }
      // 認証成功時はマイページにリダイレクト
      return NextResponse.redirect(new URL('/mypage', request.url))
    }
  }

  // エラーの場合はログインページにリダイレクト
  return NextResponse.redirect(new URL('/login?message=auth_error', request.url))
}