import { getSession } from "../../../lib/get-sessions";

export default async function handler(req, res) {
  if (req.method === "GET") {
    res.send(["aaaaa", "bbbbbb"]);
  }
}
