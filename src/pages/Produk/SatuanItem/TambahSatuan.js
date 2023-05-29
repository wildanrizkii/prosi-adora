import Head from "next/head";
import Layout from "../../../../components/Layout";
import { useReducer, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import {
  NamaSatuan,
  FieldButton,
  Namereducer,
  satuaninitValue,
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
} from "../../../../components/TambahSatuanComp";

export default function TambahSatuan() {
  const [state, dispacth] = useReducer(Namereducer, satuaninitValue);
  const [namaSatuan, setNamaSatuan] = useState("");
  const [isShow, setShow] = useState(false);
  const [isModalClosed, setModalClosed] = useState(true);
  const [isSubmitSuccess, setisSubmitSuccess] = useState(false);
  const [isShowRetype, setShowRetype] = useState(false);
  const router = useRouter();
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

  // const eyeSlash = (
  //   <FontAwesomeIcon
  //     icon="eye-slash"
  //     onClick={changeisShow}
  //     pointerEvents="all"
  //     cursor="pointer"
  //   />
  // );
  // const typeOfIcon = isShow === false ? <EyeSlash onClick={changeisShow} /> : <Eye onClick={changeisShow} />;

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
        tujuan: "add",
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

  // const onChangePassword = (e) => {
  //   if (e.target.value.length < 8 || e.target.value.length > 8) {
  //     dispacthPass({ type: "tidak boleh" });
  //   } else {
  //     dispacthPass({ type: "boleh" });
  //   }
  //   setPassword(e.target.value);
  // };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/TambahSatuanItem", {
        namaSatuan,
      });
      setisSubmitSuccess(true);
    } catch (e) {
      setisSubmitSuccess(false);
    } finally {
      setModalClosed(false);
    }
  };

  const MenambahkanUserLagi = () => {
    dispacth({ type: "default" });
    setNamaSatuan("");
    setShow(false);
    setShowRetype(false);
    setModalClosed();
  };

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
        <title>Tambah Satuan Item</title>
      </Head>
      <h1 className="title">Tambah Satuan Item</h1>
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
          <IsiModalSuccess pesan="Berhasil Menambahkan Satuan Item">
            <button
              className="button is-primary"
              onClick={MenambahkanUserLagi}
              style={{ marginRight: "10px" }}
            >
              Lanjutkan Menambah satuan item
            </button>
            <button
              className="button is-primary"
              onClick={() => router.push("/Produk/SatuanItem")}
            >
              Kembali Ke halaman satuan item
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
TambahSatuan.getLayout = function getLayout(page) {
  return <Layout clicked="Satuan Item">{page}</Layout>;
};
