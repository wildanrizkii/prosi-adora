import handlerQuery from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { Nama, Stok_Minimum, Rak, Satuan, Jenis } = req.body;
    const query =
      "INSERT INTO item(nama,stok,stok_min,status,id_rak,id_satuan,id_jenis_item) VALUES(?,0,?,1,?,?,?)";
    const values = [Nama, Stok_Minimum, Rak, Satuan, Jenis];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("BERHASIL MENAMBAHKAN ITEM");
    } catch (e) {
      res.status(500).send("GAGAL MENAMBAHKAN ITEM");
    }
  }
}
