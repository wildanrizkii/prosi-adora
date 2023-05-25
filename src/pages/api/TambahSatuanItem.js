import handlerQuery from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { namaSatuan, status } = req.body;
    const query = "INSERT INTO satuan(nama,status) VALUES(?,1)";
    const values = [namaSatuan, status];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil menambahkan satuan item");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
