import Layout from "../../../../components/Layout";
import Head from "next/head";
import Link from "next/link";
export default function TransaksiPembelian() {
  return (
    <>
      <Head>
        <title>Transaksi Pembelian</title>
      </Head>
      <h1 className="title">Transaksi Pembelian</h1>
      <Link href="/Transaksi/TransaksiPembelian/StokMin">
        Daftar Item yang dibawah stok minimum {""}
        <i className="fas fa-arrow-right" style={{ marginLeft: "5px" }} />
      </Link>
      <br />
      <Link
        className="button is-link"
        href="/Transaksi/TransaksiPembelian/Tambah"
        style={{ marginBottom: "10px", marginTop: "10px" }}
      >
        Tambah
      </Link>
    </>
  );
}

TransaksiPembelian.getLayout = function getLayout(page) {
  return <Layout clicked="Transaksi Pembelian">{page}</Layout>;
};
