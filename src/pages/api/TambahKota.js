import handlerQuery from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { namaKota, kode, status } = req.body;
    const query = "INSERT INTO kota(nama_kota,kode_kota,status) VALUES(?,?,1)";
    const values = [namaKota, kode, status];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil menambahkan Kota");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
