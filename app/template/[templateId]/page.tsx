// app/template/[templateId]/page.tsx
import { notFound } from "next/navigation";
import TemplateA from "@/app/reveal/[slug]/_components/TemplateA";
import TemplateB from "@/app/reveal/[slug]/_components/TemplateB";
import CommonHeader from "@/app/_components/CommonHeader";
import CommonFooter from "@/app/_components/CommonFooter";
import CreateRevealButton from "./_components/CreateRevealButton";

export default async function TemplatePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ templateId: string }>; 
  searchParams?: Promise<{ gender?: string }>;
}) {
  const { templateId } = await params;
  const { gender } = (await searchParams) || {};

  const renderTemplate = () => {
    // genderが指定されている場合は単一のサンプルを表示
    if (gender) {
      const sampleGender = gender === "boy" ? "boy" : "girl";
      const bgColor = gender === "boy" ? "bg-blue-50" : "bg-pink-50";
      const textColor = gender === "boy" ? "text-blue-800" : "text-pink-800";
      const emoji = gender === "boy" ? "👦" : "👧";
      const title = gender === "boy" ? "男の子のサンプル" : "女の子のサンプル";

      switch (templateId) {
        case "template_A":
          return (
            <div className={`text-center py-8 ${bgColor}`}>
              <h2 className={`text-2xl font-bold zen-maru-gothic mb-4 ${textColor}`}>{emoji} {title}</h2>
              <div className="mb-6">
                <CreateRevealButton templateId="template_A" gender={sampleGender} />
              </div>
              <TemplateA gender={sampleGender} />
            </div>
          );
        case "template_B":
          return (
            <div className={`text-center py-8 ${bgColor}`}>
              <h2 className={`text-2xl font-bold zen-maru-gothic mb-4 ${textColor}`}>{emoji} {title}</h2>
              <div className="mb-6">
                <CreateRevealButton templateId="template_B" gender={sampleGender} />
              </div>
              <TemplateB gender={sampleGender} />
            </div>
          );
        default:
          notFound();
      }
    }

    // genderが指定されていない場合は両方のサンプルを表示
    switch (templateId) {
      case "template_A":
        return (
          <div>
            <div className="text-center py-8 bg-blue-50">
              <h2 className="text-2xl font-bold zen-maru-gothic mb-4 text-blue-800">👦 男の子のサンプル</h2>
              <TemplateA gender="boy" />
            </div>
            <div className="text-center py-8 bg-pink-50">
              <h2 className="text-2xl font-bold zen-maru-gothic mb-4 text-pink-800">👧 女の子のサンプル</h2>
              <TemplateA gender="girl" />
            </div>
          </div>
        );
      case "template_B":
        return (
          <div>
            <div className="text-center py-8 bg-blue-50">
              <h2 className="text-2xl font-bold zen-maru-gothic mb-4 text-blue-800">👦 男の子のサンプル</h2>
              <TemplateB gender="boy" />
            </div>
            <div className="text-center py-8 bg-pink-50">
              <h2 className="text-2xl font-bold zen-maru-gothic mb-4 text-pink-800">👧 女の子のサンプル</h2>
              <TemplateB gender="girl" />
            </div>
          </div>
        );
      default:
        notFound();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CommonHeader />
      <div className="flex-grow">
        {renderTemplate()}
      </div>
      <CommonFooter />
    </div>
  );
}