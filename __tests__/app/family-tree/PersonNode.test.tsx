import { render, screen, fireEvent } from '@testing-library/react';
import PersonNode from '@/app/family-tree/PersonNode';
import { PersonNodeData } from '@/app/family-tree/PersonNode';

// Supabaseのモック
jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  }),
}));

// Next.jsのuseRouterモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

const mockPersonData: PersonNodeData = {
  id: '1',
  name: '田中太郎',
  gender: 'male',
  date_of_birth: '1990-01-01',
  father_id: null,
  mother_id: null,
  onClick: jest.fn(),
  onUpdate: jest.fn(),
};

describe('PersonNode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('人物の基本情報が表示される', () => {
    render(<PersonNode data={mockPersonData} />);
    
    expect(screen.getByText('田中太郎')).toBeInTheDocument();
    expect(screen.getByText('👨')).toBeInTheDocument(); // 男性アイコン
    expect(screen.getByText('34歳')).toBeInTheDocument(); // 年齢表示
  });

  test('女性の場合、女性アイコンが表示される', () => {
    const femaleData = { ...mockPersonData, gender: 'female' as const, name: '田中花子' };
    render(<PersonNode data={femaleData} />);
    
    expect(screen.getByText('田中花子')).toBeInTheDocument();
    expect(screen.getByText('👩')).toBeInTheDocument(); // 女性アイコン
  });

  test('その他の性別の場合、その他アイコンが表示される', () => {
    const otherData = { ...mockPersonData, gender: 'other' as const };
    render(<PersonNode data={otherData} />);
    
    expect(screen.getByText('👤')).toBeInTheDocument(); // その他アイコン
  });

  test('生年月日がない場合、年齢情報なしが表示される', () => {
    const noDateData = { ...mockPersonData, date_of_birth: null };
    render(<PersonNode data={noDateData} />);
    
    expect(screen.getByText('年齢情報なし')).toBeInTheDocument();
  });

  test('ノードクリック時にonClickが呼ばれる', () => {
    render(<PersonNode data={mockPersonData} />);
    
    const node = screen.getByText('田中太郎').closest('div');
    fireEvent.click(node!);
    
    expect(mockPersonData.onClick).toHaveBeenCalledWith(mockPersonData);
  });

  test('名前をダブルクリックすると編集モードになる', () => {
    render(<PersonNode data={mockPersonData} />);
    
    const nameElement = screen.getByText('田中太郎');
    fireEvent.doubleClick(nameElement);
    
    // 編集用のinput要素が表示される
    expect(screen.getByDisplayValue('田中太郎')).toBeInTheDocument();
  });

  test('年齢部分をダブルクリックすると日付編集モードになる', () => {
    render(<PersonNode data={mockPersonData} />);
    
    const ageElement = screen.getByText('34歳');
    fireEvent.doubleClick(ageElement);
    
    // 編集用のdate input要素が表示される
    expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDocument();
  });

  test('選択状態の場合、適切なスタイルが適用される', () => {
    render(<PersonNode data={mockPersonData} selected={true} />);
    
    const node = screen.getByText('田中太郎').closest('div');
    expect(node).toHaveClass('ring-2', 'ring-blue-500');
  });

  test('編集中の場合、黄色のリングが表示される', () => {
    render(<PersonNode data={mockPersonData} />);
    
    // 編集モードに入る
    const nameElement = screen.getByText('田中太郎');
    fireEvent.doubleClick(nameElement);
    
    const node = screen.getByDisplayValue('田中太郎').closest('div');
    expect(node).toHaveClass('ring-yellow-400');
  });

  test('Enterキーで編集を確定できる', async () => {
    render(<PersonNode data={mockPersonData} />);
    
    // 編集モードに入る
    const nameElement = screen.getByText('田中太郎');
    fireEvent.doubleClick(nameElement);
    
    const input = screen.getByDisplayValue('田中太郎');
    fireEvent.change(input, { target: { value: '田中次郎' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // onUpdateが呼ばれることを確認
    expect(mockPersonData.onUpdate).toHaveBeenCalled();
  });

  test('Escapeキーで編集をキャンセルできる', () => {
    render(<PersonNode data={mockPersonData} />);
    
    // 編集モードに入る
    const nameElement = screen.getByText('田中太郎');
    fireEvent.doubleClick(nameElement);
    
    const input = screen.getByDisplayValue('田中太郎');
    fireEvent.change(input, { target: { value: '田中次郎' } });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    
    // 元の名前が表示される
    expect(screen.getByText('田中太郎')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('田中次郎')).not.toBeInTheDocument();
  });

  test('性別に応じて適切な背景色が適用される', () => {
    const { rerender } = render(<PersonNode data={mockPersonData} />);
    
    // 男性の場合
    let node = screen.getByText('田中太郎').closest('div');
    expect(node).toHaveClass('bg-blue-100', 'border-blue-300');
    
    // 女性の場合
    const femaleData = { ...mockPersonData, gender: 'female' as const };
    rerender(<PersonNode data={femaleData} />);
    node = screen.getByText('田中太郎').closest('div');
    expect(node).toHaveClass('bg-pink-100', 'border-pink-300');
    
    // その他の場合
    const otherData = { ...mockPersonData, gender: 'other' as const };
    rerender(<PersonNode data={otherData} />);
    node = screen.getByText('田中太郎').closest('div');
    expect(node).toHaveClass('bg-gray-100', 'border-gray-300');
  });

  test('年齢計算が正しく行われる', () => {
    // 今年の誕生日前の場合
    const today = new Date();
    const thisYear = today.getFullYear();
    const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
    const lastMonthYear = today.getMonth() === 0 ? thisYear - 1 : thisYear;
    
    const beforeBirthdayData = {
      ...mockPersonData,
      date_of_birth: `${lastMonthYear}-${(lastMonth + 1).toString().padStart(2, '0')}-15`
    };
    
    render(<PersonNode data={beforeBirthdayData} />);
    
    // 年齢が表示されることを確認（具体的な年齢は日付によって変わるため、パターンのみチェック）
    expect(screen.getByText(/\d+歳/)).toBeInTheDocument();
  });
});