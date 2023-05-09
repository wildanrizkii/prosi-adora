import Layout from "../../components/Layout";
import Head from "next/head";
export default function LaporanPembelian() {
  return (
    <>
      <Head>
        <title>Laporan Pembelian</title>
      </Head>
      <h1 className="title">Laporan Pembelian</h1>
    </>
  );
}

LaporanPembelian.getLayout = function getLayout(page) {
  return <Layout clicked="Laporan Pembelian">{page}</Layout>;
};
