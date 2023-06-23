import handlerQuery from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { namaKota, tipe } = req.body;
    const query = "INSERT INTO kota(nama_kota,tipe,status) VALUES(?,?,1)";
    const values = [namaKota, tipe];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil menambahkan Kota");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
