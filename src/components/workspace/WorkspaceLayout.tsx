import { type ReactNode } from 'react';
import { WorkspaceHeader } from './WorkspaceHeader';

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-50 font-sans">
      <WorkspaceHeader />
      <main className="flex-1 overflow-auto bg-neutral-50 flex flex-col">
        {children}
      </main>
    </div>
  );
}
