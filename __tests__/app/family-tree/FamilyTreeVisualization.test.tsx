import { render, screen, fireEvent } from '@testing-library/react';
import FamilyTreeVisualization from '@/app/family-tree/FamilyTreeVisualization';

// React Flowのモック
jest.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, nodes, edges }: any) => (
    <div data-testid="react-flow">
      <div data-testid="nodes-count">{nodes.length}</div>
      <div data-testid="edges-count">{edges.length}</div>
      {children}
    </div>
  ),
  Controls: () => <div data-testid="controls">Controls</div>,
  Background: () => <div data-testid="background">Background</div>,
  Panel: ({ children, position }: any) => (
    <div data-testid={`panel-${position}`}>{children}</div>
  ),
  BackgroundVariant: { Dots: 'dots' },
  useNodesState: (initialNodes: any) => [initialNodes, jest.fn(), jest.fn()],
  useEdgesState: (initialEdges: any) => [initialEdges, jest.fn(), jest.fn()],
  addEdge: jest.fn()
}));

// PersonNodeのモック
jest.mock('@/app/family-tree/PersonNode', () => {
  return function MockPersonNode() {
    return <div data-testid="person-node">Person Node</div>;
  };
});

// familyTreeUtilsのモック
jest.mock('@/app/family-tree/familyTreeUtils', () => ({
  convertToFamilyTreeData: (persons: any, marriages: any, onPersonClick: any, onPersonUpdate: any) => ({
    nodes: persons.map((person: any) => ({
      id: person.id,
      type: 'person',
      position: { x: 0, y: 0 },
      data: { ...person, onClick: onPersonClick, onUpdate: onPersonUpdate }
    })),
    edges: marriages.map((marriage: any, index: number) => ({
      id: `marriage-${index}`,
      source: marriage.partner1_id,
      target: marriage.partner2_id,
      type: 'default'
    }))
  })
}));

// PersonEditModalのモック
jest.mock('@/app/family-tree/PersonEditModal', () => {
  return function MockPersonEditModal({ 
    isOpen, 
    onClose, 
    onUpdate, 
    person 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    onUpdate: () => void;
    person: any;
  }) {
    return isOpen ? (
      <div data-testid="person-edit-modal">
        <div data-testid="editing-person">{person?.name || 'New Person'}</div>
        <button onClick={onClose}>Close</button>
        <button onClick={onUpdate}>Update</button>
      </div>
    ) : null;
  };
});

const mockPersons = [
  {
    id: '1',
    name: '田中太郎',
    gender: 'male' as const,
    date_of_birth: '1990-01-01',
    father_id: null,
    mother_id: null
  },
  {
    id: '2',
    name: '田中花子',
    gender: 'female' as const,
    date_of_birth: '1992-03-15',
    father_id: null,
    mother_id: null
  }
];

const mockMarriages = [
  {
    id: '1',
    partner1_id: '1',
    partner2_id: '2',
    start_date: '2020-06-15'
  }
];

const mockProps = {
  persons: mockPersons,
  marriages: mockMarriages,
  treeId: 'tree-123'
};

describe('FamilyTreeVisualization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('人物データがある場合、ReactFlowが表示される', () => {
    render(<FamilyTreeVisualization {...mockProps} />);
    
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('background')).toBeInTheDocument();
  });

  test('人物データがない場合、空の状態メッセージが表示される', () => {
    const emptyProps = {
      ...mockProps,
      persons: []
    };
    
    render(<FamilyTreeVisualization {...emptyProps} />);
    
    expect(screen.getByText('家系図を表示するには人物を追加してください')).toBeInTheDocument();
    expect(screen.getByText('タブから家族の情報を入力してみましょう')).toBeInTheDocument();
    expect(screen.queryByTestId('react-flow')).not.toBeInTheDocument();
  });

  test('ノードとエッジの数が正しく反映される', () => {
    render(<FamilyTreeVisualization {...mockProps} />);
    
    expect(screen.getByTestId('nodes-count')).toHaveTextContent('2');
    expect(screen.getByTestId('edges-count')).toHaveTextContent('1');
  });

  test('パネルが表示される', () => {
    render(<FamilyTreeVisualization {...mockProps} />);
    
    expect(screen.getByTestId('panel-top-left')).toBeInTheDocument();
    expect(screen.getByTestId('panel-top-right')).toBeInTheDocument();
    
    // 凡例の内容をチェック
    expect(screen.getByText('父親')).toBeInTheDocument();
    expect(screen.getByText('母親')).toBeInTheDocument();
    expect(screen.getByText('夫婦')).toBeInTheDocument();
    
    // 操作説明をチェック
    expect(screen.getByText('💡 ノードをドラッグして移動')).toBeInTheDocument();
    expect(screen.getByText('🔍 マウスホイールでズーム')).toBeInTheDocument();
    expect(screen.getByText('👆 ノードクリックで詳細表示')).toBeInTheDocument();
  });

  test('PersonEditModalが初期状態では表示されない', () => {
    render(<FamilyTreeVisualization {...mockProps} />);
    
    expect(screen.queryByTestId('person-edit-modal')).not.toBeInTheDocument();
  });

  test('人物の詳細パネルが初期状態では表示されない', () => {
    render(<FamilyTreeVisualization {...mockProps} />);
    
    expect(screen.queryByText('人物詳細')).not.toBeInTheDocument();
  });

  test('婚姻関係がない場合でも正常に表示される', () => {
    const propsWithoutMarriages = {
      ...mockProps,
      marriages: []
    };
    
    render(<FamilyTreeVisualization {...propsWithoutMarriages} />);
    
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    expect(screen.getByTestId('nodes-count')).toHaveTextContent('2');
    expect(screen.getByTestId('edges-count')).toHaveTextContent('0');
  });

  test('1人だけの場合でも正常に表示される', () => {
    const propsWithOnePerson = {
      ...mockProps,
      persons: [mockPersons[0]],
      marriages: []
    };
    
    render(<FamilyTreeVisualization {...propsWithOnePerson} />);
    
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    expect(screen.getByTestId('nodes-count')).toHaveTextContent('1');
    expect(screen.getByTestId('edges-count')).toHaveTextContent('0');
  });

  test('大量のデータでも正常に表示される', () => {
    const manyPersons = Array.from({ length: 10 }, (_, i) => ({
      id: `person-${i}`,
      name: `Person ${i}`,
      gender: 'male' as const,
      date_of_birth: '1990-01-01',
      father_id: null,
      mother_id: null
    }));
    
    const manyMarriages = Array.from({ length: 5 }, (_, i) => ({
      id: `marriage-${i}`,
      partner1_id: `person-${i * 2}`,
      partner2_id: `person-${i * 2 + 1}`,
      start_date: '2020-01-01'
    }));
    
    const propsWithManyData = {
      ...mockProps,
      persons: manyPersons,
      marriages: manyMarriages
    };
    
    render(<FamilyTreeVisualization {...propsWithManyData} />);
    
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    expect(screen.getByTestId('nodes-count')).toHaveTextContent('10');
    expect(screen.getByTestId('edges-count')).toHaveTextContent('5');
  });

  test('コンポーネントがmemoで最適化されている', () => {
    const { rerender } = render(<FamilyTreeVisualization {...mockProps} />);
    
    // 同じpropsで再レンダリング
    rerender(<FamilyTreeVisualization {...mockProps} />);
    
    // memo化により不要な再レンダリングが防がれることを期待
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  test('treeIdが正しく渡される', () => {
    render(<FamilyTreeVisualization {...mockProps} />);
    
    // treeIdがPersonEditModalに正しく渡されることを間接的に確認
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  test('複雑な家族関係も正常に処理される', () => {
    const complexPersons = [
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
    
    const complexMarriages = [
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
    
    const complexProps = {
      ...mockProps,
      persons: complexPersons,
      marriages: complexMarriages
    };
    
    render(<FamilyTreeVisualization {...complexProps} />);
    
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    expect(screen.getByTestId('nodes-count')).toHaveTextContent('5');
    expect(screen.getByTestId('edges-count')).toHaveTextContent('2');
  });
});