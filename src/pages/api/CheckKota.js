import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sendNamaKota, tujuan, tipe } = req.body;
    console.log("");
    console.log(sendNamaKota);
    console.log(tujuan);
    console.log(tipe);
    if (tujuan === "add") {
      const query = "select nama_kota from kota where nama_kota=? and tipe=?";
      const values = [sendNamaKota, tipe];

      try {
        const hasil = await handlerQuery({ query, values });
        if (hasil.length === 0) {
          res.status(200).send("BISA");
        } else {
          res.status(200).send("TIDAK BISA");
        }
      } catch (e) {
        res.status(500).send(e.message);
      }
    } else if (tujuan === "edit") {
      const { id } = req.body;
      const query =
        "select nama_kota from kota where nama_kota=? and tipe=? and id_kota!=?";
      const values = [sendNamaKota, tipe, id];
      try {
        const hasil = await handlerQuery({ query, values });
        if (hasil.length === 0) {
          res.status(200).send("BISA");
        } else {
          res.status(200).send("TIDAK BISA");
        }
      } catch (e) {
        res.status(500).send(e.message);
      }
    }
  }
}
