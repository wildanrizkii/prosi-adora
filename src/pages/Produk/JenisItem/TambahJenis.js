import Head from "next/head";
import Layout from "../../../../components/Layout";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import {
  Field,
  Modal,
  IsiModalFailed,
  IsiModalSuccess,
} from "../../../../components/AllComponent";
import { faPills } from "@fortawesome/free-solid-svg-icons";

export default function TambahJenis() {
  const [field, setField] = useState({
    "Nama Jenis Item": "",
    "Nama Jenis Item Checked": false,
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });
  const submit = field["Nama Jenis Item Checked"] === true;
  const router = useRouter();

  const onChangeNamaJenis = async (Nama) => {
    if (Nama === "") {
      return "default";
    }
    const res = await axios.post("/api/CheckJenis", {
      sendNamaJenis: Nama,
      tujuan: "add",
    });
    return res.data;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/TambahJenisItem", {
        namaJenis: field["Nama Jenis Item"],
      });
      setModal({
        pesan: res.data,
        isSuccess: true,
        isModalClosed: false,
      });
    } catch (e) {
      setModal({
        pesan: e.response.data,
        isSuccess: false,
        isModalClosed: false,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Tambah Jenis Item</title>
      </Head>
      <h1 className="title">Tambah Jenis Item</h1>
      <form onSubmit={onSubmit}>
        <Field
          nama="Nama Jenis Item"
          value={field["Nama Jenis Item"]}
          onChange={setField}
          field={field}
          IconLeft={faPills}
          maxLength="15"
          fungsiCheck={onChangeNamaJenis}
        />

        <button className="button is-link" disabled={!submit}>
          Submit
        </button>
      </form>
      <Modal show={modal.isModalClosed === false && "is-active"}>
        {modal.isSuccess === true ? (
          <IsiModalSuccess pesan={modal.pesan}>
            <button
              className="button is-success"
              onClick={() => router.reload()}
              style={{ marginRight: "20px" }}
            >
              Lanjutkan Menambah jenis item
            </button>
            <button
              className="button is-success"
              onClick={() => router.push("/Produk/JenisItem")}
            >
              Kembali Ke halaman jenis item
            </button>
          </IsiModalSuccess>
        ) : (
          <IsiModalFailed pesan={modal.pesan}>
            <button
              className="button is-danger"
              onClick={() => setModal({ ...modal, isModalClosed: true })}
            >
              OK
            </button>
          </IsiModalFailed>
        )}
      </Modal>
    </>
  );
}
TambahJenis.getLayout = function getLayout(page) {
  return <Layout clicked="Jenis Item">{page}</Layout>;
};
