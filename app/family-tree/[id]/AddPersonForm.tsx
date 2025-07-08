"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
}

interface AddPersonFormProps {
  treeId: string;
  existingPersons: Person[];
}

export default function AddPersonForm({ treeId, existingPersons }: AddPersonFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const gender = formData.get("gender") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const fatherId = formData.get("fatherId") as string;
    const motherId = formData.get("motherId") as string;

    try {
      const { error } = await supabase.from("persons").insert({
        tree_id: treeId,
        name,
        gender: gender as 'male' | 'female' | 'other',
        date_of_birth: dateOfBirth || null,
        father_id: fatherId || null,
        mother_id: motherId || null,
      });

      if (error) {
        console.error("Error adding person:", error);
        alert("人物の追加に失敗しました");
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          名前 *
        </label>
        <input 
          id="name"
          name="name" 
          type="text"
          placeholder="例: 山田 太郎" 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          性別 *
        </label>
        <select 
          id="gender"
          name="gender" 
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
          生年月日
        </label>
        <input 
          id="dateOfBirth"
          name="dateOfBirth" 
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>


      <div>
        <label htmlFor="fatherId" className="block text-sm font-medium text-gray-700 mb-1">
          父親
        </label>
        <select 
          id="fatherId"
          name="fatherId"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">選択してください</option>
          {existingPersons
            .filter(person => person.gender === 'male')
            .map(person => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label htmlFor="motherId" className="block text-sm font-medium text-gray-700 mb-1">
          母親
        </label>
        <select 
          id="motherId"
          name="motherId"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">選択してください</option>
          {existingPersons
            .filter(person => person.gender === 'female')
            .map(person => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
        </select>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "追加中..." : "人物を追加"}
      </button>
    </form>
  );
}