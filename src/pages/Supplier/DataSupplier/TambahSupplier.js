import Head from "next/head";
import Layout from "../../../../components/Layout";
import { useReducer, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import {
  Field,
  Dropdown,
  Modal,
  IsiModalFailed,
  IsiModalSuccess,
} from "../../../../components/AllComponent";
import handlerQuery from "../../../../lib/db";

export default function TambahSupplier({ DaftarKota }) {
  const [field, setField] = useState({
    "Kode Supplier": "",
    "Nama Supplier": "",
    Alamat: "",
    Kota: DaftarKota[0].id_kota,
    "No HP": "",
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });
  const Router = useRouter();
  const onChangeKodeSupplier = async (Kode) => {
    const res = await axios.post("/api/CheckKodeSupp", {
      kode_supplier: Kode,
    });
    return res.data;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/TambahSupplier", {
        Kode_Supplier: field["Kode Supplier"],
        Nama_Supplier: field["Nama Supplier"],
        Alamat: field.Alamat,
        Kota: field.Kota,
        No_HP: field["No HP"],
      });
      setModal({ pesan: res.data, isSuccess: true, isModalClosed: false });
    } catch (e) {
      console.log(e);
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
        <title>Tambah Supplier</title>
      </Head>
      <h1 className="title">Tambah Supplier</h1>

      <form onSubmit={onSubmit}>
        <Field
          nama="Kode Supplier"
          WarnaTextbox="input"
          value={field["Kode Supplier"]}
          onChange={setField}
          field={field}
          IconLeft="fas fa-tags"
          maxLength="5"
          fungsiCheck={onChangeKodeSupplier}
        />
        <Field
          nama="Nama Supplier"
          WarnaTextbox="input"
          value={field["Nama Supplier"]}
          onChange={setField}
          field={field}
          IconLeft="fas fa-signature"
          maxLength="15"
        />
        <Field
          nama="Alamat"
          WarnaTextbox="input"
          value={field["Alamat"]}
          onChange={setField}
          field={field}
          IconLeft="fas fa-map-marked-alt"
          maxLength="50"
        />
        <Dropdown
          nama="Kota"
          value={field.Kota}
          onChange={setField}
          field={field}
          arr={DaftarKota}
          mappingElement={["id_kota", "kode_kota"]}
        />

        <Field
          nama="No HP"
          WarnaTextbox="input"
          value={field["No HP"]}
          onChange={setField}
          field={field}
          IconLeft="fas fa-phone"
          maxLength="11"
        />
        <button className="button is-link">Submit</button>
      </form>
      <Modal show={modal.isModalClosed === false && "is-active"}>
        {modal.isSuccess === true ? (
          <IsiModalSuccess pesan={modal.pesan}>
            <button
              className="button is-success"
              onClick={() => Router.push("/Supplier/DataSupplier")}
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
  const query = "select id_kota,kode_kota from kota";

  try {
    const getData = await handlerQuery({ query, values: [] });
    const DaftarKota = JSON.parse(JSON.stringify(getData));
    return {
      props: {
        DaftarKota,
      },
    };
  } catch (e) {
    return {
      props: {
        DaftarKota: [{ id_kota: "", kode_kota: "" }],
      },
    };
  }
}

TambahSupplier.getLayout = function getLayout(page) {
  return <Layout clicked="Data Supplier">{page}</Layout>;
};
