import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { nama_supplier, kode_supplier, id } = req.body;
    const query = "UPDATE supplier set nama_supplier=?, kode_supplier=? where id_supplier=?";
    const values = [nama_supplier, kode_supplier, id];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil mengupdate Data Supplier");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
