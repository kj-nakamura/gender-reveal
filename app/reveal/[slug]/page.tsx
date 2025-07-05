// app/reveal/[slug]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import TemplateA from "./_components/TemplateA";
import TemplateB from "./_components/TemplateB";

// ページのメイン部分
export default async function RevealPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // URLのslugを使って、データベースから該当するデータを取得
  const { data: reveal } = await supabase.from("reveals").select("template_id, gender").eq("share_slug", slug).single();

  // データが見つからなければ404ページを表示
  if (!reveal) {
    notFound();
  }

  // template_idに応じて、表示するコンポーネントを切り替える
  switch (reveal.template_id) {
    case "template_A":
      return <TemplateA gender={reveal.gender} />;
    case "template_B":
      return <TemplateB gender={reveal.gender} />;
    default:
      // 該当テンプレートがなければ404
      notFound();
  }
}
