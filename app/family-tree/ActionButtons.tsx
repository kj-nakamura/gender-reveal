"use client";

import { useState } from 'react';
import PersonEditModal from './PersonEditModal';
import AddMarriageModal from './AddMarriageModal';

interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string | null;
  father_id: string | null;
  mother_id: string | null;
}

interface Marriage {
  id: string;
  partner1_id: string;
  partner2_id: string;
  start_date: string | null;
}

interface ActionButtonsProps {
  treeId: string;
  persons: Person[];
  marriages: Marriage[];
}

export default function ActionButtons({ treeId, persons, marriages }: ActionButtonsProps) {
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [showAddMarriageModal, setShowAddMarriageModal] = useState(false);

  const handleModalUpdate = () => {
    // モーダルでの更新後の処理
    // page.tsxでrouter.refresh()が実行されるのでここでは特に何もしない
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">家系図を編集</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 人物追加ボタン */}
        <button
          onClick={() => setShowAddPersonModal(true)}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-medium">人物を追加</span>
        </button>

        {/* 婚姻追加ボタン */}
        <button
          onClick={() => setShowAddMarriageModal(true)}
          disabled={persons.length < 2}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="font-medium">婚姻を追加</span>
        </button>
      </div>

      {/* 注意書き */}
      {persons.length < 2 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            💡 婚姻関係を追加するには、まず2人以上の人物を登録してください。
          </p>
        </div>
      )}

      {/* 統計情報 */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{persons.length}</div>
          <div className="text-sm text-gray-600">登録人物</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{marriages.length}</div>
          <div className="text-sm text-gray-600">婚姻関係</div>
        </div>
      </div>

      {/* モーダル */}
      <PersonEditModal
        person={null} // 新規追加なのでnull
        existingPersons={persons}
        isOpen={showAddPersonModal}
        onClose={() => setShowAddPersonModal(false)}
        onUpdate={handleModalUpdate}
        treeId={treeId}
      />

      <AddMarriageModal
        treeId={treeId}
        existingPersons={persons}
        isOpen={showAddMarriageModal}
        onClose={() => setShowAddMarriageModal(false)}
        onUpdate={handleModalUpdate}
      />
    </div>
  );
}