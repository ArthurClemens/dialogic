import "../styles/globals.css";
import type { AppProps } from "next/app";
import { StoreProvider } from "../utils/store";
import { Dialog, Notification } from "dialogic-react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="app">
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
      <Notification />
      <Dialog />
    </div>
  );
}
export default MyApp;
