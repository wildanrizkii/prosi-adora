import Layout from "../../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../../lib/db";
import Link from "next/link";
import {
  Modal,
  IsiModalFailed,
  IsiModalSuccess,
} from "../../../../components/AllComponent";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
export default function DaftarItem({ hasil }) {
  let semuaAkun;
  const [isUpdateStatusSuccess, setUpdateStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  async function changeStatus(id, toActive) {
    try {
      if (toActive === true) {
        await axios.patch("/api/UpdateStatusItem", { id, status: 1 });
      } else if (toActive === false) {
        await axios.patch("/api/UpdateStatusItem", { id, status: 0 });
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
          key={x.id_item}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 && "red",
            color: x.status === 0 && "white",
          }}
        >
          <td>{index + 1}</td>
          <td>{x.namaItem}</td>
          <td>{x.stok}</td>
          <td>{x.stok_min}</td>
          <td>{x.namaRak}</td>
          <td>{x.namaSatuan}</td>
          <td>{x.namaJenis}</td>
          <td>{x.status === 1 ? "Aktif" : "Non-Aktif"}</td>
          <td>
            <Link
              href={`DaftarItem/Edit/${x.id_item}`}
              className="button is-success is-small"
            >
              Edit
            </Link>
            {x.status === 1 ? (
              <button
                className="button is-danger is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_item, false)}
              >
                Non-Aktifkan
              </button>
            ) : (
              <button
                className="button is-primary is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_item, true)}
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
        <title>Daftar Item</title>
      </Head>
      <h1 className="title">Daftar Item</h1>

      <Link
        className="button is-link"
        href="DaftarItem/TambahRak"
        style={{ marginBottom: "10px" }}
      >
        Tambah
      </Link>

      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Stok</th>
            <th>Stok Min</th>
            <th>Rak</th>
            <th>Satuan</th>
            <th>Jenis</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>{semuaAkun}</tbody>
      </table>
      <Modal show={showModal === true && "is-active"}>
        {isUpdateStatusSuccess === true ? (
          <IsiModalSuccess pesan="Berhasil Mengubah Status">
            <button
              className="button is-primary"
              onClick={() => {
                setShowModal(false);
                router.push("/Produk/DaftarItem");
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
                router.push("/Produk/DaftarItem");
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
  const query =
    "select id_item,item.nama as namaItem,stok,stok_min,item.status,rak.nama_rak as namaRak,satuan.nama as namaSatuan,jenis.nama as namaJenis " +
    "from item inner join rak on item.id_rak=rak.id_rak inner join satuan on " +
    "satuan.id_satuan=item.id_satuan inner join jenis on jenis.id_jenis=item.id_jenis_item";
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

DaftarItem.getLayout = function getLayout(page) {
  return <Layout clicked="Daftar Item">{page}</Layout>;
};
