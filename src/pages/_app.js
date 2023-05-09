import Script from "next/script";
import "../styles/a.scss";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(
    <>
      <Script src="https://use.fontawesome.com/releases/v5.3.1/js/all.js" />
      <Component {...pageProps} />
    </>
  );
}
