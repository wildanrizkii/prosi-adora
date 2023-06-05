import Layout from "../../../components/Layout";
import Head from "next/head";
export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h1 className="title">Dashboard</h1>
    </>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <Layout clicked="Dashboard">{page}</Layout>;
};
