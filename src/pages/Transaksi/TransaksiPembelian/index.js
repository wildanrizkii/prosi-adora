import Layout from "../../../../components/Layout";
import Head from "next/head";
import Link from "next/link";
import handlerQuery from "../../../../lib/db";
import { useState } from "react";
import { useRouter } from "next/router";
import { Pagination } from "../../../../components/AllComponent";

import { DatePicker, ConfigProvider } from "antd";
import idID from "antd/locale/id_ID";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Modal } from "../../../../components/AllComponent";
import axios from "axios";
const { RangePicker } = DatePicker;
export default function TransaksiPembelian({
  hasil,
  sum,
  user,
  jumlah,
  supplier,
}) {
  let semuaData;
  const router = useRouter();
  const [filter, setFilter] = useState({
    User: router.query.User !== undefined ? router.query.User : "",
    Search: router.query.Search,
    Supplier: router.query.Supplier,
    Tanggal:
      router.query.Awal !== undefined
        ? [dayjs(router.query.Awal), dayjs(router.query.Akhir)]
        : null,
  });

  const [isModalOpened, setModal] = useState(false);
  const [isiModal, setIsiModal] = useState("");
  const onClickDetail = async (faktur) => {
    try {
      const res = await axios.get("/api/GetDetailPembelian?faktur=" + faktur);
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
          <td colSpan="4">{masukan}</td>
        </tr>
      );
    } else {
      const semua = masukan.map((x, index) => {
        return (
          <tr
            key={x.no_detail_pembelian}
            style={{
              fontWeight: "bold",
            }}
          >
            <td>{index + 1}</td>
            <td>{x.nama}</td>
            <td>{x.jumlah}</td>
            <td>{x.namaSatuan}</td>
            <td>{x.harga_per_satuan}</td>
            <td>{x.subtotal}</td>
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
  const onChangeSupplier = (e) => {
    setFilter({ ...filter, Supplier: e.target.value });
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);
    if (e.target.value !== "") {
      hrefBelakang.set("Supplier", e.target.value);
    } else {
      hrefBelakang.delete("Supplier");
    }
    hrefBelakang.set("p", 1);
    router.push(hrefDepan + "?" + hrefBelakang);
  };

  function readableDate(input) {
    const output = new Date(input);
    const tanggal = output.getDate();
    let bulan;
    switch (output.getMonth()) {
      case 0:
        bulan = "Januari";
        break;
      case 1:
        bulan = "Februari";
        break;
      case 2:
        bulan = "Maret";
        break;
      case 3:
        bulan = "April";
        break;
      case 4:
        bulan = "Mei";
        break;
      case 5:
        bulan = "Juni";
        break;
      case 6:
        bulan = "Juli";
        break;
      case 7:
        bulan = "Agustus";
        break;
      case 8:
        bulan = "September";
        break;
      case 9:
        bulan = "Oktober";
        break;
      case 10:
        bulan = "November";
        break;
      case 11:
        bulan = "Desember";
        break;
    }

    let hari;
    switch (output.getDay()) {
      case 0:
        hari = "Minggu";
        break;
      case 1:
        hari = "Senin";
        break;
      case 2:
        hari = "Selasa";
        break;
      case 3:
        hari = "Rabu";
        break;
      case 4:
        hari = "Kamis";
        break;
      case 5:
        hari = "Jumat";
        break;
      case 6:
        hari = "Sabtu";
    }
    const tahun = output.getFullYear();

    const hasil = hari + " " + tanggal + " " + " " + bulan + " " + tahun;
    return hasil;
  }
  try {
    semuaData = hasil.map((x, index) => {
      return (
        <tr key={x.no_faktur} style={{ fontWeight: "bold" }}>
          <td>{index + 1}</td>
          <td>{x.no_faktur}</td>
          <td>{readableDate(x.tanggal)}</td>
          <td>{x.margin}</td>
          <td>{x.username}</td>
          <td>{x.kode_supplier}</td>
          <td>
            <button
              className="button is-success"
              onClick={() => onClickDetail(x.no_faktur)}
            >
              Detail
            </button>
          </td>
          <td>{x.total}</td>
        </tr>
      );
    });
  } catch (e) {
    semuaData = (
      <tr>
        <td colSpan="6">{hasil}</td>
      </tr>
    );
  }
  return (
    <>
      <Head>
        <title>Transaksi Pembelian</title>
      </Head>
      <h1 className="title">Transaksi Pembelian</h1>
      <Link href="/Transaksi/TransaksiPembelian/StokMin">
        Daftar Item yang dibawah stok minimum {""}
        <i className="fas fa-arrow-right" style={{ marginLeft: "5px" }} />
      </Link>
      <br />
      <Link
        className="button is-link"
        href="/Transaksi/TransaksiPembelian/Tambah"
        style={{ marginBottom: "10px", marginTop: "10px" }}
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
        <label className="label">Supplier</label>
        <div className="control">
          <div className="select">
            <select onChange={onChangeSupplier} value={filter.Supplier}>
              {supplier.map((el) => {
                return (
                  <option key={el.id_supplier} value={el.id_supplier}>
                    {el.kode_supplier}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Tanggal</label>
        <ConfigProvider locale={idID.default}>
          <RangePicker
            onChange={onChangeDate}
            size="large"
            format="DD-MM-YYYY"
            value={filter.Tanggal}
          />
        </ConfigProvider>
      </div>

      <div className="field">
        <label className="label">Search by No Faktur</label>
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
            <i className="fas fa-search"></i>
          </span>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>No Faktur</th>
            <th>Tanggal</th>
            <th>Margin</th>
            <th>User</th>
            <th>Supplier</th>
            <th>Detail</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>{semuaData}</tbody>
      </table>
      <div className="field">
        <p style={{ fontWeight: "bolder" }}>Total : {sum[0].sumTotal || 0}</p>
      </div>
      <Pagination
        href={router.asPath}
        currentPage={router.query.p}
        jumlah={jumlah[0].jumlah}
      />
      <Modal show={isModalOpened === true && "is-active"}>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Detail Pembelian</p>
            <button
              type="button"
              className="delete"
              aria-label="close"
              onClick={() => {
                setModal(false);
              }}
            />
          </header>
          <section className="modal-card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Item</th>
                  <th>Jumlah</th>
                  <th>Satuan</th>
                  <th>Harga Per Satuan</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>{changeToHTML(isiModal)}</tbody>
            </table>
          </section>
        </div>
      </Modal>
    </>
  );
}

export async function getServerSideProps(context) {
  let query =
    "select no_faktur,tanggal,margin,user.username,supplier.kode_supplier,total " +
    "from transaksi_pembelian inner join user on transaksi_pembelian.idUser = user.idUser " +
    "inner join supplier on transaksi_pembelian.id_supplier=supplier.id_supplier ";

  let queryTotal =
    "select sum(total) as sumTotal " +
    "from transaksi_pembelian inner join user on transaksi_pembelian.idUser = user.idUser " +
    "inner join supplier on transaksi_pembelian.id_supplier=supplier.id_supplier ";

  let queryJumlah =
    "select count(no_faktur) as jumlah " +
    "from transaksi_pembelian inner join user on transaksi_pembelian.idUser = user.idUser " +
    "inner join supplier on transaksi_pembelian.id_supplier=supplier.id_supplier ";

  const { p, User, Search, Awal, Akhir, Supplier } = context.query;

  if (
    Search !== undefined ||
    User !== undefined ||
    Awal !== undefined ||
    Akhir !== undefined ||
    Supplier !== undefined
  ) {
    query = query + "where ";
    queryTotal = queryTotal + "where ";
    queryJumlah = queryJumlah + "where ";
    if (Search !== undefined) {
      query = query + " no_faktur like ?";
      queryTotal = queryTotal + " no_faktur like ?";
      queryJumlah = queryJumlah + " no_faktur like ?";
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
    if (Supplier !== undefined) {
      if (Search !== undefined || User !== undefined) {
        query = query + " and supplier.id_supplier=?";
        queryTotal = queryTotal + " and supplier.id_supplier=?";
        queryJumlah = queryJumlah + " and supplier.id_supplier=?";
      } else {
        query = query + " supplier.id_supplier=?";
        queryTotal = queryTotal + " supplier.id_supplier=?";
        queryJumlah = queryJumlah + " supplier.id_supplier=?";
      }
    }
    if (Awal !== undefined) {
      if (
        Search !== undefined ||
        User !== undefined ||
        Supplier !== undefined
      ) {
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
  if (Supplier !== undefined) {
    values.push(Supplier);
  }
  if (Awal !== undefined) {
    values.push(Awal);
    values.push(Akhir);
  }
  values.push((parseInt(p) - 1) * 10);

  const queryUser = "select idUser,username from user";
  const querySupp = "select id_supplier,kode_supplier from supplier";

  try {
    const getData = await handlerQuery({ query, values });
    const hasil = JSON.parse(JSON.stringify(getData));
    const getSum = await handlerQuery({ query: queryTotal, values });
    const sum = JSON.parse(JSON.stringify(getSum));
    const getUser = await handlerQuery({ query: queryUser, values: [] });
    const user = JSON.parse(JSON.stringify(getUser));
    user.unshift({ idUser: "", username: "SEMUA" });
    const getSupp = await handlerQuery({ query: querySupp, values: [] });
    const supplier = JSON.parse(JSON.stringify(getSupp));
    supplier.unshift({ id_supplier: "", kode_supplier: "SEMUA" });
    const getJumlah = await handlerQuery({ query: queryJumlah, values });
    const jumlah = JSON.parse(JSON.stringify(getJumlah));
    return {
      props: {
        hasil,
        jumlah,
        sum,
        user,
        supplier,
      },
    };
  } catch (e) {
    return {
      props: {
        hasil: e.message,
        jumlah: [{ jumlah: 1 }],
        sum: [{ sumTotal: 0 }],
        user: [{ idUser: "", username: "" }],
        supplier: [{ id_supplier: "", kode_supplier: "" }],
      },
    };
  }
}

TransaksiPembelian.getLayout = function getLayout(page) {
  return <Layout clicked="Transaksi Pembelian">{page}</Layout>;
};
