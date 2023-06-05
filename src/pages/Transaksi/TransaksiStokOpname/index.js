import Layout from "../../../../components/Layout";
import Head from "next/head";
export default function TransaksiStokOpname() {
  return (
    <>
      <Head>
        <title>Transaksi Stok Opname</title>
      </Head>
      <h1 className="title">Transaksi Stok Opname</h1>
    </>
  );
}

TransaksiStokOpname.getLayout = function getLayout(page) {
  return <Layout clicked="Transaksi Stok Opname">{page}</Layout>;
};
