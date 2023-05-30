import Head from "next/head";
import Layout from "../../../../../components/Layout";
import handlerQuery from "../../../../../lib/db";
import { NamaRak, FieldButton, Namereducer, rakinitValue, Modal, IsiModalSuccess, IsiModalFailed } from "../../../../../components/TambahRakComp";
import { useRouter } from "next/router";
import { useState, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
export default function Edit({ hasil }) {
  const [state, dispacth] = useReducer(Namereducer, rakinitValue);
  const [namaRak, setNamaRak] = useState(hasil[0].nama_rak);
  const [isShow, setShow] = useState(false);
  const [isModalClosed, setModalClosed] = useState(true);
  const [isSubmitSuccess, setisSubmitSuccess] = useState(false);
  const [isShowRetype, setShowRetype] = useState(false);
  const router = useRouter();
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
      await axios.patch("/api/EditRak", {
        namaRak,
        id: router.query.id,
      });
      setisSubmitSuccess(true);
    } catch (e) {
      setisSubmitSuccess(false);
    } finally {
      setModalClosed(false);
    }
  };

  const typeOfIcon2 = isShowRetype === false ? <EyeSlash onClick={changeisShowRetype} /> : <Eye onClick={changeisShowRetype} />;

  return (
    <>
      <Head>
        <title>Edit Rak</title>
      </Head>
      <h1 className="title">Edit Rak</h1>
      <form onSubmit={onSubmit}>
        <NamaRak className={state.warnaTextbox} value={namaRak} onChange={onChangeNamaRak} icon={state.icon} hasil={state.hasil} />
        {/* <Kode className={kodeState.warnaTextbox} value={kode} onChange={onChangeKodeKota} icon={kodeState.icon} hasil={kodeState.hasil} /> */}
        <FieldButton nama="Submit" />
      </form>
      <Modal className={isModalClosed === false && "is-active"}>
        {isSubmitSuccess === true ? (
          <IsiModalSuccess pesan="Berhasil Mengupdate Rak">
            <button className="button is-primary" onClick={() => router.push("/Produk/Rak")}>
              OK
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

export async function getServerSideProps(context) {
  const query = "select nama_rak,status from rak where id_rak=?";
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
  return <Layout clicked="Rak">{page}</Layout>;
};
