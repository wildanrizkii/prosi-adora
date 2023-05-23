import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { namaKota, kode, id } = req.body;
    const query = "UPDATE kota set nama_kota=?, kode_kota=? where id_kota=?";
    const values = [namaKota, kode, id];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil mengupdate Kota");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
