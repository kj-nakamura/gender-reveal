import { convertToFamilyTreeData } from '@/app/family-tree/familyTreeUtils';
import { MarkerType } from '@xyflow/react';

// テスト用のPersonデータ
const mockPersons = [
  {
    id: '1',
    name: '祖父',
    gender: 'male' as const,
    date_of_birth: '1950-01-01',
    father_id: null,
    mother_id: null
  },
  {
    id: '2',
    name: '祖母',
    gender: 'female' as const,
    date_of_birth: '1952-01-01',
    father_id: null,
    mother_id: null
  },
  {
    id: '3',
    name: '父親',
    gender: 'male' as const,
    date_of_birth: '1980-01-01',
    father_id: '1',
    mother_id: '2'
  },
  {
    id: '4',
    name: '母親',
    gender: 'female' as const,
    date_of_birth: '1982-01-01',
    father_id: null,
    mother_id: null
  },
  {
    id: '5',
    name: '子供',
    gender: 'male' as const,
    date_of_birth: '2010-01-01',
    father_id: '3',
    mother_id: '4'
  }
];

const mockMarriages = [
  {
    id: '1',
    partner1_id: '1',
    partner2_id: '2',
    start_date: '1975-01-01'
  },
  {
    id: '2',
    partner1_id: '3',
    partner2_id: '4',
    start_date: '2005-01-01'
  }
];

describe('familyTreeUtils', () => {
  describe('convertToFamilyTreeData', () => {
    test('基本的なノードとエッジが正しく生成される', () => {
      const result = convertToFamilyTreeData(mockPersons, mockMarriages);
      
      expect(result.nodes).toHaveLength(5);
      expect(result.edges).toHaveLength(6); // 4つの親子関係 + 2つの婚姻関係
      
      // 各人物がノードとして存在することを確認
      mockPersons.forEach(person => {
        const node = result.nodes.find(n => n.id === person.id);
        expect(node).toBeDefined();
        expect(node?.type).toBe('person');
        expect(node?.data.name).toBe(person.name);
        expect(node?.data.gender).toBe(person.gender);
      });
    });

    test('世代レベルに基づいてY座標が正しく設定される', () => {
      const result = convertToFamilyTreeData(mockPersons, mockMarriages);
      
      // 祖父母は最上位世代（Y=0）
      const grandpaNode = result.nodes.find(n => n.id === '1')!;
      const grandmaNode = result.nodes.find(n => n.id === '2')!;
      expect(grandpaNode.position.y).toBe(0);
      expect(grandmaNode.position.y).toBe(0);
      
      // 父母は第2世代（Y=150）
      const fatherNode = result.nodes.find(n => n.id === '3')!;
      const motherNode = result.nodes.find(n => n.id === '4')!;
      expect(fatherNode.position.y).toBe(150);
      expect(motherNode.position.y).toBe(150);
      
      // 子供は第3世代（Y=300）
      const childNode = result.nodes.find(n => n.id === '5')!;
      expect(childNode.position.y).toBe(300);
    });

    test('親子関係のエッジが正しく生成される', () => {
      const result = convertToFamilyTreeData(mockPersons, mockMarriages);
      
      // 父親から子供へのエッジ（緑色）
      const fatherChildEdge = result.edges.find(e => e.id === '3-5');
      expect(fatherChildEdge).toBeDefined();
      expect(fatherChildEdge?.source).toBe('3');
      expect(fatherChildEdge?.target).toBe('5');
      expect(fatherChildEdge?.style?.stroke).toBe('#4ade80');
      expect(fatherChildEdge?.markerEnd?.type).toBe(MarkerType.ArrowClosed);
      expect(fatherChildEdge?.markerEnd?.color).toBe('#4ade80');
      
      // 母親から子供へのエッジ（赤色）
      const motherChildEdge = result.edges.find(e => e.id === '4-5');
      expect(motherChildEdge).toBeDefined();
      expect(motherChildEdge?.source).toBe('4');
      expect(motherChildEdge?.target).toBe('5');
      expect(motherChildEdge?.style?.stroke).toBe('#f87171');
      expect(motherChildEdge?.markerEnd?.type).toBe(MarkerType.ArrowClosed);
      expect(motherChildEdge?.markerEnd?.color).toBe('#f87171');
    });

    test('婚姻関係のエッジが正しく生成される', () => {
      const result = convertToFamilyTreeData(mockPersons, mockMarriages);
      
      // 祖父母の婚姻関係
      const grandparentsMarriage = result.edges.find(e => e.id === 'marriage-1');
      expect(grandparentsMarriage).toBeDefined();
      expect(grandparentsMarriage?.source).toBe('1');
      expect(grandparentsMarriage?.target).toBe('2');
      expect(grandparentsMarriage?.type).toBe('straight');
      expect(grandparentsMarriage?.style?.stroke).toBe('#fbbf24');
      expect(grandparentsMarriage?.style?.strokeDasharray).toBe('10,5');
      expect(grandparentsMarriage?.label).toBe('❤️');
      
      // 父母の婚姻関係
      const parentsMarriage = result.edges.find(e => e.id === 'marriage-2');
      expect(parentsMarriage).toBeDefined();
      expect(parentsMarriage?.source).toBe('3');
      expect(parentsMarriage?.target).toBe('4');
    });

    test('空の配列でも正常に処理される', () => {
      const result = convertToFamilyTreeData([], []);
      
      expect(result.nodes).toHaveLength(0);
      expect(result.edges).toHaveLength(0);
    });

    test('人物のみでマリッジがない場合', () => {
      const singlePerson = [mockPersons[0]];
      const result = convertToFamilyTreeData(singlePerson, []);
      
      expect(result.nodes).toHaveLength(1);
      expect(result.edges).toHaveLength(0);
      expect(result.nodes[0].data.name).toBe('祖父');
    });

    test('親子関係がない独立した人物たち', () => {
      const independentPersons = [
        {
          id: '1',
          name: '独立した人1',
          gender: 'male' as const,
          date_of_birth: '1990-01-01',
          father_id: null,
          mother_id: null
        },
        {
          id: '2',
          name: '独立した人2',
          gender: 'female' as const,
          date_of_birth: '1992-01-01',
          father_id: null,
          mother_id: null
        }
      ];
      
      const result = convertToFamilyTreeData(independentPersons, []);
      
      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(0);
      
      // 両方とも最上位世代に配置される
      result.nodes.forEach(node => {
        expect(node.position.y).toBe(0);
      });
    });

    test('onPersonClickとonPersonUpdateが正しく設定される', () => {
      const mockOnClick = jest.fn();
      const mockOnUpdate = jest.fn();
      
      const result = convertToFamilyTreeData(
        [mockPersons[0]], 
        [], 
        mockOnClick, 
        mockOnUpdate
      );
      
      expect(result.nodes[0].data.onClick).toBe(mockOnClick);
      expect(result.nodes[0].data.onUpdate).toBe(mockOnUpdate);
    });

    test('コールバック関数なしでも正常に処理される', () => {
      const result = convertToFamilyTreeData([mockPersons[0]], []);
      
      expect(result.nodes[0].data.onClick).toBeUndefined();
      expect(result.nodes[0].data.onUpdate).toBeUndefined();
    });

    test('複雑な世代レベルが正しく計算される', () => {
      const complexPersons = [
        {
          id: '1',
          name: 'ひいおじいちゃん',
          gender: 'male' as const,
          date_of_birth: '1920-01-01',
          father_id: null,
          mother_id: null
        },
        {
          id: '2',
          name: 'おじいちゃん',
          gender: 'male' as const,
          date_of_birth: '1950-01-01',
          father_id: '1',
          mother_id: null
        },
        {
          id: '3',
          name: 'お父さん',
          gender: 'male' as const,
          date_of_birth: '1980-01-01',
          father_id: '2',
          mother_id: null
        },
        {
          id: '4',
          name: '息子',
          gender: 'male' as const,
          date_of_birth: '2010-01-01',
          father_id: '3',
          mother_id: null
        }
      ];
      
      const result = convertToFamilyTreeData(complexPersons, []);
      
      // 4世代すべてが異なるY座標を持つ
      const y0 = result.nodes.find(n => n.id === '1')!.position.y; // 0
      const y1 = result.nodes.find(n => n.id === '2')!.position.y; // 150
      const y2 = result.nodes.find(n => n.id === '3')!.position.y; // 300
      const y3 = result.nodes.find(n => n.id === '4')!.position.y; // 450
      
      expect(y0).toBe(0);
      expect(y1).toBe(150);
      expect(y2).toBe(300);
      expect(y3).toBe(450);
    });

    test('循環参照がある場合でも無限ループにならない', () => {
      const circularPersons = [
        {
          id: '1',
          name: '人物A',
          gender: 'male' as const,
          date_of_birth: '1990-01-01',
          father_id: '2', // 循環参照
          mother_id: null
        },
        {
          id: '2',
          name: '人物B',
          gender: 'male' as const,
          date_of_birth: '1992-01-01',
          father_id: '1', // 循環参照
          mother_id: null
        }
      ];
      
      // 無限ループにならずに処理が完了することを確認
      expect(() => {
        convertToFamilyTreeData(circularPersons, []);
      }).not.toThrow();
    });

    test('同一世代の人物のX座標配置', () => {
      const sameGenerationPersons = [
        {
          id: '1',
          name: '兄弟1',
          gender: 'male' as const,
          date_of_birth: '1990-01-01',
          father_id: null,
          mother_id: null
        },
        {
          id: '2',
          name: '兄弟2',
          gender: 'male' as const,
          date_of_birth: '1992-01-01',
          father_id: null,
          mother_id: null
        },
        {
          id: '3',
          name: '兄弟3',
          gender: 'female' as const,
          date_of_birth: '1994-01-01',
          father_id: null,
          mother_id: null
        }
      ];
      
      const result = convertToFamilyTreeData(sameGenerationPersons, []);
      
      // 全員が同じY座標（世代レベル0）
      result.nodes.forEach(node => {
        expect(node.position.y).toBe(0);
      });
      
      // X座標が異なることを確認
      const xCoords = result.nodes.map(node => node.position.x);
      const uniqueXCoords = [...new Set(xCoords)];
      expect(uniqueXCoords).toHaveLength(3);
    });

    test('存在しない父親・母親IDが指定されている場合', () => {
      const personsWithInvalidParents = [
        {
          id: '1',
          name: '孤立した子供',
          gender: 'male' as const,
          date_of_birth: '2010-01-01',
          father_id: 'non-existent-father',
          mother_id: 'non-existent-mother'
        }
      ];
      
      const result = convertToFamilyTreeData(personsWithInvalidParents, []);
      
      expect(result.nodes).toHaveLength(1);
      // 存在しない親へのエッジは作成されない
      expect(result.edges).toHaveLength(0);
    });
  });
});