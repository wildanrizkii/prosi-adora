import { rupiah } from "../../../components/AllComponent";
import handlerQuery from "../../../lib/db";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const query = req.query;
    const { Awal, Akhir } = query;
    let queryUtama;
    let queryJumlah;
    let queryTotal;
    let values;

    if (Awal !== "" && Akhir !== "") {
      queryUtama =
        "SELECT tanggal,transaksi_penjualan.no_transaksi,item.nama as nama_item,jumlah,harga_per_satuan,subtotal,total,biaya_racik,diskon " +
        "FROM detail_transaksi_penjualan inner join transaksi_penjualan on detail_transaksi_penjualan.no_transaksi=transaksi_penjualan.no_transaksi " +
        "inner join item on item.id_item =detail_transaksi_penjualan.id_item " +
        "where tanggal between ? and ? " +
        "order by tanggal,detail_transaksi_penjualan.no_transaksi";
      queryJumlah =
        "SELECT sum(jumlah) as jumlah " +
        "FROM detail_transaksi_penjualan inner join transaksi_penjualan on detail_transaksi_penjualan.no_transaksi=transaksi_penjualan.no_transaksi " +
        "where tanggal between ? and ?";
      queryTotal =
        "SELECT sum(total) as total " +
        "FROM transaksi_penjualan " +
        "where tanggal between ? and ? ";
      values = [Awal, Akhir];
    } else {
      queryUtama =
        "SELECT tanggal,transaksi_penjualan.no_transaksi,item.nama as nama_item,jumlah,harga_per_satuan,subtotal,total,biaya_racik,diskon " +
        "FROM detail_transaksi_penjualan inner join transaksi_penjualan on detail_transaksi_penjualan.no_transaksi=transaksi_penjualan.no_transaksi " +
        "inner join item on item.id_item =detail_transaksi_penjualan.id_item " +
        "order by tanggal,detail_transaksi_penjualan.no_transaksi";
      queryJumlah =
        "SELECT sum(jumlah) as jumlah " + "FROM detail_transaksi_penjualan";
      queryTotal = "SELECT sum(total) as total " + "FROM transaksi_penjualan";
      values = [];
    }
    try {
      const hasil = await handlerQuery({ query: queryUtama, values });
      const jumlah = await handlerQuery({ query: queryJumlah, values });
      const total = await handlerQuery({ query: queryTotal, values });
      for (let i = 0; i < hasil.length; i++) {
        hasil[i].harga_per_satuan = rupiah.format(hasil[i].harga_per_satuan);
        hasil[i].subtotal = rupiah.format(hasil[i].subtotal);
        hasil[i].total = rupiah.format(hasil[i].total);
        hasil[i].biaya_racik = rupiah.format(hasil[i].biaya_racik);
        hasil[i].tanggal = dayjs(hasil[i].tanggal).format("DD-MM-YYYY");
      }
      total[0].total = rupiah.format(total[0].total);

      res.status(200).send({ hasil, jumlah, total });
    } catch (e) {
      res.status(500).send("GAGAL MENDAPATKAN DATA");
    }
  }
}
