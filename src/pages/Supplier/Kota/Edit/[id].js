import Head from "next/head";
import Layout from "../../../../../components/Layout";
import handlerQuery from "../../../../../lib/db";
import {
  FieldKhusus,
  Modal,
  IsiModalFailed,
  IsiModalSuccess,
} from "../../../../../components/AllComponent";
import { useRouter } from "next/router";
import { useState } from "react";

import axios from "axios";
export default function Edit({ hasil }) {
  let [tipe, setTipe] = useState(hasil[0].tipe);
  const [field, setField] = useState({
    "Nama Kota atau Kab": hasil[0].nama_kota,
    "Nama Kota atau Kab Checked": true,
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });
  const submit = field["Nama Kota atau Kab Checked"] === true;
  const Router = useRouter();
  const onChangeNamaKota = async (Nama) => {
    if (Nama === "") {
      return "default";
    }
    const res = await axios.post("/api/CheckKota", {
      sendNamaKota: Nama,
      tujuan: "edit",
      tipe: tipe,
      id: Router.query.id,
    });
    return res.data;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch("/api/EditKota", {
        namaKota: field["Nama Kota atau Kab"],
        id: Router.query.id,
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
        <title>Edit Kota</title>
      </Head>
      <h1 className="title">Edit Kota</h1>

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
          nama="Nama Kota atau Kab"
          value={field["Nama Kota atau Kab"]}
          onChange={setField}
          field={field}
          IconLeft="fas fa-city"
          maxLength="50"
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

export async function getServerSideProps(context) {
  const query = "select nama_kota,tipe from kota where id_kota=?";
  const values = [context.query.id];
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

Edit.getLayout = function getLayout(page) {
  return <Layout clicked="Kota">{page}</Layout>;
};
