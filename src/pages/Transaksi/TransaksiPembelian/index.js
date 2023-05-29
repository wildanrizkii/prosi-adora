import Layout from "../../../../components/Layout";
import Head from "next/head";
export default function TransaksiPembelian() {
  return (
    <>
      <Head>
        <title>Transaksi Pembelian</title>
      </Head>
      <h1 className="title">Transaksi Pembelian</h1>
    </>
  );
}

TransaksiPembelian.getLayout = function getLayout(page) {
  return <Layout clicked="Transaksi Pembelian">{page}</Layout>;
};
