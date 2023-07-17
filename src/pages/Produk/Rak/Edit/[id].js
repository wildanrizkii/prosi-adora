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
export default function Edit({ hasil }) {
  const [field, setField] = useState({
    "Nama Rak": hasil[0].nama_rak,
    "Nama Rak Checked": true,
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
      tujuan: "edit",
      id: router.query.id,
    });
    return res.data;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch("/api/EditRak", {
        namaRak: field["Nama Rak"],
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
        <title>Edit Rak</title>
      </Head>
      <h1 className="title">Edit Rak</h1>
      <form onSubmit={onSubmit}>
        <Field
          nama="Nama Rak"
          value={field["Nama Rak"]}
          onChange={setField}
          field={field}
          IconLeft="fas fa-cubes"
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
              onClick={() => router.push("/Produk/Rak")}
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
  const query = "select nama_rak from rak where id_rak=?";
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
  return <Layout clicked="Rak">{page}</Layout>;
};
