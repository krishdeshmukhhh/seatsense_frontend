import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { StrictMode } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

const Clerk_Key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

if (!Clerk_Key) throw new Error('Clerk Publishable Key is missing in environment variables');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={Clerk_Key}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
