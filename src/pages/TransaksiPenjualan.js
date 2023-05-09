import Layout from "../../components/Layout";
import Head from "next/head";
export default function TransaksiPenjualan() {
  return (
    <>
      <Head>
        <title>Transaksi Penjualan</title>
      </Head>
      <h1 className="title">Transaksi Penjualan</h1>
    </>
  );
}

TransaksiPenjualan.getLayout = function getLayout(page) {
  return <Layout clicked="Transaksi Penjualan">{page}</Layout>;
};
