import { Node, Edge, MarkerType } from '@xyflow/react';
import { PersonData } from './PersonNode';

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

export interface FamilyTreeData {
  nodes: Node[];
  edges: Edge[];
}

// 世代レベルを計算する関数
function calculateGenerationLevels(persons: Person[]): Map<string, number> {
  const levels = new Map<string, number>();
  const visited = new Set<string>();

  function calculateLevel(personId: string): number {
    if (visited.has(personId)) {
      return levels.get(personId) || 0;
    }

    visited.add(personId);
    const person = persons.find(p => p.id === personId);
    
    if (!person) {
      return 0;
    }

    // 親がいない場合は最上位世代（0）
    if (!person.father_id && !person.mother_id) {
      levels.set(personId, 0);
      return 0;
    }

    // 親のレベルを取得して+1
    let maxParentLevel = -1;
    if (person.father_id) {
      maxParentLevel = Math.max(maxParentLevel, calculateLevel(person.father_id));
    }
    if (person.mother_id) {
      maxParentLevel = Math.max(maxParentLevel, calculateLevel(person.mother_id));
    }

    const level = maxParentLevel + 1;
    levels.set(personId, level);
    return level;
  }

  // すべての人物のレベルを計算
  persons.forEach(person => {
    if (!visited.has(person.id)) {
      calculateLevel(person.id);
    }
  });

  return levels;
}

// ノードの位置を計算する関数
function calculateNodePositions(persons: Person[], levels: Map<string, number>): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  
  // 世代ごとに人物をグループ化
  const generationGroups = new Map<number, Person[]>();
  persons.forEach(person => {
    const level = levels.get(person.id) || 0;
    if (!generationGroups.has(level)) {
      generationGroups.set(level, []);
    }
    generationGroups.get(level)!.push(person);
  });

  const NODE_WIDTH = 200;
  const GENERATION_GAP = 150;

  // 各世代の人物を配置
  generationGroups.forEach((generationPersons, level) => {
    const totalWidth = generationPersons.length * NODE_WIDTH;
    const startX = -totalWidth / 2;

    generationPersons.forEach((person, index) => {
      const x = startX + (index * NODE_WIDTH) + (NODE_WIDTH / 2);
      const y = level * GENERATION_GAP;
      
      positions.set(person.id, { x, y });
    });
  });

  return positions;
}

export function convertToFamilyTreeData(
  persons: Person[], 
  marriages: Marriage[],
  onPersonClick?: (person: PersonData) => void,
  onPersonUpdate?: (personId: string, updates: Partial<PersonData>) => void
): FamilyTreeData {
  // 世代レベルを計算
  const levels = calculateGenerationLevels(persons);
  
  // ノード位置を計算
  const positions = calculateNodePositions(persons, levels);

  // ノードを作成
  const nodes: Node[] = persons.map(person => {
    const position = positions.get(person.id) || { x: 0, y: 0 };
    
    return {
      id: person.id,
      type: 'person',
      position,
      data: {
        ...person,
        onClick: onPersonClick,
        onUpdate: onPersonUpdate
      },
    };
  });

  // エッジを作成（親子関係）
  const edges: Edge[] = [];
  
  persons.forEach(person => {
    // 父親との関係
    if (person.father_id) {
      edges.push({
        id: `${person.father_id}-${person.id}`,
        source: person.father_id,
        target: person.id,
        type: 'smoothstep',
        style: { stroke: '#4ade80', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#4ade80',
        },
      });
    }

    // 母親との関係
    if (person.mother_id) {
      edges.push({
        id: `${person.mother_id}-${person.id}`,
        source: person.mother_id,
        target: person.id,
        type: 'smoothstep',
        style: { stroke: '#f87171', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#f87171',
        },
      });
    }
  });

  // 婚姻関係のエッジを追加
  marriages.forEach(marriage => {
    edges.push({
      id: `marriage-${marriage.id}`,
      source: marriage.partner1_id,
      target: marriage.partner2_id,
      type: 'straight',
      style: { 
        stroke: '#fbbf24', 
        strokeWidth: 3,
        strokeDasharray: '10,5'
      },
      label: '❤️',
      labelStyle: { fontSize: '20px' },
    });
  });

  return { nodes, edges };
}