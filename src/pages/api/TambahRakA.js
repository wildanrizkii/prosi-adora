import handlerQuery from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { namaRak, status } = req.body;
    const query = "INSERT INTO rak(nama_rak,status) VALUES(?,1)";
    const values = [namaRak, status];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil menambahkan rak");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
