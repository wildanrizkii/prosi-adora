import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { Nama, Stok, Stok_Minimum, Rak, Satuan, Jenis, IdItem } = req.body;
    const query =
      "UPDATE item set nama=?, stok=?, stok_min=?, id_rak=?, id_satuan=?,id_jenis_item=? where id_item=?";

    const values = [Nama, Stok, Stok_Minimum, Rak, Satuan, Jenis, IdItem];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil mengupdate Item");
    } catch (e) {
      res.status(500).send("Gagal Mengupdate Item");
    }
  }
}
