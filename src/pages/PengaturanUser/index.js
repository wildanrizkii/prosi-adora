import Layout from "../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../lib/db";
import Link from "next/link";
export default function PengaturanUser({ hasil }) {
  let semuaAkun;
  try {
    semuaAkun = hasil.map((x, index) => {
      return (
        <tr key={x.idUser}>
          <td>{index + 1}</td>
          <td>{x.username}</td>
          <td>{x.role}</td>
          <td>
            <button className="button is-primary is-small">Edit</button>
            <button className="button is-danger is-small">Hapus</button>{" "}
          </td>
        </tr>
      );
    });
  } catch (e) {
    semuaAkun = (
      <tr>
        <td colSpan="4">{hasil}</td>
      </tr>
    );
  }

  return (
    <>
      <Head>
        <title>Pengaturan User</title>
      </Head>
      <h1 className="title">Pengaturan User</h1>
      <button className="button" style={{ marginBottom: "5px" }}>
        <Link href="PengaturanUser/Tambah">Tambah</Link>
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Akses</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>{semuaAkun}</tbody>
      </table>
    </>
  );
}

export async function getServerSideProps() {
  const query = "select username,role,idUser from user";
  const values = [];
  try {
    const getData = await handlerQuery({ query, values });
    const hasil = JSON.parse(JSON.stringify(getData));

    return {
      props: {
        hasil,
      },
    };
  } catch (e) {
    return {
      props: {
        hasil: e.message,
      },
    };
  }
}

PengaturanUser.getLayout = function getLayout(page) {
  return <Layout clicked="Pengaturan User">{page}</Layout>;
};
