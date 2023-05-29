import Head from "next/head";
import Layout from "../../../../../components/Layout";
import handlerQuery from "../../../../../lib/db";
import {
  NamaSatuan,
  FieldButton,
  Namereducer,
  satuaninitValue,
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
} from "../../../../../components/TambahSatuanComp";
import { useRouter } from "next/router";
import { useState, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
export default function Edit({ hasil }) {
  const [state, dispacth] = useReducer(Namereducer, satuaninitValue);
  const [namaSatuan, setNamaSatuan] = useState(hasil[0].nama);
  const [isShow, setShow] = useState(false);
  const [isModalClosed, setModalClosed] = useState(true);
  const [isSubmitSuccess, setisSubmitSuccess] = useState(false);
  const [isShowRetype, setShowRetype] = useState(false);
  const router = useRouter();
  // const isDisabled =
  //   ((state.warnaTextbox === "input is-success" || state.warnaTextbox === "input") && kode.length === 8 && kodeRetype === kode) || state.warnaTextbox === "input is-success" || (state.warnaTextbox === "input" && kode.length === 0)
  //     ? false
  //     : true;
  const changeisShow = (e) => {
    setShow(!isShow);
  };
  const changeisShowRetype = (e) => {
    setShowRetype(!isShowRetype);
  };
  const Eye = ({ onClick }) => {
    return (
      <FontAwesomeIcon
        icon="eye"
        onClick={onClick}
        pointerEvents="all"
        cursor="pointer"
      />
    );
  };
  const EyeSlash = ({ onClick }) => {
    return (
      <FontAwesomeIcon
        icon="eye-slash"
        onClick={onClick}
        pointerEvents="all"
        cursor="pointer"
      />
    );
  };

  const typeOfIcon =
    isShow === false ? (
      <EyeSlash onClick={changeisShow} />
    ) : (
      <Eye onClick={changeisShow} />
    );

  const onChangeNamaSatuan = async (e) => {
    setNamaSatuan(e.target.value);
    dispacth({ type: "loading" });
    if (e.target.value === "" || e.target.value.length > 15) {
      setNamaSatuan(e.target.value);
      dispacth({ type: "not allowed" });
      return;
    }
    try {
      const response = await axios.post("/api/CheckSatuan", {
        sendNamaSatuan: e.target.value,
        tujuan: "edit",
        id: router.query.id,
      });
      if (response.data === "available") {
        dispacth({ type: "available" });
      } else if (response.data === "not available") {
        dispacth({ type: "not available" });
      }
    } catch (e) {
      dispacth({ type: "error" });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("/api/EditSatuan", {
        namaSatuan,
        id: router.query.id,
      });
      setisSubmitSuccess(true);
    } catch (e) {
      setisSubmitSuccess(false);
    } finally {
      setModalClosed(false);
    }
  };

  //   const onChangeRole = (e) => {
  //     setRole(e.target.value);
  //   };
  // const MenambahkanUserLagi = () => {
  //   dispacth({ type: "default" });
  //   dispacthPass({ type: "default" });
  //   setUsername("");
  //   setPassword("");
  //   setRole("pemilik");
  //   setModalClosed();
  // };
  const typeOfIcon2 =
    isShowRetype === false ? (
      <EyeSlash onClick={changeisShowRetype} />
    ) : (
      <Eye onClick={changeisShowRetype} />
    );

  // const hasilRetype =
  //   kodeRetype === kode && kode.length === 8 ? (
  //     <p className="help is-success" style={{ fontSize: "15px" }}>
  //       kode sudah sama!
  //     </p>
  //   ) : kode !== kodeRetype && kode.length === 8 ? (
  //     <p className="help is-danger" style={{ fontSize: "15px" }}>
  //       kode tidak sama!
  //     </p>
  //   ) : (
  //     ""
  //   );
  // const warnaTexboxtRetype = kodeRetype === kode && kode.length === 8 ? "input is-success" : kode !== kodeRetype && kode.length === 8 ? "input is-danger" : "input";

  return (
    <>
      <Head>
        <title>Edit Satuan Item</title>
      </Head>
      <h1 className="title">Edit Satuan Item</h1>
      <form onSubmit={onSubmit}>
        <NamaSatuan
          className={state.warnaTextbox}
          value={namaSatuan}
          onChange={onChangeNamaSatuan}
          icon={state.icon}
          hasil={state.hasil}
        />
        {/* <Kode className={kodeState.warnaTextbox} value={kode} onChange={onChangeKodeKota} icon={kodeState.icon} hasil={kodeState.hasil} /> */}
        <FieldButton nama="Submit" />
      </form>
      <Modal className={isModalClosed === false && "is-active"}>
        {isSubmitSuccess === true ? (
          <IsiModalSuccess pesan="Berhasil Mengupdate Satuan Item">
            <button
              className="button is-primary"
              onClick={() => router.push("/Produk/SatuanItem")}
            >
              OK
            </button>
          </IsiModalSuccess>
        ) : (
          <IsiModalFailed
            pesan={
              <>
                Tidak berhasil menambahkan satuan item
                <br />
                Silahkan Coba Lagi!
              </>
            }
          >
            <button
              className="button is-danger"
              onClick={() => setModalClosed(true)}
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
  const query = "select nama,status from satuan where id_satuan=?";
  const values = [context.query.id];
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

Edit.getLayout = function getLayout(page) {
  return <Layout clicked="Satuan Item">{page}</Layout>;
};
