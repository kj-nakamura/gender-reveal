// app/test-otp/page.tsx
import Link from "next/link";

export default function TestOTPPage() {
  const testEmail = "kenji.nkmr.1117@gmail.com";
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">OTP テスト</h1>
        
        <Link 
          href={`/verify-otp?email=${encodeURIComponent(testEmail)}`}
          className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600"
        >
          認証コード入力画面をテスト
        </Link>
        
        <p className="mt-4 text-sm text-gray-600">
          テスト用メール: {testEmail}
        </p>
      </div>
    </div>
  );
}