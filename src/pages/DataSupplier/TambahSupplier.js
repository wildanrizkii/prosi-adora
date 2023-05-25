import Head from "next/head";
import Layout from "../../../components/Layout";
import { useReducer, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { NamaSupplier, Kode, FieldButton, Namereducer, supplierinitValue, kodeReducer, kodeinitValue, Modal, IsiModalSuccess, IsiModalFailed } from "../../../components/TambahSupplierComp";

export default function TambahSupplier() {
  const [state, dispacth] = useReducer(Namereducer, supplierinitValue);
  const [namaSupplier, setNamaSupplier] = useState("");
  const [kode, setKode] = useState("");
  const [isShow, setShow] = useState(false);
  const [kodeState, dispacthKode] = useReducer(kodeReducer, kodeinitValue);
  const [isModalClosed, setModalClosed] = useState(true);
  const [isSubmitSuccess, setisSubmitSuccess] = useState(false);
  const [isShowRetype, setShowRetype] = useState(false);
  const [kodeRetype, setKodeRetype] = useState("");
  const router = useRouter();
  const isDisabled = state.warnaTextbox === "input is-success" && kode.length === 8 && kodeRetype === kode ? false : true;
  const changeisShow = (e) => {
    setShow(!isShow);
  };
  const changeisShowRetype = (e) => {
    setShowRetype(!isShowRetype);
  };
  const Eye = ({ onClick }) => {
    return <FontAwesomeIcon icon="eye" onClick={onClick} pointerEvents="all" cursor="pointer" />;
  };
  const EyeSlash = ({ onClick }) => {
    return <FontAwesomeIcon icon="eye-slash" onClick={onClick} pointerEvents="all" cursor="pointer" />;
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

  const onChangeNamaSupplier = async (e) => {
    setNamaSupplier(e.target.value);
    dispacth({ type: "loading" });
    if (e.target.value === "" || e.target.value.length > 15) {
      setNamaSupplier(e.target.value);
      dispacth({ type: "not allowed" });
      return;
    }
    try {
      const response = await axios.post("/api/CheckSupplier", {
        sendNamaSupplier: e.target.value,
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

  const onChangeKodeSupplier = async (e) => {
    setKode(e.target.value);
    dispacthKode({ type: "loading" });
    if (e.target.value === "" || e.target.value.length > 15) {
      setKode(e.target.value);
      dispacthKode({ type: "not allowed" });
      return;
    }
    try {
      const response = await axios.post("/api/CheckKodeSupplier", {
        sendNamaKode: e.target.value,
        tujuan: "add",
      });
      if (response.data === "available") {
        dispacthKode({ type: "available" });
      } else if (response.data === "not available") {
        dispacthKode({ type: "not available" });
      }
    } catch (e) {
      dispacthKode({ type: "error" });
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

  const onChangeRetype = (e) => {
    setKodeRetype(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/TambahSupplier", {
        namaSupplier,
        kode,
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
    dispacthKode({ type: "default" });
    setNamaSupplier("");
    setKode("");
    setKodeRetype("");
    setShow(false);
    setShowRetype(false);
    setModalClosed();
  };

  const typeOfIcon2 = isShowRetype === false ? <EyeSlash onClick={changeisShowRetype} /> : <Eye onClick={changeisShowRetype} />;

  const hasilRetype =
    kodeRetype === kode && kode.length === 8 ? (
      <p className="help is-success" style={{ fontSize: "15px" }}>
        kode sudah sama!
      </p>
    ) : kode !== kodeRetype && kode.length === 8 ? (
      <p className="help is-danger" style={{ fontSize: "15px" }}>
        kode tidak sama!
      </p>
    ) : (
      ""
    );
  const warnaTexboxtRetype = kodeRetype === kode && kode.length === 8 ? "input is-success" : kode !== kodeRetype && kode.length === 8 ? "input is-danger" : "input";

  return (
    <>
      <Head>
        <title>Tambah Supplier</title>
      </Head>
      <h1 className="title">Tambah Supplier</h1>
      <form onSubmit={onSubmit}>
        <NamaSupplier className={state.warnaTextbox} value={namaSupplier} onChange={onChangeNamaSupplier} icon={state.icon} hasil={state.hasil} />
        <Kode className={kodeState.warnaTextbox} value={kode} onChange={onChangeKodeSupplier} icon={kodeState.icon} hasil={kodeState.hasil} />
        <FieldButton nama="Submit" />
      </form>
      <Modal className={isModalClosed === false && "is-active"}>
        {isSubmitSuccess === true ? (
          <IsiModalSuccess pesan="Berhasil Menambahkan Supplier">
            <button className="button is-primary" onClick={MenambahkanUserLagi} style={{ marginRight: "10px" }}>
              Lanjutkan Menambah supplier
            </button>
            <button className="button is-primary" onClick={() => router.push("/DataSupplier")}>
              Kembali Ke halaman supplier
            </button>
          </IsiModalSuccess>
        ) : (
          <IsiModalFailed
            pesan={
              <>
                Tidak berhasil menambahkan supplier
                <br />
                Silahkan Coba Lagi!
              </>
            }
          >
            <button className="button is-danger" onClick={() => setModalClosed(true)}>
              OK
            </button>
          </IsiModalFailed>
        )}
      </Modal>
    </>
  );
}
TambahSupplier.getLayout = function getLayout(page) {
  return <Layout clicked="Data Supplier">{page}</Layout>;
};
