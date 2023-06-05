import Head from "next/head";
import Layout from "../../../../../components/Layout";
import handlerQuery from "../../../../../lib/db";
import { NamaSupplier, KodeSupplier, Alamat, NoHP, FieldButton, Namereducer, Kodereducer, Alamatreducer, Nomorreducer, supplierinitValue, kodeinitValue, alamatinitValue, nomorinitValue, Modal, IsiModalSuccess, IsiModalFailed } from "../../../../../components/TambahSupplierComp";
import { useRouter } from "next/router";
import { useState, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
export default function Edit({ hasil }) {
  const [state, dispacth] = useReducer(Namereducer, supplierinitValue);
  const [kodeState, dispacthKode] = useReducer(Kodereducer, kodeinitValue);
  const [alamatState, dispacthAlamat] = useReducer(Alamatreducer, alamatinitValue);
  const [nomorState, dispacthNomor] = useReducer(Nomorreducer, nomorinitValue);
  const [namaSupplier, setNamaSupplier] = useState(hasil[0].nama_supplier);
  const [kodeSupplier, setKodeSupplier] = useState(hasil[0].kode_supplier);
  const [alamatSupplier, setAlamatSupplier] = useState(hasil[0].alamat);
  const [nomorSupplier, setNomorSupplier] = useState(hasil[0].no_hp);
  // console.log(hasil[0].nama_supplier);
  // console.log(hasil[0].kode_supplier);
  // console.log(hasil[0].alamat);
  // console.log(hasil[0].no_hp);
  const [isShow, setShow] = useState(false);
  const [isModalClosed, setModalClosed] = useState(true);
  const [isSubmitSuccess, setisSubmitSuccess] = useState(false);
  const [isShowRetype, setShowRetype] = useState(false);
  const router = useRouter();
  const isDisabled =
    ((state.warnaTextbox === "input is-success" || state.warnaTextbox === "input") && kodeState.length === 8 && kodeRetype === kode) || state.warnaTextbox === "input is-success" || (state.warnaTextbox === "input" && kodeState.length === 0)
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

  const onChangeKodeSupplier = async (e) => {
    setKodeSupplier(e.target.value);
    dispacthKode({ type: "loading" });
    if (e.target.value === "" || e.target.value.length > 15) {
      setKodeSupplier(e.target.value);
      dispacthKode({ type: "not allowed" });
      return;
    }
    try {
      const response = await axios.post("/api/CheckKodeSupplier", {
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

  const onChangeAlamatSupplier = async (e) => {
    setAlamatSupplier(e.target.value);
    dispacthAlamat({ type: "loading" });
    if (e.target.value === "" || e.target.value.length > 15) {
      setAlamatSupplier(e.target.value);
      dispacthAlamat({ type: "not allowed" });
      return;
    }
    try {
      const response = await axios.post("/api/CheckAlamatSupplier", {
        sendNamaAlamat: e.target.value,
        tujuan: "edit",
        id: router.query.id,
      });
      if (response.data === "available") {
        dispacthAlamat({ type: "available" });
      } else if (response.data === "not available") {
        dispacthAlamat({ type: "not available" });
      }
    } catch (e) {
      dispacthAlamat({ type: "error" });
    }
  };

  const onChangeNomorSupplier = async (e) => {
    setNomorSupplier(e.target.value);
    dispacthNomor({ type: "loading" });
    if (e.target.value === "" || e.target.value.length > 15) {
      setNomorSupplier(e.target.value);
      dispacthNomor({ type: "not allowed" });
      return;
    }
    try {
      const response = await axios.post("/api/CheckNomorSupplier", {
        sendNomorHP: e.target.value,
        tujuan: "edit",
        id: router.query.id,
      });
      if (response.data === "available") {
        dispacthNomor({ type: "available" });
      } else if (response.data === "not available") {
        dispacthNomor({ type: "not available" });
      }
    } catch (e) {
      dispacthNomor({ type: "error" });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("/api/EditSupplier", {
        namaSupplier,
        kodeSupplier,
        alamatSupplier,
        nomorSupplier,
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
        <title>Edit Data Supplier</title>
      </Head>
      <h1 className="title">Edit Data Supplier</h1>
      <form onSubmit={onSubmit}>
        <NamaSupplier className={state.warnaTextbox} value={namaSupplier} onChange={onChangeNamaSupplier} icon={state.icon} hasil={state.hasil} />
        <KodeSupplier className={kodeState.warnaTextbox} value={kodeSupplier} onChange={onChangeKodeSupplier} icon={kodeState.icon} hasil={kodeState.hasil} />
        <Alamat className={alamatState.warnaTextbox} value={alamatSupplier} onChange={onChangeAlamatSupplier} icon={alamatState.icon} hasil={alamatState.hasil} />
        <NoHP className={nomorState.warnaTextbox} value={nomorSupplier} onChange={onChangeNomorSupplier} icon={nomorState.icon} hasil={nomorState.hasil} />
        <FieldButton nama="Submit" />
      </form>
      <Modal className={isModalClosed === false && "is-active"}>
        {isSubmitSuccess === true ? (
          <IsiModalSuccess pesan="Berhasil Mengupdate Data Supplier">
            <button className="button is-primary" onClick={() => router.push("/Supplier/DataSupplier")}>
              OK
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

export async function getServerSideProps(context) {
  const query = "select id_supplier, kode_supplier, nama_supplier," + 
  "alamat, no_hp, kode_kota, supplier.status from supplier JOIN kota ON kota.id_kota = supplier.id_kota " +
  "WHERE id_supplier =?";
  // const query = "SELECT nama_supplier, kode_supplier, alamat, no_hp, id_kota, status FROM supplier WHERE id_supplier=?";
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
  return <Layout clicked="Data Supplier">{page}</Layout>;
};
