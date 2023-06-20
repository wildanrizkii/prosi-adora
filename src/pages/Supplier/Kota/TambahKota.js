import Head from "next/head";
import Layout from "../../../../components/Layout";
import { useReducer, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

import {
  FieldKhusus,
  Modal,
  IsiModalFailed,
  IsiModalSuccess,
} from "../../../../components/AllComponent";

export default function TambahKota() {
  let [tipe, setTipe] = useState("KAB.");
  const [field, setField] = useState({
    "Nama Kota": "",
    "Nama Kota Checked": false,
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });

  const submit = field["Nama Kota Checked"] === true;

  const Router = useRouter();

  const onChangeNamaKota = async (Nama) => {
    if (Nama === "") {
      return "TIDAK BOLEH";
    }
    const res = await axios.post("/api/CheckKota", {
      sendNamaKota: Nama,
      tujuan: "add",
      tipe: tipe,
    });
    return res.data;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/TambahKota", {
        namaKota: field["Nama Kota"],
        tipe: tipe,
      });
      setModal({ pesan: res.data, isSuccess: true, isModalClosed: false });
    } catch (e) {
      setModal({
        pesan: e.response.data,
        isSuccess: false,
        isModalClosed: false,
      });
    }
  };

  const onChangeTipe = async (e) => {
    tipe = e.target.value;
    setTipe(e.target.value);
    runCode();
  };

  const runCode = () => {
    const a = document.getElementById("a");
    const event = new Event("input", { bubbles: true });
    a.dispatchEvent(event);
  };
  return (
    <>
      <Head>
        <title>Tambah Kota</title>
      </Head>
      <h1 className="title">Tambah Kota</h1>
      <form onSubmit={onSubmit}>
        <div className="field">
          <label className="label">Tipe</label>
          <div className="control">
            <div className="select">
              <select value={tipe} id="b" onChange={onChangeTipe}>
                <option value="KAB.">KAB.</option>
                <option value="KOTA">KOTA</option>
              </select>
            </div>
          </div>
        </div>

        <FieldKhusus
          nama="Nama Kota"
          value={field["Nama Kota"]}
          onChange={setField}
          field={field}
          IconLeft="fas fa-city"
          maxLength="15"
          fungsiCheck={onChangeNamaKota}
          id="a"
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
              onClick={() => Router.push("/Supplier/Kota")}
            >
              OK
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
TambahKota.getLayout = function getLayout(page) {
  return <Layout clicked="Kota">{page}</Layout>;
};
