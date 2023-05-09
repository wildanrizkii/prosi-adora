import handlerQuery from "../../../lib/db";
import { sha256 } from "js-sha256";
export default async function handler(req, res) {
  const { x, y } = req.body;
  const query = "select password,salt from user where username=?";
  const obj = {
    query: query,
    values: [x],
  };
  try {
    const hasil = await handlerQuery(obj);
    if (hasil.length === 1) {
      const salt = hasil[0].salt;
      const password = hasil[0].password;
      const tryHash = sha256(salt + y);
      if (tryHash === password) {
        res.status(200).send("Berhasil Login");
      } else {
        res.status(200).send("Maaf Username atau Password anda salah");
      }
    } else {
      res.status(200).send("Maaf Username atau Password anda salah");
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
}
