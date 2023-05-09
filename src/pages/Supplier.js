import Layout from "../../components/Layout";
import Head from "next/head";
export default function Supplier() {
  return (
    <>
      <Head>
        <title>Supplier</title>
      </Head>
      <h1 className="title">Supplier</h1>
    </>
  );
}

Supplier.getLayout = function getLayout(page) {
  return <Layout clicked="Supplier">{page}</Layout>;
};
