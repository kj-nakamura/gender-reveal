"use client";

import { useState } from 'react';
import AddPersonForm from './AddPersonForm';
import AddMarriageForm from './AddMarriageForm';
import PersonList from './PersonList';
import MarriageList from './MarriageList';

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

interface TabNavigationProps {
  treeId: string;
  persons: Person[];
  marriages: Marriage[];
}

type TabType = 'persons' | 'addPerson' | 'marriages' | 'addMarriage';

export default function TabNavigation({ treeId, persons, marriages }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState<TabType>('persons');

  const tabs = [
    { id: 'persons' as TabType, label: '👥 人物一覧', count: persons.length },
    { id: 'addPerson' as TabType, label: '➕ 人物追加', count: null },
    { id: 'marriages' as TabType, label: '💑 婚姻関係', count: marriages.length },
    { id: 'addMarriage' as TabType, label: '💍 婚姻追加', count: null },
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* タブヘッダー */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1 md:space-x-8 px-2 md:px-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm transition-colors whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">
                {tab.id === 'persons' && '👥'}
                {tab.id === 'addPerson' && '➕'}
                {tab.id === 'marriages' && '💑'}
                {tab.id === 'addMarriage' && '💍'}
              </span>
              {tab.count !== null && (
                <span className={`
                  ml-1 md:ml-2 py-0.5 px-1 md:px-2 rounded-full text-xs
                  ${activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="p-4 md:p-6">
        {activeTab === 'persons' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">登録されている人物</h3>
              <p className="text-sm text-gray-600">家系図に登録された人物の一覧です。編集や削除ができます。</p>
            </div>
            <PersonList persons={persons} />
          </div>
        )}

        {activeTab === 'addPerson' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">人物を追加</h3>
              <p className="text-sm text-gray-600">新しい家族メンバーを家系図に追加できます。</p>
            </div>
            <AddPersonForm treeId={treeId} existingPersons={persons} />
          </div>
        )}

        {activeTab === 'marriages' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">婚姻関係</h3>
              <p className="text-sm text-gray-600">登録されている夫婦・パートナー関係の一覧です。</p>
            </div>
            <MarriageList marriages={marriages} persons={persons} />
          </div>
        )}

        {activeTab === 'addMarriage' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">婚姻関係を追加</h3>
              <p className="text-sm text-gray-600">2人の人物間に夫婦・パートナー関係を設定できます。</p>
            </div>
            <AddMarriageForm treeId={treeId} existingPersons={persons} />
          </div>
        )}
      </div>
    </div>
  );
}