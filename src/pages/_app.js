import Script from "next/script";
import "../styles/a.scss";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={pageProps.session}>
      {getLayout(
        <>
          <Script src="https://use.fontawesome.com/releases/v5.3.1/js/all.js" />
          <Component {...pageProps} />
        </>
      )}
    </SessionProvider>
  );
}
