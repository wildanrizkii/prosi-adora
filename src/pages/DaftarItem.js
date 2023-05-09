import Layout from "../../components/Layout";
import Head from "next/head";
export default function DaftarItem() {
  return (
    <>
      <Head>
        <title>Daftar Item</title>
      </Head>
      <h1 className="title">Daftar Item</h1>
    </>
  );
}

DaftarItem.getLayout = function getLayout(page) {
  return <Layout clicked="Daftar Item">{page}</Layout>;
};
