import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { namaSupplier, kode, id } = req.body;
    const query = "UPDATE supplier set nama_supplier=?, kode_supplier=? where id_supplier=?";
    const values = [namaSupplier, kode, id];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil mengupdate Supplier");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
