import Layout from "../../../components/Layout";
import Head from "next/head";
import moment from "moment"; // Import library moment untuk manajemen tanggal
import React, { useState, useEffect } from "react";

export default function Dashboard() {
  // Tanggal hari ini dalam format tertentu
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
              <tr>
                <td>1</td>
                <td>Item 1</td>
                <td>50</td>
                <td>pcs</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Item 2</td>
                <td>45</td>
                <td>pcs</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Item 3</td>
                <td>40</td>
                <td>pcs</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Item 4</td>
                <td>35</td>
                <td>pcs</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Item 5</td>
                <td>30</td>
                <td>pcs</td>
              </tr>
              <tr>
                <td>6</td>
                <td>Item 6</td>
                <td>25</td>
                <td>pcs</td>
              </tr>
              <tr>
                <td>7</td>
                <td>Item 7</td>
                <td>20</td>
                <td>pcs</td>
              </tr>
              <tr>
                <td>8</td>
                <td>Item 8</td>
                <td>15</td>
                <td>pcs</td>
              </tr>
              <tr>
                <td>9</td>
                <td>Item 9</td>
                <td>10</td>
                <td>pcs</td>
              </tr>
              <tr>
                <td>10</td>
                <td>Item 10</td>
                <td>5</td>
                <td>pcs</td>
              </tr>
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

Dashboard.getLayout = function getLayout(page) {
  return <Layout clicked="Dashboard">{page}</Layout>;
};
