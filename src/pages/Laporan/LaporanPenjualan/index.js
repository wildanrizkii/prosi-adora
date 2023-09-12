import Layout from "../../../../components/Layout";
import Head from "next/head";
import axios from "axios";
import { useState } from "react";
import "dayjs/locale/id";
import { DatePicker } from "antd";
import { setHeaderForLaporan } from "../../../../components/AllComponent";
import "jspdf-autotable";
const { RangePicker } = DatePicker;
export default function LaporanPenjualan() {
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
      `/api/DataLapPenjualan?Awal=${Awal}&Akhir=${Akhir}`
    );

    const { hasil, jumlah, total } = res.data;

    let rowSpanTanggal = 1;

    let i = 0;
    while (i < hasil.length - 1) {
      rowSpanTanggal = 1;
      for (let j = i + 1; j < hasil.length; j++) {
        if (hasil[i].tanggal === hasil[j].tanggal) {
          rowSpanTanggal = rowSpanTanggal + 1;
        }

        if (hasil[i].tanggal !== hasil[j].tanggal) {
          break;
        }
      }
      if (rowSpanTanggal !== 1) {
        hasil[i].tanggal = {
          content: hasil[i].tanggal,
          rowSpan: rowSpanTanggal,
        };
      }
      i = i + rowSpanTanggal;
    }

    let rowSpanNoTransaksi = 1;
    i = 0;

    while (i < hasil.length - 1) {
      rowSpanNoTransaksi = 1;
      for (let j = i + 1; j < hasil.length; j++) {
        if (hasil[i].no_transaksi === hasil[j].no_transaksi) {
          rowSpanNoTransaksi = rowSpanNoTransaksi + 1;
        }

        if (hasil[i].no_transaksi !== hasil[j].no_transaksi) {
          break;
        }
      }
      if (rowSpanNoTransaksi !== 1) {
        hasil[i].no_transaksi = {
          content: hasil[i].no_transaksi,
          rowSpan: rowSpanNoTransaksi,
        };
        hasil[i].biaya_racik = {
          content: hasil[i].biaya_racik,
          rowSpan: rowSpanNoTransaksi,
        };
        hasil[i].diskon = {
          content: hasil[i].diskon,
          rowSpan: rowSpanNoTransaksi,
        };
        hasil[i].total = {
          content: hasil[i].total,
          rowSpan: rowSpanNoTransaksi,
        };
      }
      i = i + rowSpanNoTransaksi;
    }

    const doc = setHeaderForLaporan("l");

    const width = doc.internal.pageSize.getWidth();
    doc.setFont("times", "normal");
    doc.setFontSize(15);
    doc.text("Laporan Penjualan", width / 2, 110, { align: "center" });
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
        { header: "Tanggal", dataKey: "tanggal" },
        { header: "No Transaksi", dataKey: "no_transaksi" },
        { header: "Nama Item", dataKey: "nama_item" },
        { header: "Jumlah", dataKey: "jumlah" },
        { header: "Harga Per Satuan", dataKey: "harga_per_satuan" },
        { header: "Subtotal", dataKey: "subtotal" },
        { header: "Biaya Racik", dataKey: "biaya_racik" },
        { header: "Diskon", dataKey: "diskon" },
        { header: "Total", dataKey: "total" },
      ],
      margin: { top: 150 },
      body: hasil,
      columnStyles: {
        tanggal: { halign: "center", valign: "middle" },
        no_transaksi: { halign: "center", valign: "middle" },
        nama_item: { halign: "center", valign: "middle" },
        jumlah: { halign: "center", valign: "middle" },
        harga_per_satuan: { halign: "center", valign: "middle" },
        subtotal: { halign: "center", valign: "middle" },
        total: { halign: "center", valign: "middle" },
        biaya_racik: { halign: "center", valign: "middle" },
        diskon: { halign: "center", valign: "middle" },
      },
      headStyles: { halign: "center", valign: "middle" },
      theme: "grid",
    });

    let y = doc.lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.text(`JUMLAH ITEM\t:\t${jumlah[0].jumlah || 0} `, 30, (y += 20));
    doc.text(`TOTAL AKHIR\t:\t${total[0].total} `, 30, (y += 20));

    doc.output("dataurlnewwindow", { filename: "Laporan Penjualan" });
  };
  const onChangeDate = (date, dateString) => {
    setFilterTanggal(date);
  };
  return (
    <>
      <Head>
        <title>Laporan Penjualan</title>
      </Head>
      <h1 className="title">Laporan Penjualan</h1>
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

LaporanPenjualan.getLayout = function getLayout(page) {
  return <Layout clicked="Laporan Penjualan">{page}</Layout>;
};
