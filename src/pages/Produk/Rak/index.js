import Layout from "../../../../components/Layout";
import Head from "next/head";
export default function Rak() {
  return (
    <>
      <Head>
        <title>Rak</title>
      </Head>
      <h1 className="title">Rak</h1>
    </>
  );
}

Rak.getLayout = function getLayout(page) {
  return <Layout clicked="Rak">{page}</Layout>;
};
