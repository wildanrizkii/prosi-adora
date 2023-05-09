import Layout from "../../components/Layout";
import Head from "next/head";
export default function LaporanPenjualan() {
  return (
    <>
      <Head>
        <title>Laporan Penjualan</title>
      </Head>
      <h1 className="title">Laporan Penjualan</h1>
    </>
  );
}

LaporanPenjualan.getLayout = function getLayout(page) {
  return <Layout clicked="Laporan Penjualan">{page}</Layout>;
};
