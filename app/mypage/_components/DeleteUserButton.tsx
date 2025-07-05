"use client";

import { useState } from "react";
import { deleteUser } from "@/app/auth/actions";

export default function DeleteUserButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await deleteUser();
      if (!result.success) {
        setError(result.error || "アカウントの削除に失敗しました");
        setIsLoading(false);
      }
      // 成功時は自動的にリダイレクトされる
    } catch (error) {
      console.error("Delete failed:", error);
      setError("エラーが発生しました");
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:text-red-700 text-sm font-medium border border-red-200 hover:border-red-300 px-3 py-1 rounded"
      >
        アカウント削除
      </button>

      {/* アカウント削除確認ダイアログ */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-center mb-4">アカウントを削除しますか？</h3>
            
            <div className="text-sm text-gray-600 mb-6 space-y-2">
              <p className="font-semibold text-red-600">⚠️ この操作は元に戻せません</p>
              <ul className="list-disc list-inside space-y-1">
                <li>アカウントが完全に削除されます</li>
                <li>作成したリビールデータもすべて削除されます</li>
                <li>共有リンクは無効になります</li>
                <li>同じメールアドレスで再登録は可能です</li>
              </ul>
            </div>

            {error && (
              <div className="text-sm text-red-600 mb-4 p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowConfirm(false);
                  setError("");
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button 
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {isLoading ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}