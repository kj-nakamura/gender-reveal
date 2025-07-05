// app/reveals/actions.ts
'use server'

import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'

// 共有用のランダムな文字列を生成するシンプルな関数
const generateSlug = () => {
  return Math.random().toString(36).substring(2, 10)
}

// 本体となる関数
export const createReveal = async (templateId: string, gender: 'boy' | 'girl') => {
  const supabase = await createClient()

  // 1. ログインしているユーザー情報を取得
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // もし未ログインなら、ログインページに強制移動
    return redirect('/login')
  }

  // 2. 共有用のユニークな文字列を生成
  const slug = generateSlug()

  // 3. データを 'reveals' テーブルに保存
  const { error } = await supabase.from('reveals').insert({
    user_id: user.id,
    template_id: templateId,
    gender: gender,
    share_slug: slug,
  })

  if (error) {
    // データベースエラーが発生した場合
    console.error('Error creating reveal:', error)
    // エラーページにリダイレクトするなどの処理
    return redirect('/?message=error-creating-reveal')
  }

  // 成功したら、作成されたリビールページにリダイレクト
  redirect(`/reveal/${slug}`)
}