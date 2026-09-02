import { type ReactNode } from 'react';
import { WorkspaceSidebar } from './WorkspaceSidebar';

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div className="flex flex-row h-screen overflow-hidden bg-[#141414] text-[#F5F5F5] font-sans">
      <WorkspaceSidebar />
      <main className="flex-1 overflow-auto bg-[#141414] text-[#F5F5F5] flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}

