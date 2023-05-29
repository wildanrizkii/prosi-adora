import Layout from "../../../components/Layout";
import Head from "next/head";
export default function Kasir() {
  return (
    <>
      <Head>
        <title>Kasir</title>
      </Head>
      <h1 className="title">Kasir</h1>
    </>
  );
}

Kasir.getLayout = function getLayout(page) {
  return <Layout clicked="Kasir">{page}</Layout>;
};
