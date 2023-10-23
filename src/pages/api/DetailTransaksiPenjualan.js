import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const transactions = req.body; // Menerima array objek transaksi

      const query = `
        INSERT INTO detail_transaksi_penjualan (no_transaksi, id_item, jumlah, jenis_pelanggan, subtotal, harga_per_satuan, no_detail_penjualan)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      for (const transaction of transactions) {
        const {
          transactionNumber,
          IdItem,
          quantity_detail,
          customer_type,
          subtotal,
          unit_price,
          detailTransactionNumber,
        } = transaction;

        const values = [
          transactionNumber,
          IdItem,
          quantity_detail,
          customer_type,
          subtotal,
          unit_price,
          detailTransactionNumber,
        ];

        await handlerQuery({ query, values });
      }

      res.status(200).send("Detail Transaction data inserted successfully");
    } catch (error) {
      console.error("Failed to insert transaction data:", error);
      res.status(500).send("Failed to insert transaction data");
    }
  }
}
