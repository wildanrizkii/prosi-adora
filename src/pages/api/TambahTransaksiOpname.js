import handlerQuery from "../../../lib/db";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { No_Opname, Id_User, detail } = req.body;
    const query1 =
      "INSERT INTO transaksi_stok_opname(no_opname,idUser) VALUES(?,?)";

    const values1 = [No_Opname, Id_User];

    const query2 =
      "INSERT INTO detail_transaksi_stok_opname(no_opname,stok_fisik,stok_sistem,selisih,id_item) VALUES(?,?,?,?,?)";

    try {
      await handlerQuery({ query: query1, values: values1 });
      for (let i = 0; i < detail.length; i++) {
        await handlerQuery({
          query: query2,
          values: [
            No_Opname,
            detail[i].Stok_Fisik,
            detail[i].stok,
            detail[i].Selisih,
            detail[i].id_item,
          ],
        });
      }
      res.status(200).send("BERHASIL MENAMBAHKAN TRANSAKSI STOK OPNAME");
    } catch (e) {
      res.status(500).send("GAGAL MENAMBAHKAN TRANSAKSI STOK OPNAME");
    }
  }
}
