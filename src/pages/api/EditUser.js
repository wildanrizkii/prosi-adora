import handlerQuery from "../../../lib/db";
import { v4 as uuidv4 } from "uuid";
import { sha256 } from "js-sha256";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { username, role, password, id } = req.body;
    if (password !== "") {
      console.log("password tidak kosong");
      const salt = uuidv4();
      const hashedPass = sha256(salt + password);
      const query =
        "UPDATE user SET username=?,password=?,salt=?,role=? where idUser=?";
      const values = [username, hashedPass, salt, role, id];
      try {
        const hasil = await handlerQuery({ query, values });
        res.status(200).send("Berhasil mengupdate User");
      } catch (e) {
        res.status(500).send(e.message);
      }
    } else if (password === "") {
      console.log("password kosong");
      const query = "UPDATE user set username=?,role=? where idUser=?";
      const values = [username, role, id];
      try {
        const hasil = await handlerQuery({ query, values });
        res.status(200).send("Berhasil mengupdate User");
      } catch (e) {
        res.status(500).send(e.message);
      }
    }
  }
}
