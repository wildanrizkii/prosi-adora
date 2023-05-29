import Layout from "../../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../../lib/db";
import Link from "next/link";
import {
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
} from "../../../../components/TambahJenisComp";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
export default function JenisItem({ hasil }) {
  let semuaAkun;
  const [isUpdateStatusSuccess, setUpdateStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  async function changeStatus(id, toActive) {
    try {
      if (toActive === true) {
        await axios.patch("/api/UpdateStatusJenis", { id, status: 1 });
      } else if (toActive === false) {
        await axios.patch("/api/UpdateStatusJenis", { id, status: 0 });
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
          key={x.id_jenis}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 && "red",
            color: x.status === 0 && "white",
          }}
        >
          <td>{index + 1}</td>
          <td>{x.nama}</td>
          <td>{x.status === 1 ? "Aktif" : "Non-Aktif"}</td>
          <td>
            <Link
              href={`JenisItem/Edit/${x.id_jenis}`}
              className="button is-success is-small"
            >
              Edit
            </Link>
            {x.status === 1 ? (
              <button
                className="button is-danger is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_jenis, false)}
              >
                Non-Aktifkan
              </button>
            ) : (
              <button
                className="button is-primary is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_jenis, true)}
              >
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
        <title>Jenis Item</title>
      </Head>
      <h1 className="title">Jenis Item</h1>

      <Link
        className="button is-link"
        href="JenisItem/TambahJenis"
        style={{ marginBottom: "10px" }}
      >
        Tambah
      </Link>

      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
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
                router.push("/Produk/JenisItem");
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
                router.push("/Produk/JenisItem");
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
  const query = "select nama,id_jenis,status from jenis";
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

JenisItem.getLayout = function getLayout(page) {
  return <Layout clicked="Jenis Item">{page}</Layout>;
};
