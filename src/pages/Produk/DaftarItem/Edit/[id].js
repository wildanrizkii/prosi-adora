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
import { useState } from "react";
import axios from "axios";
import { Badge } from "antd";
import {
  faCapsules,
  faChartBar,
  faPercent,
} from "@fortawesome/free-solid-svg-icons";

export default function Edit({ hasil, rak, satuan, jenis }) {
  const [field, setField] = useState({
    Nama: hasil[0].nama,
    // Stok: hasil[0].stok,
    "Stok Minimum": hasil[0].stok_min,
    Rak: hasil[0].statusRak === 1 ? hasil[0].id_rak : "",
    Satuan: hasil[0].statusSatuan === 1 ? hasil[0].id_satuan : "",
    Jenis: hasil[0].statusJenis === 1 ? hasil[0].id_jenis_item : "",
    "Nama Checked": true,
    Margin: hasil[0].margin,
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });
  const submit =
    field["Nama Checked"] === true &&
    parseInt(field.Margin) > 0 &&
    field.Jenis !== "" &&
    field.Rak !== "" &&
    field.Satuan !== "";

  const Router = useRouter();
  const onChangeNamaItem = async (Nama) => {
    if (Nama === "") {
      return "default";
    }
    const res = await axios.post("/api/CheckNamaItem", {
      NamaItem: Nama,
      IdItem: Router.query.id,
    });
    return res.data;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch("/api/EditItem", {
        Nama: field.Nama,
        // Stok: field.Stok,
        Stok_Minimum: field["Stok Minimum"],
        Rak: field.Rak,
        Satuan: field.Satuan,
        Jenis: field.Jenis,
        IdItem: Router.query.id,
        Margin: field.Margin,
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
        <title>Edit Item</title>
      </Head>
      <h1 className="title">Edit Item</h1>

      <form onSubmit={onSubmit}>
        <Field
          nama="Nama"
          value={field.Nama}
          onChange={setField}
          field={field}
          IconLeft={faCapsules}
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
          IconLeft={faChartBar}
          type="number"
          min="0"
        />
        <Field
          nama="Margin"
          value={field.Margin}
          onChange={setField}
          field={field}
          IconLeft={faPercent}
          type="number"
          min="0"
        />
        {field.Rak === "" ? (
          <div className="notification is-danger is-light">
            <Badge count="!" />
            <br />
            {`Rak ${hasil[0].namaRak} sudah tidak aktif! Silahkan Pilih Rak baru`}

            <Dropdown
              nama="Rak"
              value={field.Rak}
              onChange={setField}
              field={field}
              arr={rak}
              mappingElement={["id_rak", "nama_rak"]}
              placeholder={hasil[0].statusRak === 1 ? undefined : ""}
            />
          </div>
        ) : (
          <Dropdown
            nama="Rak"
            value={field.Rak}
            onChange={setField}
            field={field}
            arr={rak}
            mappingElement={["id_rak", "nama_rak"]}
            placeholder={hasil[0].statusRak === 1 ? undefined : ""}
          />
        )}
        {field.Satuan === "" ? (
          <div className="notification is-danger is-light">
            <Badge count="!" />
            <br />
            {`Satuan ${hasil[0].namaSatuan} sudah tidak aktif! Silahkan Pilih Satuan baru`}
            <Dropdown
              nama="Satuan"
              value={field.Satuan}
              onChange={setField}
              field={field}
              arr={satuan}
              mappingElement={["id_satuan", "nama"]}
              placeholder={hasil[0].statusSatuan === 1 ? undefined : ""}
            />
          </div>
        ) : (
          <Dropdown
            nama="Satuan"
            value={field.Satuan}
            onChange={setField}
            field={field}
            arr={satuan}
            mappingElement={["id_satuan", "nama"]}
            placeholder={hasil[0].statusSatuan === 1 ? undefined : ""}
          />
        )}
        {field.Jenis === "" ? (
          <div className="notification is-danger is-light">
            <Badge count="!" />
            <br />
            {`Jenis ${hasil[0].namaJenis} sudah tidak aktif! Silahkan Pilih Jenis baru`}
            <Dropdown
              nama="Jenis"
              value={field.Jenis}
              onChange={setField}
              field={field}
              arr={jenis}
              mappingElement={["id_jenis", "nama"]}
              placeholder={hasil[0].statusJenis === 1 ? undefined : ""}
            />
          </div>
        ) : (
          <Dropdown
            nama="Jenis"
            value={field.Jenis}
            onChange={setField}
            field={field}
            arr={jenis}
            mappingElement={["id_jenis", "nama"]}
            placeholder={hasil[0].statusJenis === 1 ? undefined : ""}
          />
        )}
        <button className="button is-link" disabled={!submit}>
          Submit
        </button>
      </form>
      <Modal show={modal.isModalClosed === false && "is-active"}>
        {modal.isSuccess === true ? (
          <IsiModalSuccess pesan={modal.pesan}>
            <button
              className="button is-success"
              onClick={() => Router.push("/Produk/DaftarItem?p=1")}
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
    "select item.nama,stok_min,item.id_rak,item.id_satuan,item.id_jenis_item,margin,satuan.status as statusSatuan,rak.status as statusRak,jenis.status as statusJenis," +
    "rak.nama_rak as namaRak,satuan.nama as namaSatuan,jenis.nama as namaJenis " +
    "from item inner join rak on item.id_rak=rak.id_rak inner join satuan on item.id_satuan=satuan.id_satuan " +
    "inner join jenis on item.id_jenis_item=jenis.id_jenis " +
    "where id_item=?";
  const values = [context.query.id];

  const queryRak = "select id_rak,nama_rak from rak where status=1";
  const querySatuan = "select id_satuan,nama from satuan where status=1";
  const queryJenis = "select id_jenis,nama from jenis where status=1";

  try {
    const getData = await handlerQuery({ query, values });
    const hasil = JSON.parse(JSON.stringify(getData));
    const getRak = await handlerQuery({ query: queryRak, values: [] });
    const rak = JSON.parse(JSON.stringify(getRak));
    const getSatuan = await handlerQuery({ query: querySatuan, values: [] });
    const satuan = JSON.parse(JSON.stringify(getSatuan));
    const getJenis = await handlerQuery({ query: queryJenis, values: [] });
    const jenis = JSON.parse(JSON.stringify(getJenis));

    return {
      props: {
        hasil,
        rak,
        satuan,
        jenis,
      },
    };
  } catch (e) {
    return {
      props: {
        hasil: e.message,
        rak: [{ id_rak: "", nama_rak: "" }],
        satuan: [{ id_satuan: "", nama: "" }],
        jenis: [{ id_jenis: "", nama: "" }],
      },
    };
  }
}

Edit.getLayout = function getLayout(page) {
  return <Layout clicked="Daftar Item">{page}</Layout>;
};
