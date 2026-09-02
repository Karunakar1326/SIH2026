import { type ReactNode } from 'react';
import { AuthoritativeHeader } from '@/components/shared/AuthoritativeHeader';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-50 font-sans">
      <AuthoritativeHeader />
      <main className="flex-1 overflow-auto bg-neutral-50 flex flex-col">
        {children}
      </main>
    </div>
  );
}
