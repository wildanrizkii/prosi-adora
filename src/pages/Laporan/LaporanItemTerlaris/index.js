import Layout from "../../../../components/Layout";
import Head from "next/head";
export default function LaporanItemTerlaris() {
  return (
    <>
      <Head>
        <title>Laporan Item Terlaris</title>
      </Head>
      <h1 className="title">Laporan Item Terlaris</h1>
    </>
  );
}

LaporanItemTerlaris.getLayout = function getLayout(page) {
  return <Layout clicked="Laporan Item Terlaris">{page}</Layout>;
};
