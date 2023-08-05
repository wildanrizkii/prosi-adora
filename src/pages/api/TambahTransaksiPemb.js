import handlerQuery from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { faktur, idUser, supplier, sendDetail } = req.body;
    const query1 =
      "INSERT INTO transaksi_pembelian(no_faktur,tanggal,idUser,id_supplier,total) VALUES(?,?,?,?,?)";

    const tangal = new Date();
    const tahun = tangal.getFullYear();
    const bulan = parseInt(tangal.getMonth()) + 1;
    const hari = tangal.getDate();
    const masukanTanggal = tahun + "-" + bulan + "-" + hari;
    let total = 0;
    for (let i = 0; i < sendDetail.length; i++) {
      total = total + parseInt(sendDetail[i].Subtotal);
    }
    const values1 = [faktur, masukanTanggal, idUser, supplier, total];
    const query2 =
      "INSERT INTO detail_transaksi_pembelian(no_faktur,id_item,jumlah,subtotal,harga_per_satuan,margin) VALUES(?,?,?,?,?,?)";
    try {
      await handlerQuery({ query: query1, values: values1 });
      for (let i = 0; i < sendDetail.length; i++) {
        await handlerQuery({
          query: query2,
          values: [
            faktur,
            sendDetail[i].Kode,
            sendDetail[i].Jumlah_Item,
            sendDetail[i].Subtotal,
            sendDetail[i].Harga_Beli,
            sendDetail[i].Margin,
          ],
        });
      }

      res.status(200).send("BERHASIL MENAMBAHKAN TRANSAKSI PEMBELIAN");
    } catch (e) {
      res.status(500).send("GAGAL MENAMBAHKAN TRANSAKSI PEMBELIAN");
    }
  }
}
