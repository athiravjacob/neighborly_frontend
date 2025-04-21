import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {  QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor } from './redux/store'
import './index.css'
import App from './App.tsx'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:2,
      staleTime: 5 * 60 * 1000, 
      gcTime: 30 * 60 * 1000, 
    },
    mutations: {
      retry:1
    }
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
