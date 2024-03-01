import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import { DataProvider } from '../store/GlobalState';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <DataProvider>
    <MantineProvider>
      <Component {...pageProps} />;
      </MantineProvider>
      </DataProvider>
  );
}
