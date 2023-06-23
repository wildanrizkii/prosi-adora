import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { namaKota, id, tipe } = req.body;
    console.log("");
    console.log("PATCH");
    console.log(namaKota);
    console.log(id);
    console.log(tipe);
    const query = "UPDATE kota set nama_kota=?,tipe=? where id_kota=?";
    const values = [namaKota, tipe, id];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil mengupdate Kota");
    } catch (e) {
      res.status(500).send("Gagal mengupdate Kota");
    }
  }
}
