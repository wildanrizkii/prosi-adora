import Layout from "../../../../components/Layout";
import Head from "next/head";
export default function JenisItem() {
  return (
    <>
      <Head>
        <title>Jenis Item</title>
      </Head>
      <h1 className="title">Jenis Item</h1>
    </>
  );
}

JenisItem.getLayout = function getLayout(page) {
  return <Layout clicked="Jenis Item">{page}</Layout>;
};
