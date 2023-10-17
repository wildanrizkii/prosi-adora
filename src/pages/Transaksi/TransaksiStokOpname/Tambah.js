import Head from "next/head";
import Layout from "../../../../components/Layout";
import {
  Field,
  Modal,
  IsiModalFailed,
  IsiModalSuccess,
  Pagination,
  readableDate,
} from "../../../../components/AllComponent";
import { useState } from "react";
import { Select } from "antd";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import handlerQuery from "../../../../lib/db";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { NumericFormat } from "react-number-format";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/id";

export default function Tambah({ dataRak, item, jumlah, time_stamp }) {
  console.log(item);
  let semuaAkun;
  const [field, setField] = useState({
    "No Opname": "",
    "No Opname Checked": false,
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });
  const router = useRouter();

  const { Rak } = router.query;
  const isi = Array.isArray(Rak)
    ? Rak.map((x) => {
        return parseInt(x);
      })
    : [parseInt(Rak)];

  const [rak, setRak] = useState(router.query.Rak !== undefined ? isi : []);

  const { data: session, status } = useSession({ required: true });
  const idUser = status === "authenticated" && session.user.idUser;

  const [detail, setDetail] = useState([]);

  const submit = field["No Opname Checked"] === true && detail.length > 0;

  const onChangeNoOpname = async (NoOpname) => {
    if (NoOpname === "") {
      return "default";
    }
    const res = await axios.post("/api/CheckNoOpname", {
      NoOpname,
    });
    return res.data;
  };
  const onSelectRak = async (value) => {
    setRak([...rak, value]);
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);

    hrefBelakang.append("Rak", value);
    hrefBelakang.set("p", 1);

    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const onDeselectRak = (value) => {
    const duplikat = [...rak];
    const idxRakHapus = duplikat.indexOf(value);
    duplikat.splice(idxRakHapus, 1);
    setRak(duplikat);

    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);

    // hrefBelakang.delete("Rak", value.toString());
    const simpan = hrefBelakang.getAll("Rak");
    hrefBelakang.delete("Rak");
    const idx = simpan.indexOf(value.toString());

    simpan.splice(idx, 1);

    for (let i = 0; i < simpan.length; i++) {
      hrefBelakang.append("Rak", simpan[i]);
    }
    hrefBelakang.set("p", 1);

    router.push(hrefDepan + "?" + hrefBelakang.toString());
    // router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const onChangeRak = (value) => {
    setRak(value);
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);

    hrefBelakang.append("Rak", 1);
    hrefBelakang.append("Rak", 2);

    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };
  const onClear = (value) => {
    setDetail([]);
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);

    hrefBelakang.set("p", 1);
    hrefBelakang.delete("Rak");

    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };
  const onChangeJumlah = (index, stokFisik) => {
    const arrBaru = [...item];

    const hasil = {
      ...arrBaru[index],
      stok_fisik: stokFisik,
    };
    arrBaru[index] = hasil;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/TambahTransaksiOpname", {
        No_Opname: field["No Opname"],
        Id_User: idUser,
        detail,
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

  const filterOption = (input, option) =>
    (option?.nama_rak ?? "").toLowerCase().includes(input.toLowerCase());

  const simpanSementara = async (id_item, idUser, stok_fisik) => {
    if (stok_fisik !== null && stok_fisik !== undefined) {
      try {
        const res = await axios.post("/api/TambahDetailOpnameSementara", {
          id_item,
          idUser,
          stok_fisik,
        });
        router.push(router.asPath);
        openNotificationWithIcon("success", "Sukses", res.data);
      } catch (e) {
        openNotificationWithIcon("error", "Gagal", e.response.data);
      }
    } else {
      openNotificationWithIcon(
        "warning",
        "Gagal",
        "Stok Fisik tidak bisa dikosongkan"
      );
    }
  };
  const updateSementara = async (id_item, idUser, stok_fisik) => {
    if (stok_fisik !== null && stok_fisik !== undefined) {
      try {
        const res = await axios.patch("/api/TambahDetailOpnameSementara", {
          id_item,
          idUser,
          stok_fisik,
        });
        router.push(router.asPath);
        openNotificationWithIcon("success", "Sukses", res.data);
      } catch (e) {
        openNotificationWithIcon("error", "Gagal", e.response.data);
      }
    } else {
      openNotificationWithIcon(
        "warning",
        "Gagal",
        "Stok Fisik tidak bisa dikosongkan"
      );
    }
  };
  const ubahStatusStokFisik = (index) => {
    const arr = [...detail];
    arr[index].status_stok_fisik = 2;
    setDetail(arr);
  };
  const contentStatus_0 = (
    <div>
      <p>Tekan Enter atau klik Simpan untuk menyimpan</p>
    </div>
  );
  const contentStatus_2 = (
    <div>
      <p>Tekan Enter atau klik Simpan untuk menyimpan</p>
      <p>Tekan Esc untuk membatalkan</p>
    </div>
  );

  let index = (parseInt(router.query.p) - 1) * 10;
  try {
    semuaAkun = detail.map((x, i) => {
      index = index + 1;
      return (
        <tr
          key={x.id_item}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 ? "rgb(255, 77, 79)" : "white",
            color: x.status === 0 ? "white" : "rgb(54,54,54)",
          }}
        >
          <td className="is-vcentered">{index}</td>
          <td className="is-vcentered">{x.nama_rak}</td>
          <td className="is-vcentered">{x.nama}</td>
          <td className="is-vcentered">{x.nama_jenis}</td>
          <td className="is-vcentered">{x.nama_satuan}</td>
          <td className="is-vcentered">{x.stok}</td>
          <td className="is-vcentered">
            {x.stok_fisik !== null ? (
              x.stok_fisik
            ) : (
              <NumericFormat
                allowNegative={false}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                className="input has-text-centered"
                value={x.stok_fisik}
                onValueChange={(value) => {
                  onChangeJumlah(value.floatValue, index);
                }}
                isAllowed={(values) =>
                  values.floatValue === undefined || values.floatValue > 0
                }
              />
            )}
          </td>
          <td className="is-vcentered">
            {x.stok_fisik !== null ? x.stok_fisik - x.stok : ""}
          </td>
          <td className="is-vcentered">
            {x.stok_fisik !== null && <CheckOutlined color="green" />}
          </td>
          <td className="is-vcentered">
            {x.stok_fisik === null ? (
              <button className="button is-primary">Simpan</button>
            ) : (
              <button className="button is-danger">Ubah</button>
            )}
          </td>
        </tr>
      );
    });
  } catch (e) {
    semuaAkun = (
      <tr>
        <td colSpan="10" className="is-vcentered">
          {item}
        </td>
      </tr>
    );
  }
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
          IconLeft={faReceipt}
          field={field}
          maxLength="50"
          fungsiCheck={onChangeNoOpname}
        />
        <div className="field">
          <label className="label">Rak</label>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Pilih Rak"
            fieldNames={{ label: "nama_rak", value: "id_rak" }}
            filterOption={filterOption}
            options={dataRak}
            size="large"
            onSelect={(value) => onSelectRak(value)}
            onDeselect={(value) => onDeselectRak(value)}
            // onChange={(value) => onChangeRak(value)}
            onClear={onClear}
            value={rak}
          />
        </div>
        {time_stamp[0].time_stamp !== null ? (
          <div style={{ fontStyle: "italic" }}>
            {`Terakhir dikerjakan pada ${readableDate(
              time_stamp[0].time_stamp
            )}`}
          </div>
        ) : undefined}
        <div className="field">
          <label className="label">Detail</label>
          <table className="table has-text-centered is-fullwidth">
            <thead>
              <tr>
                <th className="has-text-centered is-vcentered">No</th>
                <th className="has-text-centered is-vcentered">Rak</th>
                <th className="has-text-centered is-vcentered">Nama Item</th>
                <th className="has-text-centered is-vcentered">Jenis</th>
                <th className="has-text-centered is-vcentered">Satuan</th>
                <th className="has-text-centered is-vcentered">Stok Sistem</th>
                <th className="has-text-centered is-vcentered">Stok Fisik</th>
                <th className="has-text-centered is-vcentered">Selisih</th>
                <th className="has-text-centered is-vcentered">Status</th>
                <th className="has-text-centered is-vcentered">Aksi</th>
              </tr>
            </thead>
            <tbody>{semuaAkun}</tbody>
          </table>

          <button className="button is-link" disabled={!submit}>
            Submit
          </button>
        </div>
      </form>
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
              onClick={() => router.reload()}
              style={{ marginRight: "20px" }}
            >
              Lanjutkan Menambah Transaksi
            </button>
            <button
              className="button is-success"
              onClick={() => router.push("/Transaksi/TransaksiStokOpname?p=1")}
            >
              Kembali Ke halaman Transaksi Stok Opname
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

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const idUser = session.user.idUser;

  const queryInsert =
    "insert ignore transaksi_opname_temp(idUser,time_stamp) VALUES(?,null)";
  const valuesInsert = [idUser];

  const { p, Rak } = context.query;
  const values = [];
  let query =
    "select item.id_item,item.nama,item.id_rak,item.id_satuan,item.id_jenis_item,stok_fisik,idUser,stok,satuan.nama as nama_satuan,jenis.nama as nama_jenis, rak.nama_rak " +
    "from (select id_item,stok_fisik,idUser from detail_opname_temp inner join transaksi_opname_temp on transaksi_opname_temp.id_opname_temp=detail_opname_temp.id_opname_temp where idUser=?)as a " +
    "right join item on item.id_item=a.id_item inner join satuan on satuan.id_satuan=item.id_satuan inner join jenis on jenis.id_jenis=item.id_jenis_item inner join rak on rak.id_rak=item.id_rak " +
    "where item.status=1";

  let query2 =
    "select count(item.id_item) as jumlah " +
    "from (select id_item,stok_fisik,idUser from detail_opname_temp inner join transaksi_opname_temp on transaksi_opname_temp.id_opname_temp=detail_opname_temp.id_opname_temp where idUser=?)as a " +
    "right join item on item.id_item=a.id_item inner join satuan on satuan.id_satuan=item.id_satuan inner join jenis on jenis.id_jenis=item.id_jenis_item inner join rak on rak.id_rak=item.id_rak " +
    "where item.status=1";

  values.push(idUser);

  if (Rak !== undefined) {
    // if(Array.isArray(Rak))
    if (Array.isArray(Rak)) {
      query += " and  ";
      query2 += " and  ";
      for (let i = 0; i < Rak.length; i++) {
        if (i === Rak.length - 1) {
          query += " rak.id_rak=? ";
          query2 += " rak.id_rak=? ";
        } else {
          query += " rak.id_rak=? or ";
          query2 += " rak.id_rak=? or ";
        }
        values.push(Rak[i]);
      }
    } else {
      query += " and rak.id_rak=? ";
      query2 += " and rak.id_rak=? ";
      values.push(Rak);
    }
  }

  query = query + " order by item.id_item LIMIT ?,10";

  values.push((parseInt(p) - 1) * 10);

  // ----------------------------------------------------------
  const queryRak = "select id_rak,nama_rak from rak where status=1";
  const queryLastUpdated =
    "select time_stamp from transaksi_opname_temp where idUser=?";
  const valuesLastUpdated = [idUser];

  try {
    await handlerQuery({ query: queryInsert, values: valuesInsert });

    const getRak = await handlerQuery({ query: queryRak, values: [] });
    const dataRak = JSON.parse(JSON.stringify(getRak));

    const getItem = await handlerQuery({ query, values });
    const item = JSON.parse(JSON.stringify(getItem));
    for (let i = 0; i < item.length; i++) {
      if (item[i].stok_fisik !== null) {
        item[i].status_stok_fisik = 1;
        item[i].selisih = item[i].stok_fisik - item[i].stok;
      } else {
        item[i].status_stok_fisik = 0;
        item[i].selisih = null;
      }
    }

    const getJumlah = await handlerQuery({ query: query2, values });
    const jumlah = JSON.parse(JSON.stringify(getJumlah));

    const getLastUpdated = await handlerQuery({
      query: queryLastUpdated,
      values: valuesLastUpdated,
    });
    const time_stamp = JSON.parse(JSON.stringify(getLastUpdated));
    return {
      props: {
        dataRak,
        item,
        jumlah,
        time_stamp,
      },
    };
  } catch (e) {
    return {
      props: {
        dataRak: [{ id_rak: "", nama_rak: "" }],
        item: e.message,
        jumlah: [{ jumlah: 0 }],
      },
    };
  }
}

Tambah.getLayout = function getLayout(page) {
  return <Layout clicked="Rekap Transaksi Stok Opname">{page}</Layout>;
};
