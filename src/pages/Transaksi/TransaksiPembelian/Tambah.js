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
import handlerQuery from "../../../../lib/db";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Tambah({ supplier, item }) {
  const [field, setField] = useState({
    "No Faktur": "",
    "No Faktur Checked": false,
    Supplier: supplier[0].id_supplier,
  });
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const idUser = status === "authenticated" && session.user.idUser;
  const [detail, setDetail] = useState([
    {
      Kode: undefined,
      IdItem: "",
      Jenis: undefined,
      Satuan: undefined,
      Jumlah_Item: 0,
      Harga_Beli: 0,
      Subtotal: 0,
    },
  ]);

  const CheckedDetail = () => {
    let rightDetail = 0;
    for (let i = 0; i < detail.length; i++) {
      if (
        detail[i].Kode !== undefined &&
        detail[i].IdItem !== "" &&
        (detail[i].Jenis !== undefined ||
          detail[i].Jenis !== "GAGAL MENDAPAT INFO") &&
        (detail[i].Satuan !== undefined ||
          detail[i].Satuan !== "GAGAL MENDAPAT INFO") &&
        parseInt(detail[i].Jumlah_Item) > 0 &&
        parseInt(detail[i].Harga_Beli) > 0
      ) {
        rightDetail = rightDetail + 1;
      }
    }
    if (rightDetail !== 0) {
      return true;
    } else {
      return false;
    }
  };

  const detailChecked = CheckedDetail();

  const submit = field["No Faktur Checked"] === true && detailChecked === true;

  const onChangeName = async (Id, index) => {
    const arrDetail = [...detail];
    if (Id === "") {
      const hasil = {
        ...detail[index],
        Kode: undefined,
        IdItem: Id,
        Jenis: undefined,
        Satuan: undefined,
      };
      arrDetail[index] = hasil;
      setDetail(arrDetail);
    } else {
      try {
        const res = await axios.get("/api/GetInfoItem?idItem=" + Id);
        const data = res.data;
        const hasil = {
          ...detail[index],
          Kode: Id,
          IdItem: Id,
          Jenis: data[0].nama_jenis,
          Satuan: data[0].nama_satuan,
        };
        arrDetail[index] = hasil;
        setDetail(arrDetail);
      } catch (er) {
        const hasil = {
          ...detail[index],
          Kode: Id,
          IdItem: Id,
          Jenis: er.response.data,
          Satuan: er.response.data,
        };
        arrDetail[index] = hasil;
        setDetail(arrDetail);
      }
    }
  };
  const onChangeJumlah = (jumlah, index) => {
    const arrDetail = [...detail];
    const hasil = {
      ...detail[index],
      Jumlah_Item: jumlah,
      Subtotal: parseInt(jumlah) * parseInt(detail[index].Harga_Beli),
    };
    arrDetail[index] = hasil;

    setDetail(arrDetail);
  };
  const onChangeHarga = (harga, index) => {
    const arrDetail = [...detail];
    const hasil = {
      ...detail[index],
      Harga_Beli: harga,
      Subtotal: parseInt(harga) * parseInt(detail[index].Jumlah_Item),
    };
    arrDetail[index] = hasil;
    setDetail(arrDetail);
  };
  const tambahBaris = () => {
    const detailBaru = [...detail];
    const objBaru = {
      Kode: undefined,
      IdItem: "",
      Jenis: undefined,
      Satuan: undefined,
      Jumlah_Item: 0,
      Harga_Beli: 0,
      Subtotal: 0,
    };
    detailBaru.push(objBaru);
    setDetail(detailBaru);
  };
  const hapusBaris = (index) => {
    const arrDetail = [...detail];
    arrDetail.splice(index, 1);
    setDetail(arrDetail);
  };
  const onChangeFaktur = async (Faktur) => {
    if (Faktur === "") {
      return "default";
    }
    const res = await axios.post("/api/CheckFaktur", {
      sendFaktur: Faktur,
    });
    return res.data;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const arrDetail = [];

    for (let i = 0; i < detail.length; i++) {
      if (
        detail[i].Kode !== undefined &&
        detail[i].IdItem !== "" &&
        (detail[i].Jenis !== undefined ||
          detail[i].Jenis !== "GAGAL MENDAPAT INFO") &&
        (detail[i].Satuan !== undefined ||
          detail[i].Satuan !== "GAGAL MENDAPAT INFO") &&
        parseInt(detail[i].Jumlah_Item) > 0 &&
        parseInt(detail[i].Harga_Beli) > 0
      ) {
        arrDetail.push(detail[i]);
      }
    }
    try {
      const res = await axios.post("/api/TambahTransaksiPemb", {
        faktur: field["No Faktur"],
        idUser,
        supplier: field.Supplier,
        sendDetail: arrDetail,
      });
      setModal({
        pesan: res.data,
        isSuccess: true,
        isModalClosed: false,
      });
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
        <title>Tambah Transaksi Pembelian</title>
      </Head>
      <h1 className="title">Tambah Transaksi Pembelian</h1>
      <form onSubmit={onSubmit}>
        <Field
          nama="No Faktur"
          value={field["No Faktur"]}
          onChange={setField}
          IconLeft="fas fa-receipt"
          field={field}
          maxLength="50"
          fungsiCheck={onChangeFaktur}
        />
        <Dropdown
          nama="Supplier"
          value={field.Supplier}
          onChange={setField}
          arr={supplier}
          field={field}
          mappingElement={["id_supplier", "nama_supplier"]}
        />

        <div id="detail" className="field">
          <label className="label">Detail</label>
          <table className="table has-text-centered">
            <thead>
              <tr>
                <th className="has-text-centered is-vcentered">Kode Item</th>
                <th className="has-text-centered is-vcentered">Nama Item</th>
                <th className="has-text-centered is-vcentered">Jenis</th>
                <th className="has-text-centered is-vcentered">Satuan</th>
                <th className="has-text-centered is-vcentered">Jumlah Item</th>
                <th className="has-text-centered is-vcentered">
                  Harga Beli/Satuan (RP)
                </th>
                <th className="has-text-centered is-vcentered">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detail.map((x, index) => {
                return (
                  <tr key={index}>
                    <td className="is-vcentered">{x.Kode}</td>
                    <td className="is-vcentered">
                      <div className="field">
                        <div className="control">
                          <div className="select">
                            <select
                              value={x.IdItem}
                              onChange={async (e) =>
                                await onChangeName(e.target.value, index)
                              }
                              className="has-text-centered"
                            >
                              {item.map((el) => {
                                return (
                                  <option key={el.id_item} value={el.id_item}>
                                    {el.nama}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="is-vcentered">{x.Jenis}</td>
                    <td className="is-vcentered">{x.Satuan}</td>
                    <td className="is-vcentered">
                      <input
                        type="number"
                        className="input has-text-centered"
                        value={x.Jumlah_Item}
                        onChange={(e) => onChangeJumlah(e.target.value, index)}
                        min="0"
                      />
                    </td>
                    <td className="is-vcentered">
                      <input
                        type="number"
                        className="input has-text-centered"
                        value={x.Harga_Beli}
                        onChange={(e) => onChangeHarga(e.target.value, index)}
                        min="0"
                      />
                    </td>
                    <td className="is-vcentered">{x.Subtotal}</td>
                    <td className="is-vcentered">
                      <button
                        type="button"
                        className="delete"
                        aria-label="close"
                        onClick={(e) => hapusBaris(index)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            className="button is-medium"
            type="button"
            onClick={() => tambahBaris()}
          >
            +
          </button>
        </div>

        <button className="button is-link" disabled={!submit}>
          Submit
        </button>
      </form>
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
              onClick={() => router.push("/Transaksi/TransaksiPembelian?p=1")}
            >
              Kembali Ke halaman Transaksi Pembelian
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

export async function getServerSideProps() {
  const query = "select id_supplier,nama_supplier from supplier";
  const queryItem = "select id_item,nama from item";
  try {
    const getSupplier = await handlerQuery({ query, values: [] });
    const supplier = JSON.parse(JSON.stringify(getSupplier));
    const getItem = await handlerQuery({ query: queryItem, values: [] });
    const item = JSON.parse(JSON.stringify(getItem));
    item.unshift({ id_item: "", nama: "--Pilih Item--" });
    return {
      props: {
        supplier,
        item,
      },
    };
  } catch (e) {
    return {
      props: {
        supplier: [{ id_supplier: "", nama_supplier: "" }],
        item: [{ id_item: "", nama: "" }],
      },
    };
  }
}

Tambah.getLayout = function getLayout(page) {
  return <Layout clicked="Transaksi Pembelian">{page}</Layout>;
};
