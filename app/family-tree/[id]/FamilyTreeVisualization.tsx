"use client";

import { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  Panel,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import PersonNode, { PersonData } from './PersonNode';
import { convertToFamilyTreeData } from './familyTreeUtils';

interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string | null;
  date_of_death: string | null;
  father_id: string | null;
  mother_id: string | null;
}

interface Marriage {
  id: string;
  partner1_id: string;
  partner2_id: string;
  start_date: string | null;
  end_date: string | null;
}

interface FamilyTreeVisualizationProps {
  persons: Person[];
  marriages: Marriage[];
}

const nodeTypes: NodeTypes = {
  person: PersonNode,
};

export default function FamilyTreeVisualization({ 
  persons, 
  marriages 
}: FamilyTreeVisualizationProps) {
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);

  const handlePersonClick = useCallback((person: PersonData) => {
    setSelectedPerson(person);
  }, []);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => convertToFamilyTreeData(persons, marriages, handlePersonClick),
    [persons, marriages, handlePersonClick]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleClosePersonDetails = () => {
    setSelectedPerson(null);
  };

  if (persons.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border">
        <div className="text-center">
          <p className="text-gray-600 mb-2">家系図を表示するには人物を追加してください</p>
          <p className="text-sm text-gray-500">上のフォームから家族の情報を入力してみましょう</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-96 bg-gray-50 rounded-lg border overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2,
            minZoom: 0.5,
            maxZoom: 1.5,
          }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
          
          <Panel position="top-left" className="bg-white p-2 rounded shadow">
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-400"></div>
                <span>父親</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-400"></div>
                <span>母親</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-yellow-400 border-dashed"></div>
                <span>夫婦</span>
              </div>
            </div>
          </Panel>

          <Panel position="top-right" className="bg-white p-2 rounded shadow">
            <div className="text-xs text-gray-600">
              <p>💡 ノードをドラッグして移動</p>
              <p>🔍 マウスホイールでズーム</p>
              <p>👆 ノードクリックで詳細表示</p>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* 人物詳細パネル */}
      {selectedPerson && (
        <div className="mt-4 p-4 bg-white rounded-lg border shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">人物詳細</h3>
            <button
              onClick={handleClosePersonDetails}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">名前:</span> {selectedPerson.name}
            </div>
            <div>
              <span className="font-medium">性別:</span>{' '}
              {selectedPerson.gender === 'male' ? '男性' : 
               selectedPerson.gender === 'female' ? '女性' : 'その他'}
            </div>
            {selectedPerson.date_of_birth && (
              <div>
                <span className="font-medium">生年月日:</span> {selectedPerson.date_of_birth}
              </div>
            )}
            {selectedPerson.date_of_death && (
              <div>
                <span className="font-medium">没年月日:</span> {selectedPerson.date_of_death}
              </div>
            )}
            {(selectedPerson.father_id || selectedPerson.mother_id) && (
              <div className="col-span-2">
                <span className="font-medium">家族関係:</span>
                <div className="mt-1 space-y-1">
                  {selectedPerson.father_id && (
                    <div className="text-green-600">
                      父親: {persons.find(p => p.id === selectedPerson.father_id)?.name || '不明'}
                    </div>
                  )}
                  {selectedPerson.mother_id && (
                    <div className="text-red-600">
                      母親: {persons.find(p => p.id === selectedPerson.mother_id)?.name || '不明'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}