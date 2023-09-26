import Layout from "../../../components/Layout";
import Head from "next/head";
export default function Kasir() {
    let dataObat;

  return (
    <>
      <Head>
        <title>Kasir</title>
      </Head>
      <h1 className="title">Kasir</h1>

      <table className="table has-text-centered is-fullwidth">
        <thead>
          <tr>
            <th className="has-text-centered is-vcentered">No</th>
            <th className="has-text-centered is-vcentered">Kode Item</th>
            <th className="has-text-centered is-vcentered">Nama Item</th>
            <th className="has-text-centered is-vcentered">Stok</th>
            <th className="has-text-centered is-vcentered">Satuan</th>
            <th className="has-text-centered is-vcentered">Jenis</th>
            <th className="has-text-centered is-vcentered">Harga</th>
            <th className="has-text-centered is-vcentered">Rak</th>
            <th className="has-text-centered is-vcentered">Keterangan</th>
            <th className="has-text-centered is-vcentered">Tambah</th>
          </tr>
        </thead>
        <tbody>{}</tbody>
      </table>

      
    </>
  );
}

// export async function getServerSideProps(context){
//   let dataObat = 
//   "SELECT id_item, nama, stok, satuan.nama, jenis.nama, history_harga_jual.harga, rak.nama_rak " +
//   "FROM item INNER JOIN satuan on item.id_satuan = satuan.id_satuan " +
//     "INNER JOIN jenis on item.id_jenis = jenis.id_jenis " +
//     "INNJER JOIN rak on item.id_rak = rak.id_rak"
// }

Kasir.getLayout = function getLayout(page) {
  return <Layout clicked="Kasir">{page}</Layout>;
};
