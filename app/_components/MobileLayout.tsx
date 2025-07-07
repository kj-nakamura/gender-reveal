// app/_components/MobileLayout.tsx
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function MobileLayout({ children, className = "" }: Props) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className={`w-full max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
        <div className="w-full h-screen max-h-[800px] relative">
          {children}
        </div>
      </div>
    </div>
  );
}