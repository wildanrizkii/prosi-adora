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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCity, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button, FloatButton } from "antd";
import { EditFilled, PlusOutlined } from "@ant-design/icons";
export default function Kota({ hasil }) {
  let semuaAkun;
  const router = useRouter();

  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });

  const [filterSearch, setFilterSearch] = useState(
    router.query.Search !== undefined ? router.query.Search : ""
  );

  const dropdown = {
    Tipe: router.query.Tipe !== undefined ? router.query.Tipe : "",
  };

  let tungguSelesaiMengetik;
  let waktuTunggu = 1000;
  const changeSearch = (e) => {
    setFilterSearch(e.target.value);
  };

  const onKeyUp = () => {
    clearTimeout(tungguSelesaiMengetik);
    tungguSelesaiMengetik = setTimeout(selesaiTunggu, waktuTunggu);
  };

  const onKeyDown = () => {
    clearTimeout(tungguSelesaiMengetik);
  };

  const selesaiTunggu = () => {
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);

    if (filterSearch !== "") {
      hrefBelakang.set("Search", filterSearch);
    } else {
      hrefBelakang.delete("Search");
    }
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const onChangeTipe = (e) => {
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    if (e.target.value !== "") {
      hrefBelakang.set("Tipe", e.target.value);
    } else {
      hrefBelakang.delete("Tipe");
    }

    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

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

  try {
    semuaAkun = hasil.map((x, index) => {
      return (
        <tr
          key={x.id_kota}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 ? "rgb(255, 77, 79)" : "white",
            color: x.status === 0 ? "white" : "rgb(54,54,54)",
          }}
        >
          <td className="is-vcentered">{index + 1}</td>
          <td className="is-vcentered">{x.tipe + " " + x.nama_kota}</td>
          <td className="is-vcentered">
            {x.status === 1 ? "Aktif" : "Non-Aktif"}
          </td>
          <td className="is-vcentered">
            <Button
              icon={<EditFilled />}
              block
              onClick={() => router.push(`/Supplier/Kota/Edit/${x.id_kota}`)}
            />
            {x.status === 1 ? (
              <Button
                type="primary"
                danger
                block
                onClick={() => changeStatus(x.id_kota, false)}
              >
                Non-Aktifkan
              </Button>
            ) : (
              <Button
                type="primary"
                style={{ backgroundColor: "rgb(72, 199, 142)" }}
                block
                onClick={() => changeStatus(x.id_kota, true)}
              >
                Aktifkan
              </Button>
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

  const clearSearch = () => {
    setFilterSearch("");
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    hrefBelakang.delete("Search");
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const clearTipe = () => {
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    hrefBelakang.delete("Tipe");
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const clearAll = () => {
    setFilterSearch("");
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    hrefBelakang.delete("Search");
    hrefBelakang.delete("Tipe");
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  return (
    <>
      <Head>
        <title>Kota</title>
      </Head>
      <h1 className="title">Kota</h1>
      {/* <Link
        className="button is-link"
        href="Kota/TambahKota"
        style={{ marginBottom: "10px" }}
      >
        Tambah
      </Link> */}
      <div className="field control has-icons-left">
        <label className="label">KAB/KOTA</label>
        <div className="select">
          <select onChange={onChangeTipe} value={dropdown.Tipe}>
            <option value="">KAB. DAN KOTA</option>
            <option value="KAB.">KAB.</option>
            <option value="KOTA">KOTA</option>
          </select>
          <span className="icon is-left">
            <FontAwesomeIcon icon={faCity} />
          </span>
        </div>
      </div>
      <div className="field">
        <label className="label">Search by Name</label>
        <div className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="text"
            value={filterSearch}
            onChange={changeSearch}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
            maxLength="100"
            required
          />
          <span className="icon is-small is-left">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>

      <h1 className="title is-6">{`${hasil.length.toLocaleString(
        "id-ID"
      )} hasil ditemukan`}</h1>

      <div className="field is-grouped is-grouped-multiline">
        {router.query.Search !== undefined && (
          <div className="control">
            <div className="tags has-addons">
              <span className="tag is-medium is-success">
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ marginRight: "5px" }}
                />
                {`"${router.query.Search}"`}
              </span>
              <button
                className="button tag is-medium is-delete"
                onClick={() => clearSearch()}
              />
            </div>
          </div>
        )}
        {router.query.Tipe !== undefined && (
          <div className="control">
            <div className="tags has-addons">
              <span className="tag is-medium is-warning">
                <FontAwesomeIcon icon={faCity} style={{ marginRight: "5px" }} />
                {router.query.Tipe}
              </span>
              <button
                className="button tag is-medium is-delete"
                onClick={() => clearTipe()}
              />
            </div>
          </div>
        )}
        {(router.query.Search !== undefined ||
          router.query.Tipe !== undefined) && (
          <div className="control">
            <div className="tags has-addons">
              <button
                className="button tag is-medium is-rounded is-info is-outlined"
                style={{ fontWeight: "bold" }}
                onClick={() => clearAll()}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      <table className="table has-text-centered is-fullwidth">
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
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 24, width: "50px", height: "50px" }}
        icon={<PlusOutlined />}
        tooltip="Tambah Kota"
        onClick={() => router.push("/Supplier/Kota/TambahKota")}
      />
      <Modal show={modal.isModalClosed === false && "is-active"}>
        {modal.isSuccess === true ? (
          <IsiModalSuccess pesan={modal.pesan}>
            <button
              className="button is-success"
              onClick={() => {
                setModal({ ...modal, isModalClosed: true });
                router.push(router.asPath);
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
                router.push(router.asPath);
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
