import Layout from "../../../../components/Layout";
import Head from "next/head";
import axios from "axios";
import { useState } from "react";
import "dayjs/locale/id";
import { DatePicker } from "antd";
import { setHeaderForLaporan } from "../../../../components/AllComponent";
import "jspdf-autotable";
const { RangePicker } = DatePicker;
export default function LaporanPembelian() {
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
      `/api/DataLapPembelian?Awal=${Awal}&Akhir=${Akhir}`
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

    let rowSpanNoFaktur = 1;
    i = 0;

    while (i < hasil.length - 1) {
      rowSpanNoFaktur = 1;
      for (let j = i + 1; j < hasil.length; j++) {
        if (hasil[i].no_faktur === hasil[j].no_faktur) {
          rowSpanNoFaktur = rowSpanNoFaktur + 1;
        }

        if (hasil[i].no_faktur !== hasil[j].no_faktur) {
          break;
        }
      }
      if (rowSpanNoFaktur !== 1) {
        hasil[i].no_faktur = {
          content: hasil[i].no_faktur,
          rowSpan: rowSpanNoFaktur,
        };
        hasil[i].kode_supplier = {
          content: hasil[i].kode_supplier,
          rowSpan: rowSpanNoFaktur,
        };
        hasil[i].total = {
          content: hasil[i].total,
          rowSpan: rowSpanNoFaktur,
        };
      }
      i = i + rowSpanNoFaktur;
    }

    const doc = setHeaderForLaporan("l");

    const width = doc.internal.pageSize.getWidth();
    doc.setFont("times", "normal");
    doc.setFontSize(15);
    doc.text("Laporan Pembelian", width / 2, 110, { align: "center" });
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
        { header: "No Faktur", dataKey: "no_faktur" },
        { header: "Kode Supplier", dataKey: "kode_supplier" },
        { header: "Nama Item", dataKey: "nama_item" },
        { header: "Jumlah", dataKey: "jumlah" },
        { header: "Harga Per Satuan", dataKey: "harga_per_satuan" },
        { header: "Subtotal", dataKey: "subtotal" },
        { header: "Total", dataKey: "total" },
      ],
      margin: { top: 150 },
      body: hasil,
      columnStyles: {
        tanggal: { halign: "center", valign: "middle" },
        no_faktur: { halign: "center", valign: "middle" },
        kode_supplier: { halign: "center", valign: "middle" },
        nama_item: { halign: "center", valign: "middle" },
        jumlah: { halign: "center", valign: "middle" },
        harga_per_satuan: { halign: "center", valign: "middle" },
        subtotal: { halign: "center", valign: "middle" },
        total: { halign: "center", valign: "middle" },
      },
      headStyles: { halign: "center", valign: "middle" },
      theme: "grid",
    });

    let y = doc.lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.text(`JUMLAH ITEM\t:\t${jumlah[0].jumlah || 0} `, 30, (y += 20));
    doc.text(`TOTAL AKHIR\t:\t${total[0].total} `, 30, (y += 20));

    doc.output("dataurlnewwindow", { filename: "Laporan Pembelian" });
  };
  const onChangeDate = (date, dateString) => {
    setFilterTanggal(date);
  };
  return (
    <>
      <Head>
        <title>Laporan Pembelian</title>
      </Head>
      <h1 className="title">Laporan Pembelian</h1>

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

LaporanPembelian.getLayout = function getLayout(page) {
  return <Layout clicked="Laporan Pembelian">{page}</Layout>;
};
