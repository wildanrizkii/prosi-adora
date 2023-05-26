import { getSession } from "../../../lib/get-sessions";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, role, idUser } = req.body;
    const session = await getSession(req, res);
    session.username = username;
    session.role = role;
    session.idUser = idUser;
    res.send("OK");
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
