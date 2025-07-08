"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
}

interface Marriage {
  id: string;
  partner1_id: string;
  partner2_id: string;
  start_date: string | null;
  end_date: string | null;
}

interface MarriageListProps {
  marriages: Marriage[];
  persons: Person[];
}

export default function MarriageList({ marriages, persons }: MarriageListProps) {
  const router = useRouter();
  const supabase = createClient();
  const [deletingMarriageId, setDeletingMarriageId] = useState<string | null>(null);

  const getPersonName = (personId: string) => {
    const person = persons.find(p => p.id === personId);
    return person?.name || '不明';
  };

  const handleDelete = async (marriageId: string, partner1Name: string, partner2Name: string) => {
    if (!confirm(`「${partner1Name}」と「${partner2Name}」の婚姻関係を削除しますか？`)) {
      return;
    }

    setDeletingMarriageId(marriageId);

    try {
      const { error } = await supabase.from("marriages").delete().eq("id", marriageId);

      if (error) {
        console.error("Error deleting marriage:", error);
        alert("婚姻関係の削除に失敗しました");
        return;
      }

      // ページをリフレッシュして更新を反映
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました");
    } finally {
      setDeletingMarriageId(null);
    }
  };

  if (!marriages || marriages.length === 0) {
    return (
      <p className="text-gray-600">まだ婚姻関係が登録されていません。</p>
    );
  }

  return (
    <ul className="space-y-3">
      {marriages.map((marriage) => {
        const partner1Name = getPersonName(marriage.partner1_id);
        const partner2Name = getPersonName(marriage.partner2_id);
        
        return (
          <li key={marriage.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-lg">
                  {partner1Name} ❤️ {partner2Name}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {marriage.start_date && (
                    <div>結婚日: {marriage.start_date}</div>
                  )}
                  {marriage.end_date && (
                    <div>離婚日: {marriage.end_date}</div>
                  )}
                  {!marriage.start_date && !marriage.end_date && (
                    <div className="text-gray-500">日付情報なし</div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(marriage.id, partner1Name, partner2Name)}
                disabled={deletingMarriageId === marriage.id}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingMarriageId === marriage.id ? "削除中..." : "削除"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}