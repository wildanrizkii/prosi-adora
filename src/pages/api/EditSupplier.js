import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { nama_supplier, kode_supplier, alamat, no_hp, id } = req.body;
    const query = "UPDATE supplier set nama_supplier=?, kode_supplier=?, alamat=?, no_hp=? where id_supplier=?";
    const values = [nama_supplier, kode_supplier, alamat, no_hp, id];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil mengupdate Data Supplier");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
