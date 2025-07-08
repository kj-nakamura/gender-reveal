import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddMarriageModal from '@/app/family-tree/AddMarriageModal';

// Supabaseのモック
const mockInsert = jest.fn();

jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    from: jest.fn().mockReturnValue({
      insert: mockInsert.mockResolvedValue({ error: null })
    })
  })
}));

// Next.jsのuseRouterモック
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh
  })
}));

// グローバル関数のモック
global.alert = jest.fn();

const mockPersons = [
  {
    id: '1',
    name: '田中太郎',
    gender: 'male' as const
  },
  {
    id: '2',
    name: '田中花子',
    gender: 'female' as const
  },
  {
    id: '3',
    name: '佐藤次郎',
    gender: 'male' as const
  }
];

const mockProps = {
  treeId: 'tree-123',
  existingPersons: mockPersons,
  isOpen: true,
  onClose: jest.fn(),
  onUpdate: jest.fn()
};

describe('AddMarriageModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    document.body.style.overflow = 'unset';
  });

  test('モーダルが開いている時に表示される', () => {
    render(<AddMarriageModal {...mockProps} />);
    
    expect(screen.getByText('婚姻関係を追加')).toBeInTheDocument();
    expect(screen.getByText('パートナー1 *')).toBeInTheDocument();
    expect(screen.getByText('パートナー2 *')).toBeInTheDocument();
    expect(screen.getByText('結婚日')).toBeInTheDocument();
    expect(screen.getByText('追加')).toBeInTheDocument();
  });

  test('モーダルが閉じている時は表示されない', () => {
    render(<AddMarriageModal {...mockProps} isOpen={false} />);
    
    expect(screen.queryByText('婚姻関係を追加')).not.toBeInTheDocument();
  });

  test('既存の人物がパートナー選択肢に表示される', () => {
    render(<AddMarriageModal {...mockProps} />);
    
    // パートナー1の選択肢をチェック
    const partner1Select = screen.getByLabelText('パートナー1 *');
    expect(screen.getByRole('option', { name: '田中太郎 (男性)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '田中花子 (女性)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '佐藤次郎 (男性)' })).toBeInTheDocument();
  });

  test('正常な婚姻関係が追加される', async () => {
    render(<AddMarriageModal {...mockProps} />);
    
    // フォームに入力
    const partner1Select = screen.getByLabelText('パートナー1 *');
    const partner2Select = screen.getByLabelText('パートナー2 *');
    const startDateInput = screen.getByLabelText('結婚日');
    
    fireEvent.change(partner1Select, { target: { value: '1' } });
    fireEvent.change(partner2Select, { target: { value: '2' } });
    fireEvent.change(startDateInput, { target: { value: '2020-06-15' } });
    
    // 追加ボタンをクリック
    const addButton = screen.getByText('追加');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        tree_id: 'tree-123',
        partner1_id: '1',
        partner2_id: '2',
        start_date: '2020-06-15'
      });
    });
    
    expect(mockProps.onClose).toHaveBeenCalled();
    expect(mockProps.onUpdate).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
  });

  test('結婚日なしでも婚姻関係が追加される', async () => {
    render(<AddMarriageModal {...mockProps} />);
    
    // フォームに入力（結婚日は空のまま）
    const partner1Select = screen.getByLabelText('パートナー1 *');
    const partner2Select = screen.getByLabelText('パートナー2 *');
    
    fireEvent.change(partner1Select, { target: { value: '1' } });
    fireEvent.change(partner2Select, { target: { value: '2' } });
    
    // 追加ボタンをクリック
    const addButton = screen.getByText('追加');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        tree_id: 'tree-123',
        partner1_id: '1',
        partner2_id: '2',
        start_date: null
      });
    });
  });

  test('同一人物を選択した場合、エラーが表示される', async () => {
    render(<AddMarriageModal {...mockProps} />);
    
    // 同じ人物を両方のパートナーに設定
    const partner1Select = screen.getByLabelText('パートナー1 *');
    const partner2Select = screen.getByLabelText('パートナー2 *');
    
    fireEvent.change(partner1Select, { target: { value: '1' } });
    fireEvent.change(partner2Select, { target: { value: '1' } });
    
    // 追加ボタンをクリック
    const addButton = screen.getByText('追加');
    fireEvent.click(addButton);
    
    expect(global.alert).toHaveBeenCalledWith('同一人物を夫婦として登録することはできません');
    expect(mockInsert).not.toHaveBeenCalled();
  });

  test('人物が2人未満の場合、警告メッセージが表示される', () => {
    const propsWithFewPersons = {
      ...mockProps,
      existingPersons: [mockPersons[0]] // 1人だけ
    };
    
    render(<AddMarriageModal {...propsWithFewPersons} />);
    
    expect(screen.getByText('婚姻関係を登録するには、2人以上の人物が必要です。')).toBeInTheDocument();
  });

  test('人物が2人未満の場合、追加ボタンが無効化される', () => {
    const propsWithFewPersons = {
      ...mockProps,
      existingPersons: [mockPersons[0]] // 1人だけ
    };
    
    render(<AddMarriageModal {...propsWithFewPersons} />);
    
    const addButton = screen.getByText('追加');
    expect(addButton).toBeDisabled();
  });

  test('Escキーでモーダルが閉じる', () => {
    render(<AddMarriageModal {...mockProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('モーダル外クリックでモーダルが閉じる', () => {
    render(<AddMarriageModal {...mockProps} />);
    
    // モーダルの背景部分をクリック
    const backdrop = screen.getByText('婚姻関係を追加').closest('div')!.parentElement!;
    fireEvent.click(backdrop);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('×ボタンでモーダルが閉じる', () => {
    render(<AddMarriageModal {...mockProps} />);
    
    const closeButton = screen.getByRole('button', { name: '' }); // SVGアイコンのボタン
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('キャンセルボタンでモーダルが閉じる', () => {
    render(<AddMarriageModal {...mockProps} />);
    
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('ローディング中はボタンが無効化される', async () => {
    render(<AddMarriageModal {...mockProps} />);
    
    // フォームに入力
    const partner1Select = screen.getByLabelText('パートナー1 *');
    const partner2Select = screen.getByLabelText('パートナー2 *');
    
    fireEvent.change(partner1Select, { target: { value: '1' } });
    fireEvent.change(partner2Select, { target: { value: '2' } });
    
    const addButton = screen.getByText('追加');
    fireEvent.click(addButton);
    
    // ローディング中のテキストが表示される
    await waitFor(() => {
      expect(screen.getByText('追加中...')).toBeInTheDocument();
    });
  });

  test('ローディング中は入力フィールドが無効化される', async () => {
    render(<AddMarriageModal {...mockProps} />);
    
    // フォームに入力
    const partner1Select = screen.getByLabelText('パートナー1 *');
    const partner2Select = screen.getByLabelText('パートナー2 *');
    
    fireEvent.change(partner1Select, { target: { value: '1' } });
    fireEvent.change(partner2Select, { target: { value: '2' } });
    
    const addButton = screen.getByText('追加');
    fireEvent.click(addButton);
    
    // フィールドが無効化されることを確認
    await waitFor(() => {
      expect(partner1Select).toBeDisabled();
      expect(partner2Select).toBeDisabled();
    });
  });

  test('必須項目が空の場合、フォーム送信がブロックされる', () => {
    render(<AddMarriageModal {...mockProps} />);
    
    // パートナー1のみ選択してパートナー2は空のまま
    const partner1Select = screen.getByLabelText('パートナー1 *');
    fireEvent.change(partner1Select, { target: { value: '1' } });
    
    const addButton = screen.getByText('追加');
    fireEvent.click(addButton);
    
    // required属性により送信がブロックされることを期待
    expect(mockInsert).not.toHaveBeenCalled();
  });

  test('モーダルが開くたびにフォームがリセットされる', () => {
    const { rerender } = render(<AddMarriageModal {...mockProps} isOpen={false} />);
    
    // モーダルを開く
    rerender(<AddMarriageModal {...mockProps} isOpen={true} />);
    
    // フォームに値を入力
    const partner1Select = screen.getByLabelText('パートナー1 *');
    fireEvent.change(partner1Select, { target: { value: '1' } });
    
    // モーダルを閉じて再度開く
    rerender(<AddMarriageModal {...mockProps} isOpen={false} />);
    rerender(<AddMarriageModal {...mockProps} isOpen={true} />);
    
    // フォームがリセットされていることを確認
    expect(partner1Select).toHaveValue('');
  });

  test('モーダルが開いている間はbody要素のスクロールが無効化される', () => {
    const { unmount } = render(<AddMarriageModal {...mockProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    
    expect(document.body.style.overflow).toBe('unset');
  });

  test('Supabaseエラー時にアラートが表示される', async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: 'Database error' } });
    
    render(<AddMarriageModal {...mockProps} />);
    
    // フォームに入力
    const partner1Select = screen.getByLabelText('パートナー1 *');
    const partner2Select = screen.getByLabelText('パートナー2 *');
    
    fireEvent.change(partner1Select, { target: { value: '1' } });
    fireEvent.change(partner2Select, { target: { value: '2' } });
    
    // 追加ボタンをクリック
    const addButton = screen.getByText('追加');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('婚姻関係の追加に失敗しました');
    });
  });
});