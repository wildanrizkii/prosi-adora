import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const query = `
        SELECT
            jenis_pelanggan,
            SUM(1) AS total_transaksi,
            SUM(subtotal) AS total_omset
        FROM
            transaksi_penjualan tp
        JOIN
            detail_transaksi_penjualan dt ON tp.no_transaksi = dt.no_transaksi
        WHERE
            DATE(tp.time_stamp) = CURDATE()
        GROUP BY
            jenis_pelanggan;
      `;

      const result = await handlerQuery({ query });

      if (result && result.length > 0) {
        const totalUmum = result.find((row) => row.jenis_pelanggan === "umum");
        const totalKeras = result.find(
          (row) => row.jenis_pelanggan === "keras"
        );
        res.status(200).json({
          totalUmum: totalUmum ? totalUmum.total_transaksi : 0,
          totalOmsetUmum: totalUmum ? totalUmum.total_omset : 0,
          totalKeras: totalKeras ? totalKeras.total_transaksi : 0,
          totalOmsetKeras: totalKeras ? totalKeras.total_omset : 0,
        });
      } else {
        res.status(200).json({
          totalUmum: 0,
          totalOmsetUmum: 0,
          totalKeras: 0,
          totalOmsetKeras: 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch total transactions:", error);
      res.status(500).send("Failed to fetch total transactions");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
