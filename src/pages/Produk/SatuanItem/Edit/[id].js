import Head from "next/head";
import Layout from "../../../../../components/Layout";
import handlerQuery from "../../../../../lib/db";

import { useRouter } from "next/router";
import { useState } from "react";

import axios from "axios";

import {
  Field,
  Modal,
  IsiModalFailed,
  IsiModalSuccess,
} from "../../../../../components/AllComponent";
import { faPrescriptionBottle } from "@fortawesome/free-solid-svg-icons";

export default function Edit({ hasil }) {
  const [field, setField] = useState({
    "Nama Satuan": hasil[0].nama,
    "Nama Satuan Checked": true,
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
      tujuan: "edit",
      id: router.query.id,
    });

    return res.data;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch("/api/EditSatuan", {
        namaSatuan: field["Nama Satuan"],
        id: router.query.id,
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
        <title>Edit Satuan Item</title>
      </Head>
      <h1 className="title">Edit Satuan Item</h1>
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
              onClick={() => router.push("/Produk/SatuanItem")}
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
  const query = "select nama from satuan where id_satuan=?";
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
  return <Layout clicked="Satuan Item">{page}</Layout>;
};
