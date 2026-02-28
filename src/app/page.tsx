'use client';

import Index from '@/pages/Index';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <Index />
    </ProtectedRoute>
  );
}
