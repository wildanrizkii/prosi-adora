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
import { faCubes } from "@fortawesome/free-solid-svg-icons";

export default function TambahRak() {
  const [field, setField] = useState({
    "Nama Rak": "",
    "Nama Rak Checked": false,
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });

  const submit = field["Nama Rak Checked"] === true;
  const router = useRouter();

  const onChangeNamaRak = async (Nama) => {
    if (Nama === "") {
      return "default";
    }
    const res = await axios.post("/api/CheckRak", {
      sendNamaRak: Nama,
      tujuan: "add",
    });
    return res.data;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/TambahRakA", {
        namaRak: field["Nama Rak"],
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
        <title>Tambah Rak</title>
      </Head>
      <h1 className="title">Tambah Rak</h1>
      <form onSubmit={onSubmit}>
        <Field
          nama="Nama Rak"
          value={field["Nama Rak"]}
          onChange={setField}
          field={field}
          IconLeft={faCubes}
          maxLength="15"
          fungsiCheck={onChangeNamaRak}
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
              Lanjutkan Menambah rak
            </button>
            <button
              className="button is-success"
              onClick={() => router.push("/Produk/Rak")}
            >
              Kembali Ke halaman rak
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
TambahRak.getLayout = function getLayout(page) {
  return <Layout clicked="Rak">{page}</Layout>;
};
