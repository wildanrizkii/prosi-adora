import Layout from "../../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../../lib/db";
import Link from "next/link";
import {
  Modal,
  IsiModalFailed,
  IsiModalSuccess,
  Pagination,
} from "../../../../components/AllComponent";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
export default function DaftarItem({ hasil, jumlah, jenis, satuan }) {
  let semuaAkun;

  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });

  const router = useRouter();

  const [filter, setFilter] = useState({
    Search: router.query.Search,
    Jenis: router.query.Jenis !== undefined ? router.query.Jenis : "SEMUA",
    Satuan: router.query.Satuan !== undefined ? router.query.Satuan : "SEMUA",
  });

  const changeSearch = async (e) => {
    setFilter({ ...filter, Search: e.target.value });
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);

    if (e.target.value !== "") {
      hrefBelakang.set("Search", e.target.value);
    } else {
      hrefBelakang.delete("Search");
    }

    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const onChangeJenis = (e) => {
    setFilter({ ...filter, Jenis: e.target.value });
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    if (e.target.value !== "") {
      hrefBelakang.set("Jenis", e.target.value);
    } else {
      hrefBelakang.delete("Jenis");
    }
    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };
  const onChangeSatuan = (e) => {
    setFilter({ ...filter, Satuan: e.target.value });
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    if (e.target.value !== "") {
      hrefBelakang.set("Satuan", e.target.value);
    } else {
      hrefBelakang.delete("Satuan");
    }
    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  async function changeStatus(id, toActive) {
    try {
      let res;
      if (toActive === true) {
        res = await axios.patch("/api/UpdateStatusItem", { id, status: 1 });
      } else if (toActive === false) {
        res = await axios.patch("/api/UpdateStatusItem", { id, status: 0 });
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
  let index = (parseInt(router.query.p) - 1) * 10;
  try {
    semuaAkun = hasil.map((x) => {
      index = index + 1;
      return (
        <tr
          key={x.id_item}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 ? "red" : "white",
            color: x.status === 0 ? "white" : "rgb(54,54,54)",
          }}
        >
          <td className="is-vcentered">{index}</td>
          <td className="is-vcentered">{x.namaItem}</td>
          <td className="is-vcentered">{x.stok}</td>
          <td className="is-vcentered">{x.stok_min}</td>
          <td className="is-vcentered">{x.namaRak}</td>
          <td className="is-vcentered">{x.namaSatuan}</td>
          <td className="is-vcentered">{x.namaJenis}</td>
          <td className="is-vcentered">{x.margin}</td>
          <td className="is-vcentered">
            {x.status === 1 ? "Aktif" : "Non-Aktif"}
          </td>
          <td className="is-vcentered">
            <Link
              href={`/Produk/DaftarItem/Edit/${x.id_item}`}
              className="button is-success is-small"
            >
              Edit
            </Link>
            {x.status === 1 ? (
              <button
                className="button is-danger is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_item, false)}
              >
                Non-Aktifkan
              </button>
            ) : (
              <button
                className="button is-primary is-small"
                style={{ marginLeft: "5px" }}
                onClick={() => changeStatus(x.id_item, true)}
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
        <title>Daftar Item</title>
      </Head>
      <h1 className="title">Daftar Item</h1>

      <div className="field">
        <label className="label">Jenis</label>
        <div className="control">
          <div className="select">
            <select onChange={onChangeJenis} value={filter.Jenis}>
              {jenis.map((el) => {
                return (
                  <option key={el.id_jenis} value={el.id_jenis}>
                    {el.nama}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Satuan</label>
        <div className="control">
          <div className="select">
            <select onChange={onChangeSatuan} value={filter.Satuan}>
              {satuan.map((el) => {
                return (
                  <option key={el.id_satuan} value={el.id_satuan}>
                    {el.nama}
                  </option>
                );
              })}
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
        href="/Produk/DaftarItem/Tambah"
        style={{ marginBottom: "10px" }}
      >
        Tambah
      </Link>

      <table className="table has-text-centered">
        <thead>
          <tr>
            <th className="has-text-centered is-vcentered">No</th>
            <th className="has-text-centered is-vcentered">Nama</th>
            <th className="has-text-centered is-vcentered">Stok</th>
            <th className="has-text-centered is-vcentered">Stok Min</th>
            <th className="has-text-centered is-vcentered">Rak</th>
            <th className="has-text-centered is-vcentered">Satuan</th>
            <th className="has-text-centered is-vcentered">Jenis</th>
            <th className="has-text-centered is-vcentered">Margin</th>
            <th className="has-text-centered is-vcentered">Status</th>
            <th className="has-text-centered is-vcentered">Aksi</th>
          </tr>
        </thead>
        <tbody>{semuaAkun}</tbody>
      </table>
      <Pagination
        href={router.asPath}
        currentPage={router.query.p}
        jumlah={jumlah[0].jumlah}
      />
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
  let query =
    "select id_item,item.nama as namaItem,stok,stok_min,item.status,rak.nama_rak as namaRak,satuan.nama as namaSatuan,jenis.nama as namaJenis,margin " +
    "from item inner join rak on item.id_rak=rak.id_rak inner join satuan on " +
    "satuan.id_satuan=item.id_satuan inner join jenis on jenis.id_jenis=item.id_jenis_item ";

  let query2 =
    "select count(id_item) as jumlah " +
    "from item inner join rak on item.id_rak=rak.id_rak inner join satuan on " +
    "satuan.id_satuan=item.id_satuan inner join jenis on jenis.id_jenis=item.id_jenis_item ";

  const { p, Search, Satuan, Jenis } = context.query;
  if (Search !== undefined || Jenis !== undefined || Satuan !== undefined) {
    query = query + "where ";
    query2 = query2 + "where ";
    if (Search !== undefined) {
      query = query + "item.nama like ?";
      query2 = query2 + "item.nama like ?";
    }
    if (Jenis !== undefined) {
      if (Search === undefined) {
        query = query + " jenis.id_jenis=?";
        query2 = query2 + " jenis.id_jenis=?";
      } else {
        query = query + " and jenis.id_jenis=?";
        query2 = query2 + " and jenis.id_jenis=?";
      }
    }
    if (Satuan !== undefined) {
      if (Search !== undefined || Jenis !== undefined) {
        query = query + " and satuan.id_satuan=?";
        query2 = query2 + " and satuan.id_satuan=?";
      } else {
        query = query + " satuan.id_satuan=?";
        query2 = query2 + " satuan.id_satuan=?";
      }
    }
  }

  query = query + " order by id_item LIMIT ?,10";
  const values = [];
  if (Search !== undefined) {
    values.push("%" + Search + "%");
  }
  if (Jenis !== undefined) {
    values.push(Jenis);
  }
  if (Satuan !== undefined) {
    values.push(Satuan);
  }
  values.push((parseInt(p) - 1) * 10);

  // ----------------------------------------------------------
  const queryJenis = "select id_jenis,nama from jenis";
  const querySatuan = "select id_satuan,nama from satuan";

  try {
    const getData = await handlerQuery({ query, values });
    const hasil = JSON.parse(JSON.stringify(getData));
    const getJumlah = await handlerQuery({ query: query2, values });
    const jumlah = JSON.parse(JSON.stringify(getJumlah));
    const getJenis = await handlerQuery({ query: queryJenis, values: [] });
    const jenis = JSON.parse(JSON.stringify(getJenis));
    jenis.unshift({ id_jenis: "", nama: "SEMUA" });
    const getSatuan = await handlerQuery({ query: querySatuan, values: [] });
    const satuan = JSON.parse(JSON.stringify(getSatuan));
    satuan.unshift({ id_satuan: "", nama: "SEMUA" });

    return {
      props: {
        hasil,
        jumlah,
        jenis,
        satuan,
      },
    };
  } catch (e) {
    return {
      props: {
        hasil: e.message,
        jumlah: [{ jumlah: 1 }],
        jenis: [{ id_jenis: "", nama: "" }],
        satuan: [{ id_satuan: "", nama: "" }],
      },
    };
  }
}

DaftarItem.getLayout = function getLayout(page) {
  return <Layout clicked="Daftar Item">{page}</Layout>;
};
