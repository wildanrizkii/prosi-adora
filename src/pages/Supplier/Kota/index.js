import Layout from "../../../../components/Layout";
import Head from "next/head";
export default function Kota() {
  return (
    <>
      <Head>
        <title>Kota</title>
      </Head>
      <h1 className="title">Kota</h1>
    </>
  );
}

Kota.getLayout = function getLayout(page) {
  return <Layout clicked="Kota">{page}</Layout>;
};
