'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Analytics from "@/views/Analytics";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <ProjectProvider>
        <Analytics />
      </ProjectProvider>
    </ProtectedRoute>
  );
}
