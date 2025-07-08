"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
}

interface AddMarriageFormProps {
  treeId: string;
  existingPersons: Person[];
}

export default function AddMarriageForm({ treeId, existingPersons }: AddMarriageFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const partner1Id = formData.get("partner1Id") as string;
    const partner2Id = formData.get("partner2Id") as string;
    const startDate = formData.get("startDate") as string;

    if (partner1Id === partner2Id) {
      alert("同一人物を夫婦として登録することはできません");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("marriages").insert({
        tree_id: treeId,
        partner1_id: partner1Id,
        partner2_id: partner2Id,
        start_date: startDate || null,
      });

      if (error) {
        console.error("Error adding marriage:", error);
        alert("婚姻関係の追加に失敗しました");
        return;
      }

      // フォームをリセット
      if (formRef.current) {
        formRef.current.reset();
      }
      
      // ページをリフレッシュして一覧を更新
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="partner1Id" className="block text-sm font-medium text-gray-700 mb-1">
          パートナー1 *
        </label>
        <select 
          id="partner1Id"
          name="partner1Id" 
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">選択してください</option>
          {existingPersons.map(person => (
            <option key={person.id} value={person.id}>
              {person.name} ({person.gender === 'male' ? '男性' : person.gender === 'female' ? '女性' : 'その他'})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="partner2Id" className="block text-sm font-medium text-gray-700 mb-1">
          パートナー2 *
        </label>
        <select 
          id="partner2Id"
          name="partner2Id" 
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">選択してください</option>
          {existingPersons.map(person => (
            <option key={person.id} value={person.id}>
              {person.name} ({person.gender === 'male' ? '男性' : person.gender === 'female' ? '女性' : 'その他'})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
          結婚日
        </label>
        <input 
          id="startDate"
          name="startDate" 
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>


      <button 
        type="submit" 
        disabled={isLoading || existingPersons.length < 2}
        className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "追加中..." : "婚姻関係を追加"}
      </button>
      
      {existingPersons.length < 2 && (
        <p className="text-sm text-gray-500">
          婚姻関係を登録するには、2人以上の人物が必要です。
        </p>
      )}
    </form>
  );
}