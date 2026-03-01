'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Settings from "@/views/Settings";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <ProjectProvider>
        <Settings />
      </ProjectProvider>
    </ProtectedRoute>
  );
}
