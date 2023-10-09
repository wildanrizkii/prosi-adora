import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { itemId, quantity } = req.body;

    if (itemId && quantity !== undefined) {
      const query = "UPDATE item SET stok = stok - ? WHERE id_item = ?";

      const values = [quantity, itemId];

      try {
        const hasil = await handlerQuery({ query, values });
        res.status(200).send("BERHASIL MEMBAYAR");
      } catch (e) {
        res.status(500).send("GAGAL MEMBAYAR");
      }
    }
  }
}
