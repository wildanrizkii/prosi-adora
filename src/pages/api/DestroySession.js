import { getSession } from "../../../lib/get-sessions";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const session = await getSession(req, res);
    await session.destroy();
    res.send("Berhasil");
  }
}
