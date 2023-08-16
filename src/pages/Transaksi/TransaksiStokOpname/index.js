import Layout from "../../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../../lib/db";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
import "dayjs/locale/id";
import {
  Pagination,
  Modal,
  readableDate,
} from "../../../../components/AllComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
export default function TransaksiStokOpname({ hasil, jumlah, user }) {
  let semuaData;
  const router = useRouter();
  const [filter, setFilter] = useState({
    User: router.query.User !== undefined ? router.query.User : "",
    Search: router.query.Search,
    Tanggal:
      router.query.Awal !== undefined && router.query.Akhir !== undefined
        ? [dayjs(router.query.Awal), dayjs(router.query.Akhir)]
        : null,
  });
  const [isModalOpened, setModal] = useState(false);
  const [isiModal, setIsiModal] = useState("");
  const onClickDetail = async (no_opname) => {
    try {
      const res = await axios.get("/api/GetDetailOpname?opname=" + no_opname);
      setIsiModal(res.data);
    } catch (e) {
      setIsiModal(e.response.data);
    }
    setModal(true);
  };

  const changeToHTML = (masukan) => {
    if (typeof masukan === "string") {
      return (
        <tr>
          <td colSpan="6" className="is-vcentered">
            {masukan}
          </td>
        </tr>
      );
    } else {
      const semua = masukan.map((x, index) => {
        return (
          <tr key={x.no_detail_opname} style={{ fontWeight: "bold" }}>
            <td className="is-vcentered">{index + 1}</td>
            <td className="is-vcentered">{x.nama}</td>
            <td className="is-vcentered">{x.stok_sistem}</td>
            <td className="is-vcentered">{x.stok_fisik}</td>
            <td className="is-vcentered">{x.namaSatuan}</td>
            <td className="is-vcentered">{x.selisih}</td>
          </tr>
        );
      });
      return semua;
    }
  };
  const onChangeDate = (date, dateString) => {
    setFilter({ ...filter, Tanggal: date });
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    if (Array.isArray(date)) {
      const tanggalinput1 = new Date(date[0]);
      const tanggalinput2 = new Date(date[1]);
      const tanggalOutput1 =
        tanggalinput1.getFullYear() +
        "-" +
        (tanggalinput1.getMonth() + 1) +
        "-" +
        tanggalinput1.getDate();
      const tanggalOutput2 =
        tanggalinput2.getFullYear() +
        "-" +
        (tanggalinput2.getMonth() + 1) +
        "-" +
        tanggalinput2.getDate();
      hrefBelakang.set("Awal", tanggalOutput1);
      hrefBelakang.set("Akhir", tanggalOutput2);
    } else {
      hrefBelakang.delete("Awal");
      hrefBelakang.delete("Akhir");
    }
    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang);
  };
  const onChangeSearch = (e) => {
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
    router.push(hrefDepan + "?" + hrefBelakang);
  };
  const onChangeUser = (e) => {
    setFilter({ ...filter, User: e.target.value });
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    if (e.target.value !== "") {
      hrefBelakang.set("User", e.target.value);
    } else {
      hrefBelakang.delete("User");
    }
    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang);
  };

  let index = (parseInt(router.query.p) - 1) * 10;
  try {
    semuaData = hasil.map((x) => {
      index = index + 1;
      return (
        <tr key={x.no_opname} style={{ fontWeight: "bold" }}>
          <td className="is-vcentered">{index}</td>
          <td className="is-vcentered">{x.no_opname}</td>
          <td className="is-vcentered">{readableDate(x.tanggal)}</td>
          <td className="is-vcentered">{x.username}</td>
          <td className="is-vcentered">
            <button
              className="button is-success"
              onClick={() => onClickDetail(x.no_opname)}
            >
              Detail
            </button>
          </td>
        </tr>
      );
    });
  } catch (e) {
    semuaData = (
      <tr>
        <td colSpan="5" className="is-vcentered">
          {hasil}
        </td>
      </tr>
    );
  }
  return (
    <>
      <Head>
        <title>Transaksi Stok Opname</title>
      </Head>
      <h1 className="title">Transaksi Stok Opname</h1>
      <Link
        className="button is-link"
        href="/Transaksi/TransaksiStokOpname/Tambah"
        style={{ marginBottom: "10px" }}
      >
        Tambah
      </Link>

      <div className="field">
        <label className="label">User</label>
        <div className="control">
          <div className="select">
            <select onChange={onChangeUser} value={filter.User}>
              {user.map((el) => {
                return (
                  <option key={el.idUser} value={el.idUser}>
                    {el.username}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Tanggal</label>
        <RangePicker
          onChange={onChangeDate}
          size="large"
          format="DD-MM-YYYY"
          value={filter.Tanggal}
        />
      </div>
      <div className="field">
        <label className="label">Search by No Opname</label>
        <div className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="text"
            value={filter.Search}
            onChange={onChangeSearch}
            maxLength="100"
            required
          />
          <span className="icon is-small is-left">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>
      <table className="table has-text-centered">
        <thead>
          <tr>
            <th className="has-text-centered is-vcentered">No</th>
            <th className="has-text-centered is-vcentered">No Opname</th>
            <th className="has-text-centered is-vcentered">Tanggal</th>
            <th className="has-text-centered is-vcentered">User</th>
            <th className="has-text-centered is-vcentered">Detail</th>
          </tr>
        </thead>
        <tbody>{semuaData}</tbody>
      </table>
      <Pagination
        href={router.asPath}
        currentPage={router.query.p}
        jumlah={jumlah[0].jumlah}
      />
      <Modal show={isModalOpened === true && "is-active"}>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Detail</p>
            <button
              type="button"
              className="delete"
              aria-label="close"
              onClick={() => setModal(false)}
            />
          </header>
          <section className="modal-card-body">
            <table className="table has-text-centered">
              <thead>
                <tr>
                  <th className="has-text-centered is-vcentered">No</th>
                  <th className="has-text-centered is-vcentered">Nama Item</th>
                  <th className="has-text-centered is-vcentered">
                    Stok Sistem
                  </th>
                  <th className="has-text-centered is-vcentered">Stok Fisik</th>
                  <th className="has-text-centered is-vcentered">Satuan</th>
                  <th className="has-text-centered is-vcentered">Selisih</th>
                </tr>
              </thead>
              <tbody>{changeToHTML(isiModal)}</tbody>
            </table>
          </section>
          <footer className="modal-card-foot"></footer>
        </div>
      </Modal>
    </>
  );
}

export async function getServerSideProps(context) {
  let query =
    "select no_opname,tanggal,user.username " +
    "from transaksi_stok_opname inner join user on transaksi_stok_opname.idUser=user.idUser ";

  let queryJumlah =
    "select count(no_opname) as jumlah " +
    "from transaksi_stok_opname inner join user on transaksi_stok_opname.idUser=user.idUser ";

  const { p, User, Search, Awal, Akhir } = context.query;

  if (
    Search !== undefined ||
    User !== undefined ||
    (Awal !== undefined && Akhir !== undefined)
  ) {
    query = query + "where ";
    queryJumlah = queryJumlah + "where ";
    if (Search !== undefined) {
      query = query + " no_opname like ?";
      queryJumlah = queryJumlah + " no_opname like ?";
    }
    if (User !== undefined) {
      if (Search === undefined) {
        query = query + " user.idUser=?";
        queryJumlah = queryJumlah + " user.idUser=?";
      } else {
        query = query + " and user.idUser=?";
        queryJumlah = queryJumlah + " and user.idUser=?";
      }
    }
    if (Awal !== undefined && Akhir !== undefined) {
      if (Search !== undefined || User !== undefined) {
        query = query + " and tanggal between ? and ?";
        queryJumlah = queryJumlah + " and tanggal between ? and ?";
      } else {
        query = query + " tanggal between ? and ?";
        queryJumlah = queryJumlah + " tanggal between ? and ?";
      }
    }
  }

  query = query + " order by tanggal LIMIT ?,10";
  const values = [];

  if (Search !== undefined) {
    values.push("%" + Search + "%");
  }
  if (User !== undefined) {
    values.push(User);
  }
  if (Awal !== undefined && Akhir !== undefined) {
    values.push(Awal);
    values.push(Akhir);
  }
  values.push((parseInt(p) - 1) * 10);

  const queryUser = "select idUser,username from user";

  try {
    const getData = await handlerQuery({ query, values });
    const hasil = JSON.parse(JSON.stringify(getData));
    const getJumlah = await handlerQuery({ query: queryJumlah, values });
    const jumlah = JSON.parse(JSON.stringify(getJumlah));
    const getUser = await handlerQuery({ query: queryUser, values: [] });
    const user = JSON.parse(JSON.stringify(getUser));
    user.unshift({ idUser: "", username: "SEMUA" });
    return {
      props: {
        hasil,
        jumlah,
        user,
      },
    };
  } catch (e) {
    return {
      props: {
        hasil: e.message,
        jumlah: [{ jumlah: 1 }],
        user: [{ idUser: "", username: "" }],
      },
    };
  }
}

TransaksiStokOpname.getLayout = function getLayout(page) {
  return <Layout clicked="Transaksi Stok Opname">{page}</Layout>;
};
