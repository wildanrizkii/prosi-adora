import Layout from "../../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../../lib/db";
import Link from "next/link";

import {
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
} from "../../../../components/AllComponent";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
export default function Kota({ hasil }) {
  let semuaAkun;
  const router = useRouter();
  // const [isUpdateStatusSuccess, setUpdateStatus] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });

  const [filter, setFilter] = useState({
    Search: router.query.Search,
    Tipe: router.query.Tipe !== undefined ? router.query.Tipe : "KAB. DAN KOTA",
  });

  async function changeStatus(id, toActive) {
    try {
      let res;
      if (toActive === true) {
        res = await axios.patch("/api/UpdateStatusKota", { id, status: 1 });
      } else if (toActive === false) {
        res = await axios.patch("/api/UpdateStatusKota", { id, status: 0 });
      }
      setModal({ pesan: res.data, isSuccess: true, isModalClosed: false });
    } catch (e) {
      setModal({
        pesan: e.response.data,
        isSuccess: false,
        isModalClosed: false,
      });
    }
  }
  const changeSearch = (e) => {
    setFilter({ ...filter, Search: e.target.value });
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    if (e.target.value !== "") {
      hrefBelakang.set("Search", e.target.value);
    } else {
      hrefBelakang.delete("Search");
    }

    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const onChangeTipe = (e) => {
    setFilter({ ...filter, Tipe: e.target.value });
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    if (e.target.value !== "KAB. DAN KOTA") {
      hrefBelakang.set("Tipe", e.target.value);
    } else {
      hrefBelakang.delete("Tipe");
    }

    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  try {
    semuaAkun = hasil.map((x, index) => {
      return (
        <tr
          key={x.id_kota}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 && "red",
            color: x.status === 0 && "white",
          }}
        >
          <td className="is-vcentered">{index + 1}</td>
          <td className="is-vcentered">{x.tipe + " " + x.nama_kota}</td>
          <td className="is-vcentered">
            {x.status === 1 ? "Aktif" : "Non-Aktif"}
          </td>
          <td className="is-vcentered">
            <Link
              href={`Kota/Edit/${x.id_kota}`}
              className="button is-success is-small"
            >
              Edit
            </Link>
            {x.status === 1 ? (
              <button
                className="button is-danger is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_kota, false)}
              >
                Non-Aktifkan
              </button>
            ) : (
              <button
                className="button is-primary is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_kota, true)}
              >
                Aktifkan
              </button>
            )}
          </td>
        </tr>
      );
    });
  } catch (e) {
    semuaAkun = (
      <tr>
        <td colSpan="4" className="is-vcentered">
          {hasil}
        </td>
      </tr>
    );
  }

  return (
    <>
      <Head>
        <title>Kota</title>
      </Head>
      <h1 className="title">Kota</h1>

      <div className="field">
        <label className="label">KAB/KOTA</label>
        <div className="control">
          <div className="select">
            <select onChange={onChangeTipe} value={filter.Tipe}>
              <option value="KAB. DAN KOTA">KAB. DAN KOTA</option>
              <option value="KAB.">KAB.</option>
              <option value="KOTA">KOTA</option>
            </select>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Search by Name</label>
        <div className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="text"
            value={filter.Search}
            onChange={changeSearch}
            maxLength="100"
            required
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search"></i>
          </span>
        </div>
      </div>
      <Link
        className="button is-link"
        href="Kota/TambahKota"
        style={{ marginBottom: "10px" }}
      >
        Tambah
      </Link>

      <table className="table has-text-centered">
        <thead>
          <tr>
            <th className="has-text-centered is-vcentered">No</th>
            <th className="has-text-centered is-vcentered">Nama</th>
            <th className="has-text-centered is-vcentered">Status</th>
            <th className="has-text-centered is-vcentered">Aksi</th>
          </tr>
        </thead>
        <tbody>{semuaAkun}</tbody>
      </table>
      <Modal show={modal.isModalClosed === false && "is-active"}>
        {modal.isSuccess === true ? (
          <IsiModalSuccess pesan={modal.pesan}>
            <button
              className="button is-success"
              onClick={() => {
                setModal({ ...modal, isModalClosed: true });
                router.reload();
              }}
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
                router.reload();
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
  let query = "select nama_kota,tipe,id_kota,status from kota";

  const { Search, Tipe } = context.query;
  if (Search !== undefined || Tipe !== undefined) {
    query = query + " where ";
    if (Search !== undefined) {
      query = query + "nama_kota like ?";
    }
    if (Tipe !== undefined) {
      if (Search === undefined) {
        query = query + " tipe=?";
      } else {
        query = query + " and tipe=?";
      }
    }
  }

  query = query + " order by id_kota";
  const values = [];
  if (Search !== undefined) {
    values.push("%" + Search + "%");
  }
  if (Tipe !== undefined) {
    values.push(Tipe);
  }
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

Kota.getLayout = function getLayout(page) {
  return <Layout clicked="Kota">{page}</Layout>;
};
