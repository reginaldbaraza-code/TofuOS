'use client';

import Index from '@/views/Index';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ProjectProvider } from '@/contexts/ProjectContext';

export default function Home() {
  return (
    <ProtectedRoute>
      <ProjectProvider>
        <Index />
      </ProjectProvider>
    </ProtectedRoute>
  );
}
