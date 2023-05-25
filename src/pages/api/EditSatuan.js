import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { namaSatuan, id } = req.body;
    const query = "UPDATE satuan set nama=? where id_satuan=?";
    const values = [namaSatuan, id];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil mengupdate satuan");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
