import Head from "next/head";
import Layout from "../../../../components/Layout";
import { useState } from "react";
import handlerQuery from "../../../../lib/db";
export default function StokMin({ hasil }) {
  console.log(hasil);
  let semuaProduk;
  try {
    semuaProduk = hasil.map((x, index) => {
      return (
        <tr
          key={x.id_item}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 ? "red" : "white",
            color: x.status === 0 ? "white" : "rgb(54,54,54)",
          }}
        >
          <td className="is-vcentered">{index + 1}</td>
          <td className="is-vcentered">{x.nama}</td>
          <td className="is-vcentered">{x.stok}</td>
          <td className="is-vcentered">{x.stok_min}</td>
          <td className="is-vcentered">{x.nama_rak}</td>
          <td className="is-vcentered">{x.nama_satuan}</td>
          <td className="is-vcentered">{x.nama_jenis}</td>
        </tr>
      );
    });
  } catch (e) {
    semuaProduk = (
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
        <title>Stok Minimum</title>
      </Head>
      <h1 className="title">Item yang di bawah Stok Minimum</h1>
      <table className="table has-text-centered">
        <thead>
          <tr>
            <th className="has-text-centered is-vcentered">No</th>
            <th className="has-text-centered is-vcentered">Nama</th>
            <th className="has-text-centered is-vcentered">Stok</th>
            <th className="has-text-centered is-vcentered">Stok Minimum</th>
            <th className="has-text-centered is-vcentered">Rak</th>
            <th className="has-text-centered is-vcentered">Satuan</th>
            <th className="has-text-centered is-vcentered">Jenis</th>
          </tr>
        </thead>
        <tbody>{semuaProduk}</tbody>
      </table>
    </>
  );
}

export async function getServerSideProps() {
  const query =
    "select id_item,item.nama as nama,stok,stok_min,item.status,nama_rak,satuan.nama as nama_satuan,jenis.nama as nama_jenis " +
    "from item inner join rak on item.id_rak = rak.id_rak inner join satuan on " +
    "item.id_satuan=satuan.id_satuan inner join jenis on item.id_jenis_item = jenis.id_jenis " +
    "where stok<stok_min";
  const values = [];
  try {
    const getData = await handlerQuery({ query, values });
    const hasil = JSON.parse(JSON.stringify(getData));
    return {
      props: {
        hasil,
      },
    };
  } catch (e) {
    return {
      props: {
        hasil: e.message,
      },
    };
  }
}

StokMin.getLayout = function getLayout(page) {
  return <Layout clicked="Transaksi Pembelian">{page}</Layout>;
};
