import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const today = new Date().toDateString(); // Mengambil tanggal hari ini

      const query = `
        SELECT
          SUM(CASE WHEN jenis_transaksi = 'umum' THEN total ELSE 0 END) as total_umum,
          SUM(CASE WHEN jenis_transaksi = 'resep' THEN total ELSE 0 END) as total_resep
        FROM detail_transaksi_penjualan
        WHERE DATE(time_stamp) = ?;
      `;

      const values = [today];
      const result = await handlerQuery({ query, values });

      if (result && result.length > 0) {
        const totalUmum = result[0].total_umum || 0;
        const totalResep = result[0].total_resep || 0;
        res.status(200).json({ totalUmum, totalResep });
      } else {
        res.status(200).json({ totalUmum: 0, totalResep: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch total transaksi hari ini:", error);
      res.status(500).send("Failed to fetch total transaksi hari ini");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
