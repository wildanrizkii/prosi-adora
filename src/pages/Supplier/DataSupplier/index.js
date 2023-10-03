import Layout from "../../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../../lib/db";

import axios from "axios";

import { useRouter } from "next/router";
import { Badge, FloatButton, notification } from "antd";
import { EditFilled, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
export default function DataSupplier({ hasil }) {
  let semuaAkun;
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, message, description) => {
    api[type]({ message, description, placement: "top" });
  };

  const router = useRouter();
  async function changeStatus(id, toActive) {
    try {
      let res;
      if (toActive === true) {
        res = await axios.patch("/api/UpdateStatusSupplier", { id, status: 1 });
      } else if (toActive === false) {
        res = await axios.patch("/api/UpdateStatusSupplier", { id, status: 0 });
      }
      openNotificationWithIcon("success", "Sukses", res.data);
      router.push(router.asPath);
    } catch (e) {
      openNotificationWithIcon("error", "Gagal", e.response.data);
      router.push(router.asPath);
    }
  }

  try {
    semuaAkun = hasil.map((x, index) => {
      return (
        <tr
          key={x.id_supplier}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 ? "rgb(255, 77, 79)" : "white",
            color: x.status === 0 ? "white" : "rgb(54,54,54)",
          }}
        >
          <td className="is-vcentered">{index + 1}</td>
          <td className="is-vcentered">{x.kode_supplier}</td>
          <td className="is-vcentered">{x.nama_supplier}</td>
          <td className="is-vcentered">{x.alamat}</td>
          <td className="is-vcentered">{x.no_hp}</td>
          <td className="is-vcentered">{x.tipe_kota + " " + x.nama_kota}</td>
          <td className="is-vcentered">
            {x.status === 1 ? "Aktif" : "Non-Aktif"}
          </td>
          <td className="is-vcentered" style={{ width: "20%" }}>
            {x.statusKota !== 1 && x.status === 1 ? (
              <>
                <Button
                  icon={
                    <>
                      <Badge count="!" offset={[11, 0]}>
                        <EditFilled />
                      </Badge>
                    </>
                  }
                  block
                  onClick={() =>
                    router.push(`/Supplier/DataSupplier/Edit/${x.id_supplier}`)
                  }
                ></Button>
              </>
            ) : (
              <Button
                icon={<EditFilled />}
                block
                onClick={() =>
                  router.push(`/Supplier/DataSupplier/Edit/${x.id_supplier}`)
                }
              />
            )}

            {x.status === 1 ? (
              <Button
                type="primary"
                danger
                block
                onClick={() => changeStatus(x.id_supplier, false)}
              >
                Non-Aktifkan
              </Button>
            ) : (
              <Button
                type="primary"
                style={{ backgroundColor: "rgb(72, 199, 142)" }}
                block
                onClick={() => changeStatus(x.id_supplier, true)}
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
        <td colSpan="8" className="is-vcentered">
          <div className="field">{hasil}</div>
          <Button type="primary" onClick={() => router.reload()}>
            Muat Ulang
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <>
      <Head>
        <title>Data Supplier</title>
      </Head>
      <h1 className="title">Data Supplier</h1>
      {contextHolder}
      <table className="table has-text-centered is-fullwidth">
        <thead>
          <tr>
            <th className="has-text-centered is-vcentered">No</th>
            <th className="has-text-centered is-vcentered">Kode</th>
            <th className="has-text-centered is-vcentered">Nama</th>
            <th className="has-text-centered is-vcentered">Alamat</th>
            <th className="has-text-centered is-vcentered">Telepon</th>
            <th className="has-text-centered is-vcentered">Kota</th>
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
        tooltip="Tambah Data Supplier"
        onClick={() => router.push("/Supplier/DataSupplier/TambahSupplier")}
      />
    </>
  );
}

export async function getServerSideProps() {
  const query =
    "select supplier.id_supplier , supplier.kode_supplier , supplier.nama_supplier , supplier.alamat , supplier.no_hp , kota.nama_kota AS nama_kota,kota.tipe as tipe_kota, supplier.status,kota.status as statusKota  " +
    "from supplier INNER JOIN kota ON kota.id_kota = supplier.id_kota ";
  const values = [];
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

DataSupplier.getLayout = function getLayout(page) {
  return <Layout clicked="Data Supplier">{page}</Layout>;
};
