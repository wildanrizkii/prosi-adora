import Layout from "../../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../../lib/db";
import Link from "next/link";

import {
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
} from "../../../../components/AllComponent";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
export default function SatuanItem({ hasil }) {
  let semuaAkun;

  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });

  const router = useRouter();
  async function changeStatus(id, toActive) {
    try {
      let res;
      if (toActive === true) {
        res = await axios.patch("/api/UpdateStatusSatuan", { id, status: 1 });
      } else if (toActive === false) {
        res = await axios.patch("/api/UpdateStatusSatuan", { id, status: 0 });
      }
      setModal({ pesan: res.data, isSuccess: true, isModalClosed: false });
    } catch (e) {
      setModal({
        pesan: e.response.data,
        isSuccess: false,
        isModalClosed: false,
      });
    }
  }

  try {
    semuaAkun = hasil.map((x, index) => {
      return (
        <tr
          key={x.id_satuan}
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
              href={`SatuanItem/Edit/${x.id_satuan}`}
              className="button is-success is-small"
            >
              Edit
            </Link>
            {x.status === 1 ? (
              <button
                className="button is-danger is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_satuan, false)}
              >
                Non-Aktifkan
              </button>
            ) : (
              <button
                className="button is-primary is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_satuan, true)}
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
        <title>Satuan Item</title>
      </Head>
      <h1 className="title">Satuan Item</h1>

      <Link
        className="button is-link"
        href="SatuanItem/TambahSatuan"
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
      <Modal show={modal.isModalClosed === false && "is-active"}>
        {modal.isSuccess === true ? (
          <IsiModalSuccess pesan={modal.pesan}>
            <button
              className="button is-success"
              onClick={() => {
                setModal({ ...modal, isModalClosed: true });
                router.push("/Produk/SatuanItem");
              }}
            >
              OK
            </button>
          </IsiModalSuccess>
        ) : (
          <IsiModalFailed pesan={modal.pesan}>
            <button
              className="button is-danger"
              onClick={() => {
                setModal({ ...modal, isModalClosed: true });
                router.push("/Produk/SatuanItem");
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
  const query = "select nama,id_satuan,status from satuan";
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

SatuanItem.getLayout = function getLayout(page) {
  return <Layout clicked="Satuan Item">{page}</Layout>;
};
