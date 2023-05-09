import Layout from "../../components/Layout";
import Head from "next/head";
export default function SatuanItem() {
  return (
    <>
      <Head>
        <title>Satuan Item</title>
      </Head>
      <h1 className="title">Satuan Item</h1>
    </>
  );
}

SatuanItem.getLayout = function getLayout(page) {
  return <Layout clicked="Satuan Item">{page}</Layout>;
};
