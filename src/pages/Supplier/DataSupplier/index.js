import Layout from "../../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../../lib/db";
import Link from "next/link";
import {
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
} from "../../../../components/TambahSupplierComp";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
export default function DataSupplier({ hasil }) {
  let semuaAkun;
  const [isUpdateStatusSuccess, setUpdateStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  async function changeStatus(id, toActive) {
    try {
      if (toActive === true) {
        await axios.patch("/api/UpdateStatusSupplier", { id, status: 1 });
      } else if (toActive === false) {
        await axios.patch("/api/UpdateStatusSupplier", { id, status: 0 });
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
          key={x.id_supplier}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 && "red",
            color: x.status === 0 && "white",
          }}
        >
          <td>{index + 1}</td>
          <td>{x.kode_supplier}</td>
          <td>{x.nama_supplier}</td>
          <td>{x.alamat}</td>
          <td>{x.no_hp}</td>
          <td>{x.kode_kota}</td>
          <td>{x.status === 1 ? "Aktif" : "Non-Aktif"}</td>
          <td>
            <Link
              href={`DataSupplier/Edit/${x.id_supplier}`}
              className="button is-success is-small"
            >
              Edit
            </Link>
            {x.status === 1 ? (
              <button
                className="button is-danger is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_supplier, false)}
              >
                Non-Aktifkan
              </button>
            ) : (
              <button
                className="button is-primary is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_supplier, true)}
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
        <title>Data Supplier</title>
      </Head>
      <h1 className="title">Data Supplier</h1>

      <Link
        className="button is-link"
        href="DataSupplier/TambahSupplier"
        style={{ marginBottom: "10px" }}
      >
        Tambah
      </Link>

      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Kode</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Telepon</th>
            <th>Kota</th>
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
                router.push("/Supplier/DataSupplier");
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
                router.push("/Supplier/DataSupplier");
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
  // const query = "select id_supplier, kode_supplier, nama_supplier, alamat, no_hp, id_kota, status from supplier";
  const query =
    "select supplier.id_supplier AS id_supplier, supplier.kode_supplier AS kode_supplier, supplier.nama_supplier AS nama_supplier, supplier.alamat AS alamat, supplier.no_hp AS no_hp, kota.kode_kota AS kode_kota, supplier.status from supplier JOIN kota ON kota.id_kota = supplier.id_kota ";
  const values = [];
  try {
    const getData = await handlerQuery({ query, values });
    const hasil = JSON.parse(JSON.stringify(getData));
    // console.log(hasil);
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

DataSupplier.getLayout = function getLayout(page) {
  return <Layout clicked="Data Supplier">{page}</Layout>;
};
