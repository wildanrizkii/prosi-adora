import handlerQuery from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { namaSupplier, kode, alamat, noHP, status } = req.body;
    const query = "INSERT INTO supplier(nama_supplier, kode_supplier, alamat, no_hp, status) VALUES(?,?,?,?,1)";
    const values = [namaSupplier, kode, alamat, noHP, status];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil menambahkan Supplier");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
