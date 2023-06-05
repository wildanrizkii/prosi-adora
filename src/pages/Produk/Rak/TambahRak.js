import Head from "next/head";
import Layout from "../../../../components/Layout";
import { useReducer, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { NamaRak, FieldButton, Namereducer, rakinitValue, Modal, IsiModalSuccess, IsiModalFailed } from "../../../../components/TambahRakComp";

export default function TambahRak() {
  const [state, dispacth] = useReducer(Namereducer, rakinitValue);
  const [namaRak, setNamaRak] = useState("");
  const [isShow, setShow] = useState(false);
  const [isModalClosed, setModalClosed] = useState(true);
  const [isSubmitSuccess, setisSubmitSuccess] = useState(false);
  const [isShowRetype, setShowRetype] = useState(false);
  const router = useRouter();
  const changeisShowRetype = (e) => {
    setShowRetype(!isShowRetype);
  };
  const Eye = ({ onClick }) => {
    return <FontAwesomeIcon icon="eye" onClick={onClick} pointerEvents="all" cursor="pointer" />;
  };
  const EyeSlash = ({ onClick }) => {
    return <FontAwesomeIcon icon="eye-slash" onClick={onClick} pointerEvents="all" cursor="pointer" />;
  };

  const onChangeNamaRak = async (e) => {
    setNamaRak(e.target.value);
    dispacth({ type: "loading" });
    if (e.target.value === "" || e.target.value.length > 15) {
      setNamaRak(e.target.value);
      dispacth({ type: "not allowed" });
      return;
    }
    try {
      const response = await axios.post("/api/CheckRak", {
        sendNamaRak: e.target.value,
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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/TambahRakA", {
        namaRak,
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
    setNamaRak("");
    setShow(false);
    setShowRetype(false);
    setModalClosed();
  };

  const typeOfIcon2 = isShowRetype === false ? <EyeSlash onClick={changeisShowRetype} /> : <Eye onClick={changeisShowRetype} />;

  return (
    <>
      <Head>
        <title>Tambah Rak</title>
      </Head>
      <h1 className="title">Tambah Rak</h1>
      <form onSubmit={onSubmit}>
        <NamaRak className={state.warnaTextbox} value={namaRak} onChange={onChangeNamaRak} icon={state.icon} hasil={state.hasil} />
        {/* <Kode className={kodeState.warnaTextbox} value={kode} onChange={onChangeKodeKota} icon={kodeState.icon} hasil={kodeState.hasil} /> */}
        <FieldButton nama="Submit" />
      </form>
      <Modal className={isModalClosed === false && "is-active"}>
        {isSubmitSuccess === true ? (
          <IsiModalSuccess pesan="Berhasil Menambahkan Rak">
            <button className="button is-primary" onClick={MenambahkanUserLagi} style={{ marginRight: "10px" }}>
              Lanjutkan Menambah rak
            </button>
            <button className="button is-primary" onClick={() => router.push("/Produk/Rak")}>
              Kembali Ke halaman rak
            </button>
          </IsiModalSuccess>
        ) : (
          <IsiModalFailed
            pesan={
              <>
                Tidak berhasil menambahkan rak
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
TambahRak.getLayout = function getLayout(page) {
  return <Layout clicked="Rak">{page}</Layout>;
};
