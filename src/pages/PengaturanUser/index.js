import Layout from "../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../lib/db";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

import {
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
} from "../../../components/AllComponent";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { Badge, Button, FloatButton } from "antd";
import { EditFilled, PlusOutlined } from "@ant-design/icons";
export default function PengaturanUser({ hasil }) {
  let semuaAkun;

  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });

  const router = useRouter();
  async function changeStatus(id, toActive) {
    try {
      let res;
      if (toActive === true) {
        res = await axios.patch("/api/UpdateStatusUser", { id, status: 1 });
      } else if (toActive === false) {
        res = await axios.patch("/api/UpdateStatusUser", { id, status: 0 });
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
          key={x.idUser}
          style={{
            fontWeight: "bold",
            backgroundColor: x.status === 0 ? "rgb(255, 77, 79)" : "white",
            color: x.status === 0 ? "white" : "rgb(54,54,54)",
          }}
        >
          <td className="is-vcentered">{index + 1}</td>
          <td className="is-vcentered">{x.username}</td>
          <td className="is-vcentered">{x.role.toUpperCase()}</td>
          <td className="is-vcentered">
            {x.status === 1 ? "Aktif" : "Non-Aktif"}
          </td>
          <td className="is-vcentered">
            {/* <Link
              href={`PengaturanUser/Edit/${x.idUser}`}
              className="button is-success is-small"
            >
              Edit
            </Link> */}
            <Button
              icon={<EditFilled />}
              block
              onClick={() => router.push(`/PengaturanUser/Edit/${x.idUser}`)}
            />
            {x.status === 1 ? (
              <Button
                type="primary"
                danger
                block
                onClick={() => changeStatus(x.idUser, false)}
              >
                Non-Aktifkan
              </Button>
            ) : (
              <Button
                type="primary"
                style={{ backgroundColor: "rgb(72, 199, 142)" }}
                block
                onClick={() => changeStatus(x.idUser, true)}
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

  return (
    <>
      <Head>
        <title>Pengaturan User</title>
      </Head>
      <h1 className="title">Pengaturan User</h1>

      {/* <Link
        className="button is-link"
        href="PengaturanUser/Tambah"
        style={{ marginBottom: "10px" }}
      >
        Tambah
      </Link> */}

      <table className="table has-text-centered is-fullwidth">
        <thead>
          <tr>
            <th className="has-text-centered is-vcentered">No</th>
            <th className="has-text-centered is-vcentered">Username</th>
            <th className="has-text-centered is-vcentered">Akses</th>
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
        tooltip="Tambah User"
        onClick={() => router.push("/PengaturanUser/Tambah")}
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
  const query = "select username,role,idUser,status from user where idUser!=?";
  const session = await getServerSession(context.req, context.res, authOptions);
  const idUser = session.user.idUser;
  const values = [idUser];
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

PengaturanUser.getLayout = function getLayout(page) {
  return <Layout clicked="Pengaturan User">{page}</Layout>;
};
