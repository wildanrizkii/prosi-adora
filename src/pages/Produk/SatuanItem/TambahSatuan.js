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
import { faPrescriptionBottle } from "@fortawesome/free-solid-svg-icons";

export default function TambahSatuan() {
  const [field, setField] = useState({
    "Nama Satuan": "",
    "Nama Satuan Checked": false,
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });

  const submit = field["Nama Satuan Checked"] === true;
  const router = useRouter();

  const onChangeNamaSatuan = async (Nama) => {
    if (Nama === "") {
      return "default";
    }
    const res = await axios.post("/api/CheckSatuan", {
      sendNamaSatuan: Nama,
      tujuan: "add",
    });

    return res.data;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/TambahSatuanItem", {
        namaSatuan: field["Nama Satuan"],
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
        <title>Tambah Satuan Item</title>
      </Head>
      <h1 className="title">Tambah Satuan Item</h1>
      <form onSubmit={onSubmit}>
        <Field
          nama="Nama Satuan"
          value={field["Nama Satuan"]}
          onChange={setField}
          field={field}
          IconLeft={faPrescriptionBottle}
          maxLength="15"
          fungsiCheck={onChangeNamaSatuan}
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
              Lanjutkan Menambah satuan item
            </button>
            <button
              className="button is-success"
              onClick={() => router.push("/Produk/SatuanItem")}
            >
              Kembali Ke halaman satuan item
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
TambahSatuan.getLayout = function getLayout(page) {
  return <Layout clicked="Satuan Item">{page}</Layout>;
};
