import Layout from "../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../lib/db";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Kasir({
  hasil
}) {

  const onClickTambah = (e) => {
    console.log(e);
  }

  let semuaData;
  const router = useRouter();
  let index = 0;
  try {
    semuaData = hasil.map((x) => {
      index = index + 1;
      return (
        <tr key={x.id_item} style={{ fontWeight: "bold" }}>
          <td className="is-vcentered">{index}</td>
          <td className="is-vcentered">{x.id_item}</td>
          <td className="is-vcentered">{x.nama_item}</td>
          <td className="is-vcentered">{x.stok}</td>
          <td className="is-vcentered">{x.nama_satuan}</td>
          <td className="is-vcentered">{x.nama_jenis}</td>
          <td className="is-vcentered">{x.harga}</td>
          <td className="is-vcentered">{x.nama_rak}</td>
          <td className="is-vcentered">-</td>
          <td className="is-vcentered">
            <button
              className="button is-success"
              onClick={() => onClickTambah(x)}
            >
              +
            </button>
          </td>
        </tr>
      );
    });
  } catch (e) {
    semuaData = (
      <tr>
        <td colSpan="7" className="is-vcentered">
          {hasil}
        </td>
      </tr>
    );
  }

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
        <tbody>{semuaData}</tbody>
      </table>


    </>
  );
}

export async function getServerSideProps(context) {
  let query =
  "SELECT item.id_item, item.nama as nama_item, stok, satuan.nama as nama_satuan, jenis.nama as nama_jenis, history_harga_jual.harga, rak.nama_rak " +
  "FROM item INNER JOIN satuan on item.id_satuan = satuan.id_satuan INNER JOIN jenis on item.id_jenis_item = jenis.id_jenis " + 
  "INNER JOIN rak on item.id_rak = rak.id_rak INNER JOIN history_harga_jual on item.id_item = history_harga_jual.id_item "

  try {
    const getData = await handlerQuery({ query });
    const hasil = JSON.parse(JSON.stringify(getData));
    // const getUser = await handlerQuery({ query: queryUser});
    // const user = JSON.parse(JSON.stringify(getUser));
    // user.unshift({ idUser: "", username: "SEMUA" });
    return {
      props: {
        hasil
      },
    };
  } catch (e) {
    return {
      props: {
        hasil: e.message
      },
    };
  }
}

Kasir.getLayout = function getLayout(page) {
  return <Layout clicked="Kasir">{page}</Layout>;
};
