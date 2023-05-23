import Layout from "../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../lib/db";
import Link from "next/link";
import { Modal, IsiModalSuccess, IsiModalFailed } from "../../../components/TambahKotaComp";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
export default function Kota({ hasil }) {
  let semuaAkun;
  const [isUpdateStatusSuccess, setUpdateStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  async function changeStatus(id, toActive) {
    try {
      if (toActive === true) {
        await axios.patch("/api/UpdateStatusKota", { id, status: 1 });
      } else if (toActive === false) {
        await axios.patch("/api/UpdateStatusKota", { id, status: 0 });
      }
      setUpdateStatus(true);
    } catch (e) {
      setUpdateStatus(false);
    } finally {
      setShowModal(true);
    }
  }

  try {
    semuaAkun = hasil.map((x, index) => {
      return (
        <tr
          key={x.id_kota}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 && "red",
            color: x.status === 0 && "white",
          }}
        >
          <td>{index + 1}</td>
          <td>{x.nama_kota}</td>
          <td>{x.kode_kota}</td>
          <td>{x.status === 1 ? "Aktif" : "Non-Aktif"}</td>
          <td>
            <Link href={`Kota/Edit/${x.id_kota}`} className="button is-success is-small">
              Edit
            </Link>
            {x.status === 1 ? (
              <button className="button is-danger is-small" style={{ marginLeft: "5px" }} onClick={() => changeStatus(x.id_kota, false)}>
                Non-Aktifkan
              </button>
            ) : (
              <button className="button is-primary is-small" style={{ marginLeft: "5px" }} onClick={() => changeStatus(x.id_kota, true)}>
                Aktifkan
              </button>
            )}
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
        <title>Kota</title>
      </Head>
      <h1 className="title">Kota</h1>

      <Link className="button is-link" href="Kota/TambahKota" style={{ marginBottom: "10px" }}>
        Tambah
      </Link>

      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Kode</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>{semuaAkun}</tbody>
      </table>
      <Modal className={showModal === true && "is-active"}>
        {isUpdateStatusSuccess === true ? (
          <IsiModalSuccess pesan="Berhasil Mengubah Status">
            <button
              className="button is-primary"
              onClick={() => {
                setShowModal(false);
                router.push("/Kota");
              }}
            >
              OK
            </button>
          </IsiModalSuccess>
        ) : (
          <IsiModalFailed pesan="Gagal mengubah status">
            <button
              className="button is-danger"
              onClick={() => {
                setShowModal(false);
                router.push("/Kota");
              }}
            >
              OK
            </button>
          </IsiModalFailed>
        )}
      </Modal>
    </>
  );
}

export async function getServerSideProps() {
  const query = "select nama_kota,kode_kota,id_kota,status from kota";
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

Kota.getLayout = function getLayout(page) {
  return <Layout clicked="Kota">{page}</Layout>;
};
