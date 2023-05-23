import handlerQuery from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { namaJenis, kode, status } = req.body;
    const query = "INSERT INTO jenis(nama,kode,status) VALUES(?,?,1)";
    const values = [namaJenis, kode, status];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil menambahkan jenis item");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
