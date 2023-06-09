import Head from "next/head";
import Layout from "../../../../../components/Layout";
import handlerQuery from "../../../../../lib/db";
import {
  Field,
  Dropdown,
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
} from "../../../../../components/AllComponent";
import { useRouter } from "next/router";
import { useState, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
export default function Edit({ hasil, DaftarKota }) {
  const [field, setField] = useState({
    "Kode Supplier": hasil[0].kode_supplier,
    "Nama Supplier": hasil[0].nama_supplier,
    Alamat: hasil[0].alamat,
    Kota: hasil[0].id_kota,
    "No HP": hasil[0].no_hp,
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
      id_supplier: Router.query.id,
    });
    return res.data;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch("/api/EditSupplier", {
        Kode_Supplier: field["Kode Supplier"],
        Nama_Supplier: field["Nama Supplier"],
        Alamat: field.Alamat,
        Kota: field.Kota,
        No_HP: field["No HP"],
        Id_Supplier: Router.query.id,
      });
      console.log(res.data);
      setModal({ pesan: res.data, isSuccess: true, isModalClosed: false });
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
        <title>Edit Supplier</title>
      </Head>
      <h1 className="title">Edit Supplier</h1>

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

export async function getServerSideProps(context) {
  const query =
    "select kode_supplier, nama_supplier," +
    "alamat, no_hp, id_kota from supplier where id_supplier=?";
  const values = [context.query.id];

  const query2 = "select id_kota,kode_kota from kota";

  try {
    const getData = await handlerQuery({ query, values });
    const hasil = JSON.parse(JSON.stringify(getData));
    const getData2 = await handlerQuery({ query: query2, values: [] });
    const DaftarKota = JSON.parse(JSON.stringify(getData2));
    return {
      props: {
        hasil,
        DaftarKota,
      },
    };
  } catch (e) {
    return {
      props: {
        hasil: e.message,
        DaftarKota: [{ id_kota: "", kode_kota: "" }],
      },
    };
  }
}

Edit.getLayout = function getLayout(page) {
  return <Layout clicked="Data Supplier">{page}</Layout>;
};
