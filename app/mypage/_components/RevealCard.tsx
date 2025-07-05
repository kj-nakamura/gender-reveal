"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type RevealCardProps = {
  reveal: {
    id: string;
    template_id: string;
    gender: string;
    share_slug: string;
    is_paid: boolean;
    created_at: string;
  };
};

export default function RevealCard({ reveal }: RevealCardProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  
  useEffect(() => {
    setShareUrl(`${window.location.origin}/reveal/${reveal.share_slug}`);
  }, [reveal.share_slug]);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          {new Date(reveal.created_at).toLocaleDateString('ja-JP')}
        </span>
        <span className={`px-2 py-1 rounded text-xs ${
          reveal.is_paid ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {reveal.is_paid ? '有料' : '無料'}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">テンプレート</p>
        <p className="font-semibold">{reveal.template_id}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">性別</p>
        <p className="font-semibold">
          {reveal.gender === 'boy' ? '👶 男の子' : '👶 女の子'}
        </p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">共有リンク</p>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 border rounded text-sm bg-gray-50"
          />
          <button 
            onClick={handleCopy}
            className={`px-3 py-2 rounded text-sm ${
              copied 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {copied ? '✓' : 'コピー'}
          </button>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Link 
          href={`/reveal/${reveal.share_slug}`}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center text-sm"
        >
          プレビュー
        </Link>
      </div>
    </div>
  );
}