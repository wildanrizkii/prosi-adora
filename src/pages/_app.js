import Script from "next/script";
import "../styles/a.scss";
import { SessionProvider } from "next-auth/react";
import idID from "antd/locale/id_ID";
import { ConfigProvider } from "antd";
import { config } from "@fortawesome/fontawesome-svg-core";
import "../../node_modules/@fortawesome/fontawesome-svg-core/styles.css";
import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
config.autoAddCss = false;
dayjs.extend(localizedFormat);
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={pageProps.session}>
      {getLayout(
        <>
          {/* <Script src="https://use.fontawesome.com/releases/v5.3.1/js/all.js" /> */}
          <ConfigProvider locale={idID.default}>
            <Component {...pageProps} />
          </ConfigProvider>
        </>
      )}
    </SessionProvider>
  );
}
