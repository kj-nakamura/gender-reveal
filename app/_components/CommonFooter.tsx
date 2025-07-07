// app/_components/CommonFooter.tsx
"use client";

import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function CommonFooter() {
  const router = useRouter();

  const handleTopClick = () => {
    router.push("/");
  };

  return (
    <footer className="bg-gray-100 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* TOPリンク */}
          <button
            onClick={handleTopClick}
            className="text-purple-600 hover:text-purple-800 font-medium zen-maru-gothic transition-colors duration-200 hover:underline"
          >
            🏠 TOPページに戻る
          </button>
          
          {/* コピーライト */}
          <p className="text-gray-600 text-center sm:text-right">
            &copy; 2025 {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}