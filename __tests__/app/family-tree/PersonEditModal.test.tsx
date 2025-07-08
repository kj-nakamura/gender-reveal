import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PersonEditModal from '@/app/family-tree/PersonEditModal';

// Supabaseのモック
const mockUpdate = jest.fn();
const mockInsert = jest.fn();
const mockDelete = jest.fn();

jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    from: jest.fn().mockReturnValue({
      update: mockUpdate.mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null })
      }),
      insert: mockInsert.mockResolvedValue({ error: null }),
      delete: mockDelete.mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null })
      })
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
global.confirm = jest.fn();
global.alert = jest.fn();

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

const mockProps = {
  person: null,
  existingPersons: mockPersons,
  isOpen: true,
  onClose: jest.fn(),
  onUpdate: jest.fn(),
  treeId: 'tree-123'
};

describe('PersonEditModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    document.body.style.overflow = 'unset';
  });

  test('モーダルが開いている時に表示される', () => {
    render(<PersonEditModal {...mockProps} />);
    
    expect(screen.getByText('新しい人物を追加')).toBeInTheDocument();
    expect(screen.getByText('名前 *')).toBeInTheDocument();
    expect(screen.getByText('性別 *')).toBeInTheDocument();
    expect(screen.getByText('追加')).toBeInTheDocument();
  });

  test('モーダルが閉じている時は表示されない', () => {
    render(<PersonEditModal {...mockProps} isOpen={false} />);
    
    expect(screen.queryByText('新しい人物を追加')).not.toBeInTheDocument();
  });

  test('編集モードの場合、既存の人物情報が表示される', () => {
    const editProps = {
      ...mockProps,
      person: mockPersons[0]
    };
    
    render(<PersonEditModal {...editProps} />);
    
    expect(screen.getByText('人物情報の編集')).toBeInTheDocument();
    expect(screen.getByDisplayValue('田中太郎')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDocument();
    expect(screen.getByText('更新')).toBeInTheDocument();
    expect(screen.getByText('削除')).toBeInTheDocument();
  });

  test('新規追加モードでフォーム送信すると人物が追加される', async () => {
    render(<PersonEditModal {...mockProps} />);
    
    // フォームに入力
    const nameInput = screen.getByLabelText('名前 *');
    const genderSelect = screen.getByLabelText('性別 *');
    const dateInput = screen.getByLabelText('生年月日');
    
    fireEvent.change(nameInput, { target: { value: '新しい人物' } });
    fireEvent.change(genderSelect, { target: { value: 'female' } });
    fireEvent.change(dateInput, { target: { value: '2000-01-01' } });
    
    // 追加ボタンをクリック
    const addButton = screen.getByText('追加');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        tree_id: 'tree-123',
        name: '新しい人物',
        gender: 'female',
        date_of_birth: '2000-01-01',
        father_id: null,
        mother_id: null
      });
    });
    
    expect(mockProps.onClose).toHaveBeenCalled();
    expect(mockProps.onUpdate).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
  });

  test('編集モードでフォーム送信すると人物情報が更新される', async () => {
    const editProps = {
      ...mockProps,
      person: mockPersons[0]
    };
    
    render(<PersonEditModal {...editProps} />);
    
    // 名前を変更
    const nameInput = screen.getByDisplayValue('田中太郎');
    fireEvent.change(nameInput, { target: { value: '田中次郎' } });
    
    // 更新ボタンをクリック
    const updateButton = screen.getByText('更新');
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
    
    expect(mockProps.onClose).toHaveBeenCalled();
    expect(mockProps.onUpdate).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
  });

  test('削除ボタンで人物を削除できる', async () => {
    const editProps = {
      ...mockProps,
      person: mockPersons[0]
    };
    
    (global.confirm as jest.Mock).mockReturnValue(true);
    
    render(<PersonEditModal {...editProps} />);
    
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalledWith('「田中太郎」を削除しますか？この操作は取り消せません。');
      expect(mockDelete).toHaveBeenCalled();
    });
    
    expect(mockProps.onClose).toHaveBeenCalled();
    expect(mockProps.onUpdate).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
  });

  test('削除の確認でキャンセルすると削除されない', async () => {
    const editProps = {
      ...mockProps,
      person: mockPersons[0]
    };
    
    (global.confirm as jest.Mock).mockReturnValue(false);
    
    render(<PersonEditModal {...editProps} />);
    
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);
    
    expect(global.confirm).toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Escキーでモーダルが閉じる', () => {
    render(<PersonEditModal {...mockProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('モーダル外クリックでモーダルが閉じる', () => {
    render(<PersonEditModal {...mockProps} />);
    
    // モーダルの背景部分をクリック
    const backdrop = screen.getByText('新しい人物を追加').closest('div')!.parentElement!;
    fireEvent.click(backdrop);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('×ボタンでモーダルが閉じる', () => {
    render(<PersonEditModal {...mockProps} />);
    
    const closeButton = screen.getByRole('button', { name: '' }); // SVGアイコンのボタン
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('キャンセルボタンでモーダルが閉じる', () => {
    render(<PersonEditModal {...mockProps} />);
    
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('父親・母親の選択肢が性別に応じてフィルタリングされる', () => {
    render(<PersonEditModal {...mockProps} />);
    
    const fatherSelect = screen.getByLabelText('父親');
    const motherSelect = screen.getByLabelText('母親');
    
    // 父親の選択肢には男性のみ表示
    expect(screen.getByRole('option', { name: '田中太郎' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: '田中花子' })).not.toBeInTheDocument();
    
    // 母親の選択肢をチェック
    fireEvent.focus(motherSelect);
    const options = screen.getAllByRole('option');
    const motherOptions = options.filter(option => option.textContent === '田中花子');
    expect(motherOptions.length).toBeGreaterThan(0);
  });

  test('編集時に現在の情報が表示される', () => {
    const editProps = {
      ...mockProps,
      person: mockPersons[0]
    };
    
    render(<PersonEditModal {...editProps} />);
    
    expect(screen.getByText('現在の情報')).toBeInTheDocument();
    expect(screen.getByText('性別: 男性')).toBeInTheDocument();
    expect(screen.getByText('生年月日: 1990-01-01')).toBeInTheDocument();
  });

  test('必須項目が空の場合、フォーム送信がブロックされる', () => {
    render(<PersonEditModal {...mockProps} />);
    
    const nameInput = screen.getByLabelText('名前 *');
    const addButton = screen.getByText('追加');
    
    // 名前を空にする
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.click(addButton);
    
    // required属性により送信がブロックされることを期待
    expect(mockInsert).not.toHaveBeenCalled();
  });

  test('ローディング中はボタンが無効化される', async () => {
    render(<PersonEditModal {...mockProps} />);
    
    const nameInput = screen.getByLabelText('名前 *');
    fireEvent.change(nameInput, { target: { value: 'テスト' } });
    
    const addButton = screen.getByText('追加');
    fireEvent.click(addButton);
    
    // ローディング中のテキストが表示される
    await waitFor(() => {
      expect(screen.getByText('追加中...')).toBeInTheDocument();
    });
  });

  test('モーダルが開いている間はbody要素のスクロールが無効化される', () => {
    const { unmount } = render(<PersonEditModal {...mockProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    
    expect(document.body.style.overflow).toBe('unset');
  });
});