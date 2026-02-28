'use client';

import Index from '@/views/Index';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <Index />
    </ProtectedRoute>
  );
}
