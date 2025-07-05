import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ✨ ジェンダーリビール ✨
        </h1>
        <p className="text-gray-600 mb-8">
          赤ちゃんの性別を特別な方法で発表しませんか？
        </p>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            ログイン / 新規登録
          </Link>
          
          <Link
            href="/create"
            className="block w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
          >
            デザインを見る
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>🎈 複数のデザインテンプレートから選択</p>
          <p>🔗 共有リンクで家族や友人と共有</p>
          <p>💫 特別な瞬間を演出</p>
        </div>
      </div>
    </div>
  );
}
