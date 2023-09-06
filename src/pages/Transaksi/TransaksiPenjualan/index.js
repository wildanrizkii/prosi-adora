import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import Head from "next/head";
import { useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import handlerQuery from "../../../../lib/db";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import "dayjs/locale/id";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Pagination,
  Modal,
  readableDate,
  rupiah,
} from "../../../../components/AllComponent";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function TransaksiPenjualan({ hasil, sum, user, jumlah }) {
  let semuaData;
  const router = useRouter();
  // const [filter, setFilter] = useState({
  //   User: router.query.User !== undefined ? router.query.User : "",
  //   Search: router.query.Search !== undefined ? router.query.Search : "",
  //   Tanggal:
  //     router.query.Awal !== undefined && router.query.Akhir !== undefined
  //       ? [dayjs(router.query.Awal), dayjs(router.query.Akhir)]
  //       : null,
  // });

  const [filterSearch, setFilterSearch] = useState(
    router.query.Search !== undefined ? router.query.Search : ""
  );

  const [filterTanggal, setFilterTanggal] = useState(
    router.query.Awal !== undefined && router.query.Akhir !== undefined
      ? [dayjs(router.query.Awal), dayjs(router.query.Akhir)]
      : null
  );

  const dropdown = {
    User: router.query.User !== undefined ? router.query.User : "",
  };

  let tunggulSelesaiMengetik;
  let waktuTunggu = 1000;

  const changeSearch = (e) => {
    setFilterSearch(e.target.value);
  };

  const onKeyUp = () => {
    clearTimeout(tunggulSelesaiMengetik);
    tunggulSelesaiMengetik = setTimeout(selesaiTunggu, waktuTunggu);
  };

  const onKeyDown = () => {
    clearTimeout(tunggulSelesaiMengetik);
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

    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const [isModalOpened, setModal] = useState(false);
  const [isiModal, setIsiModal] = useState("");
  const onClickDetail = async (no_transaksi) => {
    try {
      const res = await axios.get("/api/GetDetailPenjualan?no=" + no_transaksi);
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
          <td className="is-vcentered" colSpan="8">
            {masukan}
          </td>
        </tr>
      );
    } else {
      const semua = masukan.map((x, index) => {
        return (
          <tr key={x.no_detail_penjualan} style={{ fontWeight: "bold" }}>
            <td className="is-vcentered">{index + 1}</td>
            <td className="is-vcentered">{x.namaItem}</td>
            <td className="is-vcentered">{x.namaJenis}</td>
            <td className="is-vcentered">{x.jumlah}</td>
            <td className="is-vcentered">{x.namaSatuan}</td>
            <td className="is-vcentered">
              {rupiah.format(x.harga_per_satuan)}
            </td>
            <td className="is-vcentered">{rupiah.format(x.subtotal)}</td>
            <td className="is-vcentered">{x.jenis_pelanggan}</td>
          </tr>
        );
      });
      return semua;
    }
  };
  const onChangeDate = (date, dateString) => {
    setFilterTanggal(date);
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    if (Array.isArray(date)) {
      const tanggalOutput1 = dayjs(date[0]).format("YYYY-MM-DD");
      const tanggalOutput2 = dayjs(date[1]).format("YYYY-MM-DD");
      hrefBelakang.set("Awal", tanggalOutput1);
      hrefBelakang.set("Akhir", tanggalOutput2);
    } else {
      hrefBelakang.delete("Awal");
      hrefBelakang.delete("Akhir");
    }
    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang);
  };
  const onChangeUser = (e) => {
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
        <tr key={x.no_transaksi} style={{ fontWeight: "bold" }}>
          <td className="is-vcentered">{index}</td>
          <td className="is-vcentered">{x.no_transaksi}</td>
          <td className="is-vcentered">{readableDate(x.tanggal)}</td>
          <td className="is-vcentered">{x.username}</td>
          <td className="is-vcentered">{rupiah.format(x.biaya_racik)}</td>
          <td className="is-vcentered">{rupiah.format(x.diskon)}</td>
          <td className="is-vcentered">
            <button
              className="button is-success"
              onClick={() => onClickDetail(x.no_transaksi)}
            >
              Detail
            </button>
          </td>
          <td className="is-vcentered">{rupiah.format(x.total)}</td>
        </tr>
      );
    });
  } catch (e) {
    semuaData = (
      <tr>
        <td colSpan="8" className="is-vcentered">
          {hasil}
        </td>
      </tr>
    );
  }

  const userDipilih = user.filter(
    (el) => parseInt(el.idUser) === parseInt(router.query.User)
  )[0];

  const tanggalDipilih =
    filterTanggal !== null
      ? `${dayjs(filterTanggal[0]).format("DD-MM-YYYY")} sampai ${dayjs(
          filterTanggal[1]
        ).format("DD-MM-YYYY")}`
      : "";

  const clearUser = () => {
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    hrefBelakang.delete("User");
    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const clearSearch = () => {
    setFilterSearch("");
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    hrefBelakang.delete("Search");
    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const clearTanggal = () => {
    setFilterTanggal(null);
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    hrefBelakang.delete("Awal");
    hrefBelakang.delete("Akhir");
    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const clearAll = () => {
    setFilterSearch("");
    setFilterTanggal(null);
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    hrefBelakang.delete("Search");
    hrefBelakang.delete("Awal");
    hrefBelakang.delete("Akhir");
    hrefBelakang.delete("User");
    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  return (
    <>
      <Head>
        <title>Transaksi Penjualan</title>
      </Head>
      <h1 className="title">Transaksi Penjualan</h1>

      <div className="field">
        <label className="label">User</label>
        <div className="control">
          <div className="select">
            <select onChange={onChangeUser} value={dropdown.User}>
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
          value={filterTanggal}
        />
      </div>

      <div className="field">
        <label className="label">Search by No Transaksi Penjualan</label>
        <div className="control has-icons-left has-icons right">
          <input
            type="text"
            className="input"
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
      <h1 className="title is-6">{`${jumlah[0].jumlah.toLocaleString(
        "id-ID"
      )} hasil ditemukan`}</h1>

      <div className="field is-grouped is-grouped-multiline">
        {router.query.Search !== undefined && (
          <div className="control">
            <span
              className="tag is-medium is-rounded"
              style={{ backgroundColor: "white", fontWeight: "bold" }}
            >
              {`hasil "${router.query.Search}"`}
              <button className="delete" onClick={() => clearSearch()} />
            </span>
          </div>
        )}
        {router.query.User !== undefined && (
          <div className="control">
            <div className="tags has-addons">
              <span className="tag is-medium is-link">
                {userDipilih.username}
              </span>
              <button
                className="button tag is-medium is-delete"
                onClick={() => clearUser()}
              />
            </div>
          </div>
        )}
        {router.query.Awal !== undefined &&
          router.query.Akhir !== undefined && (
            <div className="control">
              <div className="tags has-addons">
                <span className="tag is-medium is-link">{tanggalDipilih}</span>
                <button
                  className="button tag is-medium is-delete"
                  onClick={() => clearTanggal()}
                />
              </div>
            </div>
          )}
        {(router.query.Search !== undefined ||
          router.query.User !== undefined ||
          (router.query.Awal !== undefined &&
            router.query.Akhir !== undefined)) && (
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
            <th className="has-text-centered is-vcentered">
              No Transaksi Penjualan
            </th>
            <th className="has-text-centered is-vcentered">Tanggal</th>
            <th className="has-text-centered is-vcentered">User</th>
            <th className="has-text-centered is-vcentered">Biaya Racik</th>
            <th className="has-text-centered is-vcentered">Diskon</th>
            <th className="has-text-centered is-vcentered">Detail</th>
            <th className="has-text-centered is-vcentered">Total</th>
          </tr>
        </thead>
        <tbody>{semuaData}</tbody>
      </table>
      <div className="field">
        <p style={{ fontWeight: "bolder" }}>
          Total : {rupiah.format(sum[0].sumTotal || 0)}
        </p>
      </div>

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
                  <th className="has-text-centered is-vcentered">Nama Jenis</th>
                  <th className="has-text-centered is-vcentered">Jumlah</th>
                  <th className="has-text-centered is-vcentered">Satuan</th>
                  <th className="has-text-centered is-vcentered">
                    Harga Per Satuan
                  </th>
                  <th className="has-text-centered is-vcentered">Subtotal</th>
                  <th className="has-text-centered is-vcentered">
                    Jenis Pelanggan
                  </th>
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
    "select no_transaksi,tanggal,total,biaya_racik,diskon,user.username " +
    "from transaksi_penjualan inner join user on transaksi_penjualan.idUser=user.idUser ";

  let queryTotal =
    "select sum(total) as sumTotal " +
    "from transaksi_penjualan inner join user on transaksi_penjualan.idUser=user.idUser ";
  let queryJumlah =
    "select count(no_transaksi) as jumlah " +
    "from transaksi_penjualan inner join user on transaksi_penjualan.idUser=user.idUser ";

  const { p, User, Search, Awal, Akhir } = context.query;

  if (
    Search !== undefined ||
    User !== undefined ||
    (Awal !== undefined && Akhir !== undefined)
  ) {
    query = query + "where ";
    queryTotal = queryTotal + "where ";
    queryJumlah = queryJumlah + "where ";
    if (Search !== undefined) {
      query = query + " no_transaksi like ?";
      queryTotal = queryTotal + " no_transaksi like ?";
      queryJumlah = queryJumlah + " no_transaksi like ?";
    }
    if (User !== undefined) {
      if (Search === undefined) {
        query = query + " user.idUser=?";
        queryTotal = queryTotal + " user.idUser=?";
        queryJumlah = queryJumlah + " user.idUser=?";
      } else {
        query = query + " and user.idUser=?";
        queryTotal = queryTotal + " and user.idUser=?";
        queryJumlah = queryJumlah + " and user.idUser=?";
      }
    }
    if (Awal !== undefined && Akhir !== undefined) {
      if (Search !== undefined || User !== undefined) {
        query = query + " and tanggal between ? and ?";
        queryTotal = queryTotal + " and tanggal between ? and ?";
        queryJumlah = queryJumlah + " and tanggal between ? and ?";
      } else {
        query = query + " tanggal between ? and ?";
        queryTotal = queryTotal + " tanggal between ? and ?";
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
    const getSum = await handlerQuery({ query: queryTotal, values });
    const sum = JSON.parse(JSON.stringify(getSum));
    const getUser = await handlerQuery({ query: queryUser, values: [] });
    const user = JSON.parse(JSON.stringify(getUser));
    user.unshift({ idUser: "", username: "SEMUA" });
    const getJumlah = await handlerQuery({ query: queryJumlah, values });
    const jumlah = JSON.parse(JSON.stringify(getJumlah));
    return {
      props: {
        hasil,
        sum,
        user,
        jumlah,
      },
    };
  } catch (e) {
    return {
      props: {
        hasil: e.message,
        jumlah: [{ jumlah: 1 }],
        sum: [{ sumTotal: 0 }],
        user: [{ idUser: "", username: "" }],
      },
    };
  }
}

TransaksiPenjualan.getLayout = function getLayout(page) {
  return <Layout clicked="Transaksi Penjualan">{page}</Layout>;
};
