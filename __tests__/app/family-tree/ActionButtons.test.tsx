import { render, screen, fireEvent } from '@testing-library/react';
import ActionButtons from '@/app/family-tree/ActionButtons';

// PersonEditModal と AddMarriageModal のモック
jest.mock('@/app/family-tree/PersonEditModal', () => {
  return function MockPersonEditModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return isOpen ? (
      <div data-testid="person-edit-modal">
        <button onClick={onClose}>Close Person Modal</button>
      </div>
    ) : null;
  };
});

jest.mock('@/app/family-tree/AddMarriageModal', () => {
  return function MockAddMarriageModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return isOpen ? (
      <div data-testid="add-marriage-modal">
        <button onClick={onClose}>Close Marriage Modal</button>
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
  treeId: 'tree-123',
  persons: mockPersons,
  marriages: mockMarriages
};

describe('ActionButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('基本的なUIが表示される', () => {
    render(<ActionButtons {...mockProps} />);
    
    expect(screen.getByText('家系図を編集')).toBeInTheDocument();
    expect(screen.getByText('人物を追加')).toBeInTheDocument();
    expect(screen.getByText('婚姻を追加')).toBeInTheDocument();
  });

  test('統計情報が正しく表示される', () => {
    render(<ActionButtons {...mockProps} />);
    
    // 登録人物数
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('登録人物')).toBeInTheDocument();
    
    // 婚姻関係数
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('婚姻関係')).toBeInTheDocument();
  });

  test('人物追加ボタンをクリックするとPersonEditModalが開く', () => {
    render(<ActionButtons {...mockProps} />);
    
    const addPersonButton = screen.getByText('人物を追加');
    fireEvent.click(addPersonButton);
    
    expect(screen.getByTestId('person-edit-modal')).toBeInTheDocument();
  });

  test('婚姻追加ボタンをクリックするとAddMarriageModalが開く', () => {
    render(<ActionButtons {...mockProps} />);
    
    const addMarriageButton = screen.getByText('婚姻を追加');
    fireEvent.click(addMarriageButton);
    
    expect(screen.getByTestId('add-marriage-modal')).toBeInTheDocument();
  });

  test('PersonEditModalを閉じることができる', () => {
    render(<ActionButtons {...mockProps} />);
    
    // モーダルを開く
    const addPersonButton = screen.getByText('人物を追加');
    fireEvent.click(addPersonButton);
    
    expect(screen.getByTestId('person-edit-modal')).toBeInTheDocument();
    
    // モーダルを閉じる
    const closeButton = screen.getByText('Close Person Modal');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('person-edit-modal')).not.toBeInTheDocument();
  });

  test('AddMarriageModalを閉じることができる', () => {
    render(<ActionButtons {...mockProps} />);
    
    // モーダルを開く
    const addMarriageButton = screen.getByText('婚姻を追加');
    fireEvent.click(addMarriageButton);
    
    expect(screen.getByTestId('add-marriage-modal')).toBeInTheDocument();
    
    // モーダルを閉じる
    const closeButton = screen.getByText('Close Marriage Modal');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('add-marriage-modal')).not.toBeInTheDocument();
  });

  test('人物が2人未満の場合、婚姻追加ボタンが無効化される', () => {
    const propsWithOnePerson = {
      ...mockProps,
      persons: [mockPersons[0]] // 1人だけ
    };
    
    render(<ActionButtons {...propsWithOnePerson} />);
    
    const addMarriageButton = screen.getByText('婚姻を追加');
    expect(addMarriageButton).toBeDisabled();
  });

  test('人物が2人未満の場合、注意書きが表示される', () => {
    const propsWithOnePerson = {
      ...mockProps,
      persons: [mockPersons[0]] // 1人だけ
    };
    
    render(<ActionButtons {...propsWithOnePerson} />);
    
    expect(screen.getByText('💡 婚姻関係を追加するには、まず2人以上の人物を登録してください。')).toBeInTheDocument();
  });

  test('人物が2人以上の場合、注意書きが表示されない', () => {
    render(<ActionButtons {...mockProps} />);
    
    expect(screen.queryByText('💡 婚姻関係を追加するには、まず2人以上の人物を登録してください。')).not.toBeInTheDocument();
  });

  test('人物が2人以上の場合、婚姻追加ボタンが有効', () => {
    render(<ActionButtons {...mockProps} />);
    
    const addMarriageButton = screen.getByText('婚姻を追加');
    expect(addMarriageButton).not.toBeDisabled();
  });

  test('人物が0人の場合の統計情報', () => {
    const propsWithNoPersons = {
      ...mockProps,
      persons: [],
      marriages: []
    };
    
    render(<ActionButtons {...propsWithNoPersons} />);
    
    // 統計が0と表示される
    const personCount = screen.getAllByText('0');
    expect(personCount).toHaveLength(2); // 人物数と婚姻数の両方が0
    expect(screen.getByText('登録人物')).toBeInTheDocument();
    expect(screen.getByText('婚姻関係')).toBeInTheDocument();
  });

  test('人物追加ボタンは人物数に関係なく常に有効', () => {
    const propsWithNoPersons = {
      ...mockProps,
      persons: []
    };
    
    render(<ActionButtons {...propsWithNoPersons} />);
    
    const addPersonButton = screen.getByText('人物を追加');
    expect(addPersonButton).not.toBeDisabled();
  });

  test('ボタンに適切なアイコンが表示される', () => {
    render(<ActionButtons {...mockProps} />);
    
    // SVGアイコンが存在することを確認
    const addPersonButton = screen.getByText('人物を追加').parentElement;
    const addMarriageButton = screen.getByText('婚姻を追加').parentElement;
    
    expect(addPersonButton?.querySelector('svg')).toBeInTheDocument();
    expect(addMarriageButton?.querySelector('svg')).toBeInTheDocument();
  });

  test('統計情報のスタイリングが正しく適用される', () => {
    render(<ActionButtons {...mockProps} />);
    
    // 統計情報の数値が太字で表示される
    const personCountElement = screen.getByText('2');
    const marriageCountElement = screen.getByText('1');
    
    expect(personCountElement).toHaveClass('text-2xl', 'font-bold', 'text-blue-600');
    expect(marriageCountElement).toHaveClass('text-2xl', 'font-bold', 'text-green-600');
  });

  test('複数のモーダルを同時に開くことはできない', () => {
    render(<ActionButtons {...mockProps} />);
    
    // 人物追加モーダルを開く
    const addPersonButton = screen.getByText('人物を追加');
    fireEvent.click(addPersonButton);
    
    expect(screen.getByTestId('person-edit-modal')).toBeInTheDocument();
    expect(screen.queryByTestId('add-marriage-modal')).not.toBeInTheDocument();
    
    // 婚姻追加ボタンをクリック
    const addMarriageButton = screen.getByText('婚姻を追加');
    fireEvent.click(addMarriageButton);
    
    // 人物追加モーダルは開いたまま、婚姻追加モーダルも開く
    expect(screen.getByTestId('person-edit-modal')).toBeInTheDocument();
    expect(screen.getByTestId('add-marriage-modal')).toBeInTheDocument();
  });
});