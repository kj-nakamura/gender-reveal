"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string | null;
  date_of_death: string | null;
  father_id: string | null;
  mother_id: string | null;
}

interface EditPersonFormProps {
  person: Person;
  existingPersons: Person[];
  onCancel: () => void;
}

export default function EditPersonForm({ person, existingPersons, onCancel }: EditPersonFormProps) {
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
    const dateOfDeath = formData.get("dateOfDeath") as string;
    const fatherId = formData.get("fatherId") as string;
    const motherId = formData.get("motherId") as string;

    try {
      const { error } = await supabase
        .from("persons")
        .update({
          name,
          gender: gender as 'male' | 'female' | 'other',
          date_of_birth: dateOfBirth || null,
          date_of_death: dateOfDeath || null,
          father_id: fatherId || null,
          mother_id: motherId || null,
        })
        .eq("id", person.id);

      if (error) {
        console.error("Error updating person:", error);
        alert("人物情報の更新に失敗しました");
        return;
      }

      // 編集完了後に編集モードを終了
      onCancel();
      
      // ページをリフレッシュして更新を反映
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 max-w-md border p-4 rounded-lg bg-gray-50">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          名前 *
        </label>
        <input 
          id="name"
          name="name" 
          type="text"
          defaultValue={person.name}
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
          defaultValue={person.gender}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
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
          defaultValue={person.date_of_birth || ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="dateOfDeath" className="block text-sm font-medium text-gray-700 mb-1">
          没年月日
        </label>
        <input 
          id="dateOfDeath"
          name="dateOfDeath" 
          type="date"
          defaultValue={person.date_of_death || ""}
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
          defaultValue={person.father_id || ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">選択してください</option>
          {existingPersons
            .filter(p => p.gender === 'male' && p.id !== person.id)
            .map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
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
          defaultValue={person.mother_id || ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">選択してください</option>
          {existingPersons
            .filter(p => p.gender === 'female' && p.id !== person.id)
            .map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "更新中..." : "更新"}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}