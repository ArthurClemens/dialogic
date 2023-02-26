import '../styles/globals.css';

import { Dialog, Notification } from 'dialogic-react';
import type { AppProps } from 'next/app';

import { StoreProvider } from '../utils/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='app'>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
      <Notification />
      <Dialog />
    </div>
  );
}
