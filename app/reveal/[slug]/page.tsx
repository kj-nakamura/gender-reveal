// app/reveal/[slug]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import TemplateA from "./_components/TemplateA";
import TemplateB from "./_components/TemplateB";
import Header from "@/app/_components/Header";
import { Metadata } from "next";

// OGP用のメタデータ生成
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: reveal, error } = await supabase
    .from("reveals")
    .select("template_id, gender")
    .eq("share_slug", slug)
    .single();

  if (error || !reveal) {
    return {
      title: "性別発表カード",
      description: "大切な人と一緒に性別を発表！特別な瞬間をシェアできるジェンダーリビールカードサービス",
    };
  }

  const genderText = reveal.gender === "boy" ? "男の子" : "女の子";
  const templateText = reveal.template_id === "template_A" ? "シンプルデザイン" : "バルーンデザイン";
  
  return {
    title: `性別発表カード - ${genderText}の発表`,
    description: `${templateText}で${genderText}を発表！特別な瞬間をみんなで共有しましょう。`,
    openGraph: {
      title: `性別発表カード - ${genderText}の発表`,
      description: `${templateText}で${genderText}を発表！特別な瞬間をみんなで共有しましょう。`,
      type: "website",
      locale: "ja_JP",
      siteName: "性別発表カード",
    },
    twitter: {
      card: "summary_large_image",
      title: `性別発表カード - ${genderText}の発表`,
      description: `${templateText}で${genderText}を発表！特別な瞬間をみんなで共有しましょう。`,
    },
  };
}

// ページのメイン部分 - 誰でもアクセス可能
export default async function RevealPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // URLのslugを使って、データベースから該当するデータを取得（認証不要）
  const { data: reveal, error } = await supabase
    .from("reveals")
    .select("template_id, gender")
    .eq("share_slug", slug)
    .single();

  // エラーまたはデータが見つからなければ404ページを表示
  if (error || !reveal) {
    console.error("Reveal not found:", error);
    notFound();
  }

  // template_idに応じて、表示するコンポーネントを切り替える
  const renderTemplate = () => {
    switch (reveal.template_id) {
      case "template_A":
        return <TemplateA gender={reveal.gender} />;
      case "template_B":
        return <TemplateB gender={reveal.gender} />;
      default:
        // 該当テンプレートがなければ404
        notFound();
    }
  };

  return (
    <div>
      <Header />
      {renderTemplate()}
    </div>
  );
}
