import Head from "next/head";
import Layout from "../../../../components/Layout";

export default function Tambah() {
  return (
    <>
      <Head>
        <title>Tambah Transaksi Pembelian</title>
      </Head>
      <h1 className="title">Tambah Transaksi Pembelian</h1>
    </>
  );
}

Tambah.getLayout = function getLayout(page) {
  return <Layout clicked="Transaksi Pembelian">{page}</Layout>;
};
