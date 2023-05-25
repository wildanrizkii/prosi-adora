import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { namaJenis, id } = req.body;
    const query = "UPDATE jenis set nama=? where id_jenis=?";
    const values = [namaJenis, id];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil mengupdate jenis");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
