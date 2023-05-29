import Layout from "../../../../components/Layout";
import Head from "next/head";
export default function DataSupplier() {
  return (
    <>
      <Head>
        <title>Data Supplier</title>
      </Head>
      <h1 className="title">Data Supplier</h1>
    </>
  );
}

DataSupplier.getLayout = function getLayout(page) {
  return <Layout clicked="Data Supplier">{page}</Layout>;
};
