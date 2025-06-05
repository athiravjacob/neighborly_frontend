import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {  QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor } from './redux/store'
import './index.css'
import App from './App.tsx'
import './utils/leafletSetup';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
    </Provider>a
  </StrictMode>,
)
