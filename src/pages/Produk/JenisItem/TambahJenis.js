import Head from "next/head";
import Layout from "../../../../components/Layout";
import { useReducer, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import {
  NamaJenis,
  FieldButton,
  Namereducer,
  jenisinitValue,
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
} from "../../../../components/TambahJenisComp";

export default function TambahJenis() {
  const [state, dispacth] = useReducer(Namereducer, jenisinitValue);
  const [namaJenis, setNamaJenis] = useState("");
  const [isShow, setShow] = useState(false);
  const [isModalClosed, setModalClosed] = useState(true);
  const [isSubmitSuccess, setisSubmitSuccess] = useState(false);
  const [isShowRetype, setShowRetype] = useState(false);
  const router = useRouter();
  // const isDisabled = state.warnaTextbox === "input is-success" && kode.length === 8 && kodeRetype === kode ? false : true;
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

  // const eyeSlash = (
  //   <FontAwesomeIcon
  //     icon="eye-slash"
  //     onClick={changeisShow}
  //     pointerEvents="all"
  //     cursor="pointer"
  //   />
  // );
  // const typeOfIcon = isShow === false ? <EyeSlash onClick={changeisShow} /> : <Eye onClick={changeisShow} />;

  const onChangeNamaJenis = async (e) => {
    setNamaJenis(e.target.value);
    dispacth({ type: "loading" });
    if (e.target.value === "" || e.target.value.length > 15) {
      setNamaJenis(e.target.value);
      dispacth({ type: "not allowed" });
      return;
    }
    try {
      const response = await axios.post("/api/CheckJenis", {
        sendNamaJenis: e.target.value,
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
      await axios.post("/api/TambahJenisItem", {
        namaJenis,
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
    setNamaJenis("");
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
        <title>Tambah Jenis Item</title>
      </Head>
      <h1 className="title">Tambah Jenis Item</h1>
      <form onSubmit={onSubmit}>
        <NamaJenis
          className={state.warnaTextbox}
          value={namaJenis}
          onChange={onChangeNamaJenis}
          icon={state.icon}
          hasil={state.hasil}
        />
        {/* <Kode className={kodeState.warnaTextbox} value={kode} onChange={onChangeKodeKota} icon={kodeState.icon} hasil={kodeState.hasil} /> */}
        <FieldButton nama="Submit" />
      </form>
      <Modal className={isModalClosed === false && "is-active"}>
        {isSubmitSuccess === true ? (
          <IsiModalSuccess pesan="Berhasil Menambahkan Jenis Item">
            <button
              className="button is-primary"
              onClick={MenambahkanUserLagi}
              style={{ marginRight: "10px" }}
            >
              Lanjutkan Menambah jenis item
            </button>
            <button
              className="button is-primary"
              onClick={() => router.push("/Produk/JenisItem")}
            >
              Kembali Ke halaman jenis item
            </button>
          </IsiModalSuccess>
        ) : (
          <IsiModalFailed
            pesan={
              <>
                Tidak berhasil menambahkan jenis item
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
TambahJenis.getLayout = function getLayout(page) {
  return <Layout clicked="Jenis Item">{page}</Layout>;
};
