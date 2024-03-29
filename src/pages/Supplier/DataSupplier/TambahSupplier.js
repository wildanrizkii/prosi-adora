import Head from "next/head";
import Layout from "../../../../components/Layout";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Field,
  Dropdown,
  Modal,
  IsiModalFailed,
  IsiModalSuccess,
} from "../../../../components/AllComponent";
import handlerQuery from "../../../../lib/db";
import {
  faCity,
  faMapMarkedAlt,
  faPhone,
  faSignature,
  faTags,
} from "@fortawesome/free-solid-svg-icons";

export default function TambahSupplier({ DaftarKota }) {
  const [field, setField] = useState({
    "Kode Supplier": "",
    "Nama Supplier": "",
    Alamat: "",
    Kota: DaftarKota[0].id_kota,
    "No HP": "",
    "Kode Supplier Checked": false,
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });

  const submit = field["Kode Supplier Checked"] === true;
  const Router = useRouter();
  const onChangeKodeSupplier = async (Kode) => {
    if (Kode === "") {
      return "default";
    }
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
          value={field["Kode Supplier"]}
          onChange={setField}
          IconLeft={faTags}
          field={field}
          maxLength="5"
          fungsiCheck={onChangeKodeSupplier}
        />
        <Field
          nama="Nama Supplier"
          value={field["Nama Supplier"]}
          onChange={setField}
          IconLeft={faSignature}
          field={field}
          maxLength="20"
        />
        <Field
          nama="Alamat"
          value={field["Alamat"]}
          onChange={setField}
          IconLeft={faMapMarkedAlt}
          field={field}
          maxLength="100"
        />
        <Dropdown
          nama="Kota"
          value={field.Kota}
          onChange={setField}
          field={field}
          arr={DaftarKota}
          mappingElement={["id_kota", "nama_kota"]}
          icon={faCity}
        />

        <Field
          nama="No HP"
          value={field["No HP"]}
          onChange={setField}
          field={field}
          IconLeft={faPhone}
          maxLength="13"
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
              onClick={() => Router.reload()}
              style={{ marginRight: "20px" }}
            >
              Lanjutkan Menambahkan Supplier
            </button>
            <button
              className="button is-success"
              onClick={() => Router.push("/Supplier/DataSupplier")}
            >
              Kembali Ke Data Supplier
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

export async function getServerSideProps() {
  const query =
    "select id_kota,nama_kota,tipe from kota where status!=0 order by nama_kota";

  try {
    const getData = await handlerQuery({ query, values: [] });
    const DaftarKota = JSON.parse(JSON.stringify(getData));
    for (let item in DaftarKota) {
      DaftarKota[item].nama_kota =
        DaftarKota[item].tipe + " " + DaftarKota[item].nama_kota;
    }

    return {
      props: {
        DaftarKota,
      },
    };
  } catch (e) {
    return {
      props: {
        DaftarKota: [{ id_kota: "", nama_kota: "", tipe: "" }],
      },
    };
  }
}

TambahSupplier.getLayout = function getLayout(page) {
  return <Layout clicked="Data Supplier">{page}</Layout>;
};
