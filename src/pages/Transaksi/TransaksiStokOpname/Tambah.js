import Head from "next/head";
import Layout from "../../../../components/Layout";
import {
  Field,
  Dropdown,
  Modal,
  IsiModalFailed,
  IsiModalSuccess,
} from "../../../../components/AllComponent";
import { useState } from "react";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import handlerQuery from "../../../../lib/db";

export default function Tambah({ dataRak }) {
  const [field, setField] = useState({
    "No Opname": "",
    "No Opname Checked": false,
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });
  const [rak, setRak] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const idUser = status === "authenticated" && session.user.idUser;

  const [detail, setDetail] = useState(null);
  const onChangeNoOpname = async (NoOpname) => {
    if (NoOpname === "") {
      return "default";
    }
    const res = await axios.post("/api/CheckNoOpname", {
      NoOpname,
    });
    return res.data;
  };
  const onChangeRak = async (e) => {
    setRak(e.target.value);
    try {
      const hasil = await axios.get("/api/GetItemInRak?rak=" + e.target.value);
      setDetail(hasil.data);
    } catch (er) {
      setDetail(er.response.data);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <>
      <Head>
        <title>Tambah Transaksi Stok Opname</title>
      </Head>
      <h1 className="title">Tambah Transaksi Stok Opname</h1>
      <form onSubmit={onSubmit}>
        <Field
          nama="No Opname"
          value={field["No Opname"]}
          onChange={setField}
          IconLeft="fas fa-receipt"
          field={field}
          maxLength="50"
          fungsiCheck={onChangeNoOpname}
        />
        <div className="field">
          <label className="label">Rak</label>
          <div className="control">
            <div className="select">
              <select value={rak} onChange={onChangeRak}>
                {dataRak.map((x) => {
                  return (
                    <option key={x.id_rak} value={x.id_rak}>
                      {x.nama_rak}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">Detail</label>
          <table className="table has-text-centered">
            <thead>
              <tr>
                <th className="has-text-centered is-vcentered">Kode Item</th>
                <th className="has-text-centered is-vcentered">Nama Item</th>
                <th className="has-text-centered is-vcentered">Jenis</th>
                <th className="has-text-centered is-vcentered">Satuan</th>
                <th className="has-text-centered is-vcentered">Stok Sistem</th>
                <th className="has-text-centered is-vcentered">Stok Fisik</th>
                <th className="has-text-centered is-vcentered">Selisih</th>
              </tr>
            </thead>
            <tbody>
              {!Array.isArray(detail) ? (
                <tr>
                  <td>{detail}</td>
                </tr>
              ) : (
                detail.map((x, index) => {
                  return (
                    <tr key={x.id_item}>
                      <td className="is-vcentered">{x.id_item}</td>
                      <td className="is-vcentered">{x.namaItem}</td>
                      <td className="is-vcentered">{x.namaJenis}</td>
                      <td className="is-vcentered">{x.namaSatuan}</td>
                      <td className="is-vcentered">{x.stok}</td>
                      <td className="is-vcentered">
                        <input
                          type="number"
                          className="input has-text-centered"
                          value="0"
                        />
                      </td>
                      <td className="is-vcentered">0</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </form>
    </>
  );
}

export async function getServerSideProps() {
  const query = "select id_rak,nama_rak from rak";
  try {
    const getRak = await handlerQuery({ query, values: [] });
    const dataRak = JSON.parse(JSON.stringify(getRak));
    dataRak.unshift({ id_rak: "", nama_rak: "--Pilih Rak--" });
    return {
      props: {
        dataRak,
      },
    };
  } catch (e) {
    return {
      props: {
        dataRak: [{ id_rak: "", nama_rak: "" }],
      },
    };
  }
}

Tambah.getLayout = function getLayout(page) {
  return <Layout clicked="Transaksi Stok Opname">{page}</Layout>;
};
