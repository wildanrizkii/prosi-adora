import Layout from "../../../components/Layout";
import Head from "next/head";
import moment from "moment";
import React, { useState, useEffect } from "react";
import axios from "axios";
import handlerQuery from "../../../lib/db";

export default function Dashboard({ hasil }) {
  const todayDate = moment().format("D MMMM YYYY");

  const formatRupiah = (number) => {
    if (typeof number !== "number") {
      return "Rp 0";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const [totalUmum, setTotalUmum] = useState(70);
  const [totalResep, setTotalResep] = useState(5);
  const [omsetUmum, setOmsetUmum] = useState(3150000);
  const [omsetResep, setOmsetResep] = useState(825000);

  useEffect(() => {
    const fetchTotalTransactions = async () => {
      try {
        const response = await axios.get("/api/TotalTransaksiHariIni"); // Replace with your actual API endpoint
        const { totalUmum, totalResep } = response.data;
        setTotalUmum(totalUmum);
        setTotalResep(totalResep);
      } catch (error) {
        console.error("Failed to fetch total transactions:", error);
      }
    };

    fetchTotalTransactions();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h1 className="title">Dashboard</h1>
      <div className="columns">
        <div className="column is-8">
          <table className="table is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th colSpan="4" className="subtitle is-5">
                  10 Item Terlaris pada Bulan ini
                </th>
              </tr>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Jumlah Item Terjual</th>
                <th>Satuan</th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.Nama_Item}</td>
                  <td>{item.Jumlah_Item_Terjual}</td>
                  <td>{item.Satuan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="column is-4 is-flex is-flex-direction-column is-justify-content-center">
          <div className="is-flex is-justify-content-space-between">
            <p className="title is-5 mr-1">Total Transaksi Hari ini</p>
            <p>{todayDate}</p>
          </div>
          <div className="columns is-flex">
            <div className="column is-half">
              <div className="box" style={{ backgroundColor: "#609966" }}>
                <p className="title is-5 has-text-white has-text-centered">
                  Umum
                </p>
                <p className="has-text-white has-text-centered title is-5">
                  {totalUmum}
                </p>
              </div>
            </div>
            <div className="column is-half">
              <div className="box" style={{ backgroundColor: "#609966" }}>
                <p className="title is-5 has-text-white has-text-centered">
                  Resep
                </p>
                <p className="has-text-white has-text-centered title is-5">
                  {totalResep}
                </p>
              </div>
            </div>
          </div>
          <div className="is-flex is-justify-content-space-between">
            <p className="title is-5 mr-1">Total Omset Hari ini</p>
            <p>{todayDate}</p>
          </div>
          <div className="columns is-flex">
            <div className="column is-half">
              <div className="box" style={{ backgroundColor: "#9DC08B" }}>
                <p className="title is-5 has-text-white has-text-centered">
                  Umum
                </p>
                <p className="has-text-white has-text-centered title is-5">
                  {formatRupiah(omsetUmum)}
                </p>
              </div>
            </div>
            <div className="column is-half">
              <div className="box" style={{ backgroundColor: "#9DC08B" }}>
                <p className="title is-5 has-text-white has-text-centered">
                  Resep
                </p>
                <p className="has-text-white has-text-centered title is-5">
                  {formatRupiah(omsetResep)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    let query = `
      SELECT i.nama AS Nama_Item, SUM(dt.jumlah) AS Jumlah_Item_Terjual, s.nama AS Satuan
      FROM transaksi_penjualan tp
      JOIN detail_transaksi_penjualan dt ON tp.no_transaksi = dt.no_transaksi
      JOIN item i ON dt.id_item = i.id_item
      JOIN satuan s ON i.id_satuan = s.id_satuan
      WHERE MONTH(tp.time_stamp) = MONTH(CURRENT_DATE()) AND YEAR(tp.time_stamp) = YEAR(CURRENT_DATE())
      GROUP BY i.nama, s.nama
      ORDER BY Jumlah_Item_Terjual DESC
      LIMIT 10;
    `;

    const getData = await handlerQuery({ query });
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

Dashboard.getLayout = function getLayout(page) {
  return <Layout clicked="Dashboard">{page}</Layout>;
};
