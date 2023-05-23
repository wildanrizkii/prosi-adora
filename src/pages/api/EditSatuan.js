import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { namaSatuan, kode, id } = req.body;
    const query = "UPDATE satuan set nama=?, kode=? where id_satuan=?";
    const values = [namaSatuan, kode, id];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil mengupdate satuan");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
