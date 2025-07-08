"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
}

interface AddMarriageModalProps {
  treeId: string;
  existingPersons: Person[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function AddMarriageModal({
  treeId,
  existingPersons,
  isOpen,
  onClose,
  onUpdate
}: AddMarriageModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // フォームの初期値
  const [formData, setFormData] = useState({
    partner1_id: '',
    partner2_id: '',
    start_date: '',
  });

  // モーダルが開いたら初期値をリセット
  useEffect(() => {
    if (isOpen) {
      setFormData({
        partner1_id: '',
        partner2_id: '',
        start_date: '',
      });
    }
  }, [isOpen]);

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
    
    if (formData.partner1_id === formData.partner2_id) {
      alert("同一人物を夫婦として登録することはできません");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.from("marriages").insert({
        tree_id: treeId,
        partner1_id: formData.partner1_id,
        partner2_id: formData.partner2_id,
        start_date: formData.start_date || null,
      });

      if (error) {
        console.error("Error adding marriage:", error);
        alert("婚姻関係の追加に失敗しました");
        return;
      }

      // 成功
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

  if (!isOpen) return null;

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
            <h2 className="text-xl font-semibold text-gray-900">婚姻関係を追加</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ボディ */}
        <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* パートナー1 */}
          <div>
            <label htmlFor="partner1Id" className="block text-sm font-medium text-gray-700 mb-1">
              パートナー1 *
            </label>
            <select 
              id="partner1Id"
              value={formData.partner1_id}
              onChange={(e) => setFormData(prev => ({ ...prev, partner1_id: e.target.value }))}
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

          {/* パートナー2 */}
          <div>
            <label htmlFor="partner2Id" className="block text-sm font-medium text-gray-700 mb-1">
              パートナー2 *
            </label>
            <select 
              id="partner2Id"
              value={formData.partner2_id}
              onChange={(e) => setFormData(prev => ({ ...prev, partner2_id: e.target.value }))}
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

          {/* 結婚日 */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              結婚日
            </label>
            <input 
              id="startDate"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {existingPersons.length < 2 && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">
                婚姻関係を登録するには、2人以上の人物が必要です。
              </p>
            </div>
          )}
        </form>

        {/* フッター */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button 
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
          <button 
            type="button"
            onClick={() => formRef.current?.requestSubmit()}
            disabled={isLoading || existingPersons.length < 2}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                追加中...
              </>
            ) : (
              '追加'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}