import Head from "next/head";
import Layout from "../../../../components/Layout";
import handlerQuery from "../../../../lib/db";
import { NamaKota, Kode, FieldButton, Namereducer, kotainitValue, kodeReducer, kodeinitValue, Modal, IsiModalSuccess, IsiModalFailed } from "../../../../components/TambahKotaComp";
import { useRouter } from "next/router";
import { useState, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
export default function Edit({ hasil }) {
  const [state, dispacth] = useReducer(Namereducer, kotainitValue);
  const [namaKota, setNamaKota] = useState(hasil[0].nama_kota);
  const [kode, setKode] = useState(hasil[0].kode_kota);
  const [isShow, setShow] = useState(false);
  const [kodeState, dispacthKode] = useReducer(kodeReducer, kodeinitValue);
  const [isModalClosed, setModalClosed] = useState(true);
  const [isSubmitSuccess, setisSubmitSuccess] = useState(false);
  const [isShowRetype, setShowRetype] = useState(false);
  const [kodeRetype, setKodeRetype] = useState("");
  const router = useRouter();
  const isDisabled =
    ((state.warnaTextbox === "input is-success" || state.warnaTextbox === "input") && kode.length === 8 && kodeRetype === kode) || state.warnaTextbox === "input is-success" || (state.warnaTextbox === "input" && kode.length === 0)
      ? false
      : true;
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

  const typeOfIcon = isShow === false ? <EyeSlash onClick={changeisShow} /> : <Eye onClick={changeisShow} />;

  const onChangeNamaKota = async (e) => {
    setNamaKota(e.target.value);
    dispacth({ type: "loading" });
    if (e.target.value === "" || e.target.value.length > 15) {
      setNamaKota(e.target.value);
      dispacth({ type: "not allowed" });
      return;
    }
    try {
      const response = await axios.post("/api/CheckKota", {
        sendNamaKota: e.target.value,
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

  const onChangeKodeKota = async (e) => {
    setKode(e.target.value);
    dispacthKode({ type: "loading" });
    if (e.target.value === "" || e.target.value.length > 15) {
      setKode(e.target.value);
      dispacthKode({ type: "not allowed" });
      return;
    }
    try {
      const response = await axios.post("/api/CheckKodeKota", {
        sendNamaKode: e.target.value,
        tujuan: "edit",
        id: router.query.id,
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

  const onChangeRetype = (e) => {
    setKodeRetype(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("/api/EditKota", {
        namaKota,
        kode,
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
        <title>Edit Kota</title>
      </Head>
      <h1 className="title">Edit Kota</h1>
      <form onSubmit={onSubmit}>
        <NamaKota className={state.warnaTextbox} value={namaKota} onChange={onChangeNamaKota} icon={state.icon} hasil={state.hasil} />
        <Kode className={kodeState.warnaTextbox} value={kode} onChange={onChangeKodeKota} icon={kodeState.icon} hasil={kodeState.hasil} />
        <FieldButton nama="Submit" disabled={isDisabled} />
      </form>
      <Modal className={isModalClosed === false && "is-active"}>
        {isSubmitSuccess === true ? (
          <IsiModalSuccess pesan="Berhasil Mengupdate Kota">
            <button className="button is-primary" onClick={() => router.push("/Kota")}>
              OK
            </button>
          </IsiModalSuccess>
        ) : (
          <IsiModalFailed
            pesan={
              <>
                Tidak berhasil menambahkan Kota
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

export async function getServerSideProps(context) {
  const query = "select nama_kota,kode_kota,status from kota where id_kota=?";
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
  return <Layout clicked="Kota">{page}</Layout>;
};
