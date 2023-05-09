import handlerQuery from "../../../lib/db";

export default async function handler(req, res) {
  const { sendUsername } = req.body;
  const query = "select username from user where username=?";
  const values = [sendUsername];

  try {
    const hasil = await handlerQuery({ query, values });
    if (hasil.length === 0) {
      res.status(200).send("available");
    } else {
      res.status(200).send("not available");
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
}
