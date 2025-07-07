// app/reveal/[slug]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import TemplateA from "./_components/TemplateA";
import TemplateB from "./_components/TemplateB";
import CommonFooter from "@/app/_components/CommonFooter";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

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
      title: siteConfig.name,
      description: siteConfig.description,
    };
  }

  return {
    title: siteConfig.name,
    description: siteConfig.description,
    openGraph: {
      title: siteConfig.name,
      description: siteConfig.description,
      type: "website",
      locale: "ja_JP",
      siteName: siteConfig.name,
      url: siteConfig.url,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
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
    .select("template_id, gender, user_id")
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {renderTemplate()}
      </div>
      <CommonFooter />
    </div>
  );
}
