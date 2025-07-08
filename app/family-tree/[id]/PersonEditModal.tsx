"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string | null;
  father_id: string | null;
  mother_id: string | null;
}

interface PersonEditModalProps {
  person: Person | null;
  existingPersons: Person[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function PersonEditModal({
  person,
  existingPersons,
  isOpen,
  onClose,
  onUpdate
}: PersonEditModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // フォームの初期値
  const [formData, setFormData] = useState({
    name: person?.name || '',
    gender: person?.gender || 'male' as 'male' | 'female' | 'other',
    date_of_birth: person?.date_of_birth || '',
    father_id: person?.father_id || '',
    mother_id: person?.mother_id || '',
  });

  // personが変更されたらフォームデータを更新
  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        gender: person.gender,
        date_of_birth: person.date_of_birth || '',
        father_id: person.father_id || '',
        mother_id: person.mother_id || '',
      });
    }
  }, [person]);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // モーダル外クリックで閉じる
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!person) return;

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("persons")
        .update({
          name: formData.name,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth || null,
          father_id: formData.father_id || null,
          mother_id: formData.mother_id || null,
        })
        .eq("id", person.id);

      if (error) {
        console.error("Error updating person:", error);
        alert("人物情報の更新に失敗しました");
        return;
      }

      // 更新成功
      onClose();
      if (onUpdate) {
        onUpdate();
      }
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!person) return;
    
    if (!confirm(`「${person.name}」を削除しますか？この操作は取り消せません。`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase.from("persons").delete().eq("id", person.id);

      if (error) {
        console.error("Error deleting person:", error);
        alert("人物の削除に失敗しました");
        return;
      }

      // 削除成功
      onClose();
      if (onUpdate) {
        onUpdate();
      }
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました");
    } finally {
      setIsDeleting(false);
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
    const parent = existingPersons.find(p => p.id === parentId);
    return parent?.name || '不明';
  };

  if (!isOpen || !person) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">人物情報の編集</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading || isDeleting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ボディ */}
        <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* 名前 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              名前 *
            </label>
            <input 
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="例: 山田 太郎" 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isDeleting}
            />
          </div>

          {/* 性別 */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              性別 *
            </label>
            <select 
              id="gender"
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'other' }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isDeleting}
            >
              <option value="male">男性</option>
              <option value="female">女性</option>
              <option value="other">その他</option>
            </select>
          </div>

          {/* 生年月日 */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              生年月日
            </label>
            <input 
              id="dateOfBirth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isDeleting}
            />
          </div>

          {/* 父親 */}
          <div>
            <label htmlFor="fatherId" className="block text-sm font-medium text-gray-700 mb-1">
              父親
            </label>
            <select 
              id="fatherId"
              value={formData.father_id}
              onChange={(e) => setFormData(prev => ({ ...prev, father_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isDeleting}
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

          {/* 母親 */}
          <div>
            <label htmlFor="motherId" className="block text-sm font-medium text-gray-700 mb-1">
              母親
            </label>
            <select 
              id="motherId"
              value={formData.mother_id}
              onChange={(e) => setFormData(prev => ({ ...prev, mother_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isDeleting}
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

          {/* 現在の情報表示 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">現在の情報</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div>性別: {getGenderText(person.gender)}</div>
              {person.date_of_birth && (
                <div>生年月日: {person.date_of_birth}</div>
              )}
              {(person.father_id || person.mother_id) && (
                <div>
                  家族関係:
                  {person.father_id && (
                    <span className="ml-2">父親: {getParentName(person.father_id)}</span>
                  )}
                  {person.mother_id && (
                    <span className="ml-2">母親: {getParentName(person.mother_id)}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* フッター */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading || isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                削除中...
              </>
            ) : (
              '削除'
            )}
          </button>
          
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={onClose}
              disabled={isLoading || isDeleting}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              キャンセル
            </button>
            <button 
              type="button"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={isLoading || isDeleting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  更新中...
                </>
              ) : (
                '更新'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}