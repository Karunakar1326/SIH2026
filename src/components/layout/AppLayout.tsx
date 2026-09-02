import { type ReactNode } from 'react';
import { AuthoritativeHeader } from '@/components/shared/AuthoritativeHeader';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#141414] text-[#F5F5F5] font-sans">
      <AuthoritativeHeader />
      <main className="flex-1 overflow-auto bg-[#141414] text-[#F5F5F5] flex flex-col">
        {children}
      </main>
    </div>
  );
}
