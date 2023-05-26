import { getSession } from "../../../lib/get-sessions";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const session = await getSession(req, res);
    const hasil = [session.username, session.role, session.idUser];
    res.send(hasil);
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
