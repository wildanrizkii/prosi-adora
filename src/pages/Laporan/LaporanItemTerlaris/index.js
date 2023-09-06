import "jspdf-autotable";
import Layout from "../../../../components/Layout";
import Head from "next/head";
import axios from "axios";

import { useState } from "react";

import "dayjs/locale/id";
import { DatePicker } from "antd";

import { setHeaderForLaporan } from "../../../../components/AllComponent";
const { RangePicker } = DatePicker;
export default function LaporanItemTerlaris() {
  const [filterTanggal, setFilterTanggal] = useState(null);
  const generatePDF = async (tanggal) => {
    let Awal;
    let Akhir;
    if (tanggal !== null) {
      Awal = tanggal[0].format("YYYY-MM-DD");
      Akhir = tanggal[1].format("YYYY-MM-DD");
    } else {
      Awal = "";
      Akhir = "";
    }
    const res = await axios.get(
      `/api/DataLapItemTerlaris?Awal=${Awal}&Akhir=${Akhir}`
    );

    const hasil = res.data;
    const doc = setHeaderForLaporan();

    const width = doc.internal.pageSize.getWidth();
    doc.setFont("times", "normal");
    doc.setFontSize(15);
    doc.text("Laporan Item Terlaris", width / 2, 110, { align: "center" });
    doc.text(
      tanggal === null
        ? "Keseluruhan"
        : `Periode ${tanggal[0].format(
            "DD-MM-YYYY"
          )} sampai ${tanggal[1].format("DD-MM-YYYY")}
          `,
      width / 2,
      130,
      { align: "center" }
    );

    doc.autoTable({
      columns: [
        { header: "Nama Item", dataKey: "nama_item" },
        { header: "Jumlah Terjual", dataKey: "jumlah_terjual" },
        { header: "Satuan", dataKey: "nama_satuan" },
        { header: "Jenis", dataKey: "nama_jenis" },
      ],
      margin: { top: 150 },
      body: hasil,
      columnStyles: {
        nama_item: { halign: "center", valign: "middle" },
        nama_satuan: { halign: "center", valign: "middle" },
        nama_jenis: { halign: "center", valign: "middle" },
        jumlah_terjual: { halign: "center", valign: "middle" },
      },
      headStyles: { halign: "center", valign: "middle" },
    });
    doc.output("dataurlnewwindow", { filename: "Laporan Item Terlaris" });
  };

  const onChangeDate = (date, dateString) => {
    setFilterTanggal(date);
  };

  return (
    <>
      <Head>
        <title>Laporan Item Terlaris</title>
      </Head>
      <h1 className="title">Laporan Item Terlaris</h1>

      <div className="field">
        <label className="label">Periode</label>
        <RangePicker
          onChange={onChangeDate}
          size="large"
          format="DD-MM-YYYY"
          value={filterTanggal}
        />
      </div>
      <button
        className="button is-primary"
        onClick={() => generatePDF(filterTanggal)}
      >
        Download
      </button>
    </>
  );
}

LaporanItemTerlaris.getLayout = function getLayout(page) {
  return <Layout clicked="Laporan Item Terlaris">{page}</Layout>;
};
