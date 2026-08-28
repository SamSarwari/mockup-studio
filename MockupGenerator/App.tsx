import React from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, asyncStoragePersister } from './src/lib/queryClient';
import { AuthProvider } from './src/contexts/AuthContext';
import { MockupScreen } from './src/screens/MockupScreen';

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <AuthProvider>
        <MockupScreen />
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}
