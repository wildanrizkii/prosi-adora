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
import { useEffect, useState } from "react";
import { Button, FloatButton, Popover, Select, notification } from "antd";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import handlerQuery from "../../../../lib/db";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { NumericFormat } from "react-number-format";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  EllipsisOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Modal as Modal2 } from "antd";

export default function Tambah({ dataRak, item, jumlah, time_stamp, info }) {
  let semuaAkun;

  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isOpen: false,
  });
  const [api, contextHolder] = notification.useNotification();

  const [modalInfo, setModalInfo] = useState(false);

  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "top",
    });
  };
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
  const [detail, setDetail] = useState([...item]);
  const checkSemuaOpname = () => {
    let bener = 0;
    for (let i = 0; i < info.length; i++) {
      if (info[i].jumlah_dicek_per_rak === info[i].jumlah_per_rak) {
        bener = bener + 1;
      }
    }
    return bener >= 7;
  };
  const opnameSemua = checkSemuaOpname();
  const submit = opnameSemua === true;

  const onSelectRak = async (value) => {
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

    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);

    const simpan = hrefBelakang.getAll("Rak");
    hrefBelakang.delete("Rak");
    const idx = simpan.indexOf(value.toString());

    simpan.splice(idx, 1);

    for (let i = 0; i < simpan.length; i++) {
      hrefBelakang.append("Rak", simpan[i]);
    }
    hrefBelakang.set("p", 1);

    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };

  const onClear = (value) => {
    const bagi = router.asPath.split("?");
    const hrefDepan = bagi[0];
    const hrefBelakang = new URLSearchParams(bagi[1]);

    hrefBelakang.set("p", 1);
    hrefBelakang.delete("Rak");

    router.push(hrefDepan + "?" + hrefBelakang.toString());
  };
  const onChangeJumlah = (stokFisik, index) => {
    const arrBaru = [...detail];

    let hasil;
    if (stokFisik !== undefined) {
      hasil = {
        ...arrBaru[index],
        stok_fisik: stokFisik,
        selisih: stokFisik - arrBaru[index].stok,
      };
    } else {
      hasil = {
        ...arrBaru[index],
        stok_fisik: stokFisik,
        selisih: undefined,
      };
    }

    arrBaru[index] = hasil;
    setDetail(arrBaru);
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/TambahTransaksiOpname", {
        Id_User: idUser,
      });
      setModal({
        pesan: res.data,
        isSuccess: true,
        isOpen: true,
      });
    } catch (e) {
      setModal({
        pesan: e.response.data,
        isSuccess: false,
        isOpen: true,
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

  // let index = (parseInt(router.query.p) - 1) * 10;
  try {
    semuaAkun = detail.map((x, i) => {
      // index = index + 1;
      return (
        <tr
          key={x.id_item}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 ? "rgb(255, 77, 79)" : "white",
            color: x.status === 0 ? "white" : "rgb(54,54,54)",
          }}
        >
          <td className="is-vcentered">{x.index}</td>
          <td className="is-vcentered">{x.nama_rak}</td>
          <td className="is-vcentered">{x.nama}</td>
          <td className="is-vcentered">{x.nama_jenis}</td>
          <td className="is-vcentered">{x.nama_satuan}</td>
          <td className="is-vcentered">
            <NumericFormat
              displayType="text"
              value={x.stok}
              thousandSeparator="."
              decimalSeparator=","
            />
          </td>
          <td className="is-vcentered">
            {x.status_stok_fisik === 1 ? (
              <NumericFormat
                displayType="text"
                value={x.stok_fisik}
                thousandSeparator="."
                decimalSeparator=","
              />
            ) : x.status_stok_fisik === 0 ? (
              <Popover content={contentStatus_0} trigger="focus">
                <NumericFormat
                  allowLeadingZeros={false}
                  allowNegative={false}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  className="input has-text-centered"
                  value={x.stok_fisik}
                  onValueChange={(value) => {
                    onChangeJumlah(value.floatValue, i);
                  }}
                  isAllowed={(values) =>
                    values.floatValue === undefined || values.floatValue >= 0
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      simpanSementara(x.id_item, idUser, x.stok_fisik);
                    }
                  }}
                />
              </Popover>
            ) : (
              <Popover content={contentStatus_2} trigger="focus">
                <NumericFormat
                  title="Tekan Esc untuk membatalkan"
                  allowLeadingZeros={false}
                  allowNegative={false}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={0}
                  className="input has-text-centered"
                  value={x.stok_fisik}
                  onValueChange={(value) => {
                    onChangeJumlah(value.floatValue, i);
                  }}
                  isAllowed={(values) =>
                    values.floatValue === undefined || values.floatValue >= 0
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateSementara(x.id_item, idUser, x.stok_fisik);
                    }
                    if (e.key === "Escape") {
                      router.push(router.asPath);
                    }
                  }}
                />
              </Popover>
            )}
          </td>
          <td className="is-vcentered">
            {x.selisih !== undefined && (
              <NumericFormat
                displayType="text"
                value={x.selisih}
                thousandSeparator="."
                decimalSeparator=","
              />
            )}
          </td>
          <td className="is-vcentered">
            {x.status_stok_fisik === 1 ? (
              <CheckOutlined style={{ color: "green" }} />
            ) : x.status_stok_fisik === 2 ? (
              <EllipsisOutlined style={{ color: "blue" }} />
            ) : undefined}
          </td>
          <td className="is-vcentered">
            {x.status_stok_fisik === 1 ? (
              <button
                className="button is-danger"
                onClick={(e) => {
                  e.preventDefault();
                  ubahStatusStokFisik(i);
                }}
              >
                Ubah
              </button>
            ) : x.status_stok_fisik === 0 ? (
              <button
                className="button is-primary"
                onClick={(e) => {
                  e.preventDefault();
                  simpanSementara(x.id_item, idUser, x.stok_fisik);
                }}
              >
                Simpan
              </button>
            ) : (
              <button
                className="button is-primary"
                onClick={(e) => {
                  e.preventDefault();
                  updateSementara(x.id_item, idUser, x.stok_fisik);
                }}
              >
                Simpan
              </button>
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

  useEffect(() => {
    setDetail(item);
  }, [item]);

  useEffect(() => {
    setRak(router.query.Rak !== undefined ? isi : []);
  }, [router.query.Rak]);

  return (
    <>
      <Head>
        <title>Tambah Transaksi Stok Opname</title>
      </Head>
      <h1 className="title">Tambah Transaksi Stok Opname</h1>
      {contextHolder}
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
          onClear={onClear}
          value={rak}
        />
      </div>
      <div className="field">
        {time_stamp[0].time_stamp !== null ? (
          <div style={{ fontStyle: "italic" }}>
            {`Terakhir dikerjakan pada ${readableDate(
              time_stamp[0].time_stamp
            )}`}
          </div>
        ) : undefined}
      </div>
      <div className="field">
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
        <Pagination
          href={router.asPath}
          currentPage={router.query.p}
          jumlah={jumlah[0].jumlah}
        />
      </div>

      <Modal2
        title="Jumlah Item yang sudah diopname pada tiap rak"
        open={modalInfo}
        footer={[]}
        onCancel={() => setModalInfo(false)}
      >
        <div>[Rak] [Jumlah Item yang sudah diopname]/[Jumlah Item di Rak]</div>
        {info.map((x) => {
          return (
            <div style={{ fontWeight: "bold" }} key={x.id_rak}>
              {`${x.nama_rak} ${x.jumlah_dicek_per_rak}/${x.jumlah_per_rak}`}
              {x.jumlah_per_rak === x.jumlah_dicek_per_rak ? (
                <CheckCircleOutlined
                  style={{ color: "green", marginLeft: "10px" }}
                />
              ) : (
                <CloseCircleOutlined
                  style={{ color: "red", marginLeft: "10px" }}
                />
              )}
            </div>
          );
        })}
      </Modal2>
      <Modal2
        open={modal.isOpen}
        title={modal.pesan}
        centered
        footer={null}
        closeIcon={false}
        width="50vw"
        style={{ textAlign: "center" }}
      >
        <div className="field">
          {modal.isSuccess === true ? (
            <CheckCircleOutlined style={{ color: "green", fontSize: "50px" }} />
          ) : (
            <CloseCircleOutlined style={{ color: "red", fontSize: "50px" }} />
          )}
        </div>
        {modal.isSuccess === true ? (
          <Button
            key="Kembali"
            type="primary"
            onClick={() => router.push("/Transaksi/TransaksiStokOpname?p=1")}
          >
            Kembali Ke halaman Transaksi Stok Opname
          </Button>
        ) : (
          <Button
            type="primary"
            danger
            onClick={() => setModal({ ...modal, isOpen: false })}
          >
            OK
          </Button>
        )}
      </Modal2>

      {submit === true && (
        <FloatButton
          shape="circle"
          type="primary"
          icon={<CheckOutlined />}
          style={{ right: 24, bottom: 105, width: "50px", height: "50px" }}
          tooltip="Submit"
          onClick={onSubmit}
        />
      )}

      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 24, width: "50px", height: "50px" }}
        icon={<UnorderedListOutlined />}
        tooltip="Info Opname"
        onClick={() => setModalInfo(true)}
      />
      {/* <Modal show={modal.isModalClosed === false && "is-active"}>
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
      </Modal> */}
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

  // const queryJumlahRak =
  //   "SELECT rak.id_rak,rak.nama_rak,count(item.id_item) as jumlah_per_rak " +
  //   "from rak left join item on item.id_rak=rak.id_rak and item.status=1 " +
  //   "where rak.status=1 " +
  //   "group by rak.id_rak";

  // const queryDicekPerRak =
  //   "SELECT rak.id_rak,rak.nama_rak,count(a.id_item) as jumlah_dicek_per_rak " +
  //   "from (select id_item,stok_fisik,idUser from detail_opname_temp inner join " +
  //   "transaksi_opname_temp on transaksi_opname_temp.id_opname_temp=detail_opname_temp.id_opname_temp where idUser=?)as a " +
  //   "inner join item on item.id_item=a.id_item right join rak on item.id_rak=rak.id_rak " +
  //   "where rak.status=1 " +
  //   "group by rak.id_rak";

  const queryInfo =
    "select hasil1.id_rak,hasil1.nama_rak,hasil1.jumlah_per_rak,hasil2.jumlah_dicek_per_rak from " +
    "(SELECT rak.id_rak,rak.nama_rak,count(item.id_item) as jumlah_per_rak " +
    "from rak left join item on item.id_rak=rak.id_rak and item.status=1 " +
    "where rak.status=1 " +
    "group by rak.id_rak)as hasil1 " +
    "inner join " +
    "(SELECT rak.id_rak,rak.nama_rak,count(a.id_item) as jumlah_dicek_per_rak " +
    "from (select id_item,stok_fisik,idUser from detail_opname_temp inner join " +
    "transaksi_opname_temp on transaksi_opname_temp.id_opname_temp=detail_opname_temp.id_opname_temp where idUser=?)as a " +
    "inner join item on item.id_item=a.id_item right join rak on item.id_rak=rak.id_rak " +
    "where rak.status=1 " +
    "group by rak.id_rak)as hasil2 on hasil1.id_rak=hasil2.id_rak ";

  const valuesInfo = [idUser];
  try {
    await handlerQuery({ query: queryInsert, values: valuesInsert });

    const getRak = await handlerQuery({ query: queryRak, values: [] });
    const dataRak = JSON.parse(JSON.stringify(getRak));

    const getItem = await handlerQuery({ query, values });
    const item = JSON.parse(JSON.stringify(getItem));
    let index = (parseInt(p) - 1) * 10;
    for (let i = 0; i < item.length; i++) {
      if (item[i].stok_fisik !== null) {
        item[i].status_stok_fisik = 1;
        item[i].selisih = item[i].stok_fisik - item[i].stok;
      } else {
        item[i].status_stok_fisik = 0;
        item[i].selisih = null;
      }
      index++;
      item[i].index = index;
    }

    const getJumlah = await handlerQuery({ query: query2, values });
    const jumlah = JSON.parse(JSON.stringify(getJumlah));

    const getLastUpdated = await handlerQuery({
      query: queryLastUpdated,
      values: valuesLastUpdated,
    });
    const time_stamp = JSON.parse(JSON.stringify(getLastUpdated));

    const getInfo = await handlerQuery({
      query: queryInfo,
      values: valuesInfo,
    });
    const info = JSON.parse(JSON.stringify(getInfo));

    return {
      props: {
        dataRak,
        item,
        jumlah,
        time_stamp,
        info,
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
