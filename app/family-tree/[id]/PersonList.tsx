"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import EditPersonForm from "./EditPersonForm";

interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string | null;
  date_of_death: string | null;
  father_id: string | null;
  mother_id: string | null;
}

interface PersonListProps {
  persons: Person[];
}

export default function PersonList({ persons }: PersonListProps) {
  const router = useRouter();
  const supabase = createClient();
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [deletingPersonId, setDeletingPersonId] = useState<string | null>(null);

  const handleDelete = async (personId: string, personName: string) => {
    if (!confirm(`「${personName}」を削除しますか？この操作は取り消せません。`)) {
      return;
    }

    setDeletingPersonId(personId);

    try {
      const { error } = await supabase.from("persons").delete().eq("id", personId);

      if (error) {
        console.error("Error deleting person:", error);
        alert("人物の削除に失敗しました");
        return;
      }

      // ページをリフレッシュして更新を反映
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました");
    } finally {
      setDeletingPersonId(null);
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male': return '男性';
      case 'female': return '女性';
      default: return 'その他';
    }
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return null;
    const parent = persons.find(p => p.id === parentId);
    return parent?.name || '不明';
  };

  if (!persons || persons.length === 0) {
    return (
      <p className="text-gray-600">まだ人物が登録されていません。上のフォームから追加してください。</p>
    );
  }

  return (
    <ul className="space-y-3">
      {persons.map((person) => (
        <li key={person.id} className="p-4 border rounded-lg">
          {editingPersonId === person.id ? (
            <EditPersonForm 
              person={person} 
              existingPersons={persons}
              onCancel={() => setEditingPersonId(null)} 
            />
          ) : (
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-lg">{person.name}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPersonId(person.id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(person.id, person.name)}
                    disabled={deletingPersonId === person.id}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingPersonId === person.id ? "削除中..." : "削除"}
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div>性別: {getGenderText(person.gender)}</div>
                {person.date_of_birth && (
                  <div>生年月日: {person.date_of_birth}</div>
                )}
                {person.date_of_death && (
                  <div>没年月日: {person.date_of_death}</div>
                )}
                {(person.father_id || person.mother_id) && (
                  <div className="mt-2">
                    <div className="font-medium">家族関係:</div>
                    {person.father_id && (
                      <div>父親: {getParentName(person.father_id)}</div>
                    )}
                    {person.mother_id && (
                      <div>母親: {getParentName(person.mother_id)}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}