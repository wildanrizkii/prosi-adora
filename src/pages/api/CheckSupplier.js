// import handlerQuery from "../../../lib/db";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { sendNamaSupplier, tujuan } = req.body;
//     if (tujuan === "add") {
//       const query = "select nama_supplier from supplier where nama_supplier=?";
//       const values = [sendNamaSupplier];

//       try {
//         const hasil = await handlerQuery({ query, values });
//         if (hasil.length === 0) {
//           res.status(200).send("available");
//         } else {
//           res.status(200).send("not available");
//         }
//       } catch (e) {
//         res.status(500).send(e.message);
//       }
//     } else if (tujuan === "edit") {
//       const { id } = req.body;
//       const query = "select nama_supplier from supplier where nama_supplier=? and id_supplier!=?";
//       const values = [sendNamaSupplier, id];
//       try {
//         const hasil = await handlerQuery({ query, values });
//         if (hasil.length === 0) {
//           res.status(200).send("available");
//         } else {
//           res.status(200).send("not available");
//         }
//       } catch (e) {
//         res.status(500).send(e.message);
//       }
//     }
//   }
// }
