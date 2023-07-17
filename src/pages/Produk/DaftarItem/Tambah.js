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
  Dropdown,
} from "../../../../components/AllComponent";
import handlerQuery from "../../../../lib/db";

export default function TambahItem({ rak, satuan, jenis }) {
  const [field, setField] = useState({
    Nama: "",
    // Stok: 0,
    "Stok Minimum": 0,
    Rak: rak[0].id_rak,
    Satuan: satuan[0].id_satuan,
    Jenis: jenis[0].id_jenis,
    "Nama Checked": false,
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });
  const submit = field["Nama Checked"] === true;
  const Router = useRouter();
  const onChangeNamaItem = async (Nama) => {
    if (Nama === "") {
      return "default";
    }
    const res = await axios.post("/api/CheckNamaItem", {
      NamaItem: Nama,
    });
    return res.data;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/TambahItem", {
        Nama: field.Nama,
        // Stok: field.Stok,
        Stok_Minimum: field["Stok Minimum"],
        Rak: field.Rak,
        Satuan: field.Satuan,
        Jenis: field.Jenis,
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
        <title>Tambah Item</title>
      </Head>
      <h1 className="title">Tambah Item</h1>

      <form onSubmit={onSubmit}>
        <Field
          nama="Nama"
          value={field.Nama}
          onChange={setField}
          field={field}
          IconLeft="fas fa-tags"
          maxLength="50"
          fungsiCheck={onChangeNamaItem}
        />
        {/* <Field
          nama="Stok"
          value={field.Stok}
          onChange={setField}
          field={field}
          IconLeft="fas fa-truck-loading"
          type="number"
          min="0"
        /> */}
        <Field
          nama="Stok Minimum"
          value={field["Stok Minimum"]}
          onChange={setField}
          field={field}
          IconLeft="fas fa-chart-bar"
          type="number"
          min="0"
        />
        <Dropdown
          nama="Rak"
          value={field.Rak}
          onChange={setField}
          field={field}
          arr={rak}
          mappingElement={["id_rak", "nama_rak"]}
        />
        <Dropdown
          nama="Satuan"
          value={field.Satuan}
          onChange={setField}
          field={field}
          arr={satuan}
          mappingElement={["id_satuan", "nama"]}
        />
        <Dropdown
          nama="Jenis"
          value={field.Jenis}
          onChange={setField}
          field={field}
          arr={jenis}
          mappingElement={["id_jenis", "nama"]}
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
              Lanjutkan Menambah Item
            </button>
            <button
              className="button is-success"
              onClick={() => Router.push("/Produk/DaftarItem?p=1")}
            >
              Kembali ke Daftar Item
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
TambahItem.getLayout = function getLayout(page) {
  return <Layout clicked="Daftar Item">{page}</Layout>;
};

export async function getServerSideProps() {
  const query1 = "select id_rak,nama_rak from rak where status!=0";
  const query2 = "select id_satuan,nama from satuan where status!=0";
  const query3 = "select id_jenis,nama from jenis where status!=0";
  try {
    const getRak = await handlerQuery({ query: query1, values: [] });
    const rak = JSON.parse(JSON.stringify(getRak));
    const getSatuan = await handlerQuery({ query: query2, values: [] });
    const satuan = JSON.parse(JSON.stringify(getSatuan));
    const getJenis = await handlerQuery({ query: query3, values: [] });
    const jenis = JSON.parse(JSON.stringify(getJenis));
    return {
      props: {
        rak,
        satuan,
        jenis,
      },
    };
  } catch (e) {
    return {
      props: {
        rak: [{ id_rak: "", nama_rak: "" }],
        satuan: [{ id_satuan: "", nama: "" }],
        jenis: [{ id_jenis: "", nama: "" }],
      },
    };
  }
}
