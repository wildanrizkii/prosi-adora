import handlerQuery from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { namaSupplier, kodeSupplier, alamatSupplier, nomorSupplier, status } = req.body;
    const query = "INSERT INTO supplier(nama_supplier, kode_supplier, alamat, no_hp, id_kota, status) VALUES(?,?,?,?,21,1)";
    const values = [namaSupplier, kodeSupplier, alamatSupplier, nomorSupplier, status];

    try {
      const hasil = await handlerQuery({ query, values });
      res.status(200).send("Berhasil menambahkan Supplier");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
