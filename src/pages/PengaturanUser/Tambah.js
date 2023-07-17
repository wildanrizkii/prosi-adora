import Head from "next/head";
import Layout from "../../../components/Layout";
import { useReducer, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import {
  Username,
  Password,
  FieldButton,
  Role,
  Usernamereducer,
  userinitValue,
  passwordReducer,
  passinitValue,
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
} from "../../../components/TambahUserComp";

export default function Tambah() {
  const [state, dispacth] = useReducer(Usernamereducer, userinitValue);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShow, setShow] = useState(false);
  const [passState, dispacthPass] = useReducer(passwordReducer, passinitValue);
  const [role, setRole] = useState("pemilik");
  const [isModalClosed, setModalClosed] = useState(true);
  const [isSubmitSuccess, setisSubmitSuccess] = useState(false);
  const [isShowRetype, setShowRetype] = useState(false);
  const [passRetype, setPassRetype] = useState("");
  const router = useRouter();
  const isDisabled =
    state.warnaTextbox === "input is-success" &&
    password.length === 8 &&
    passRetype === password
      ? false
      : true;
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
  const typeOfIcon =
    isShow === false ? (
      <EyeSlash onClick={changeisShow} />
    ) : (
      <Eye onClick={changeisShow} />
    );

  const onChangeUsername = async (e) => {
    setUsername(e.target.value);
    dispacth({ type: "loading" });
    if (e.target.value === "" || e.target.value.length > 15) {
      setUsername(e.target.value);
      dispacth({ type: "not allowed" });
      return;
    }
    try {
      const response = await axios.post("/api/CheckUsername", {
        sendUsername: e.target.value,
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
  const onChangePassword = (e) => {
    if (e.target.value.length < 8 || e.target.value.length > 8) {
      dispacthPass({ type: "tidak boleh" });
    } else {
      dispacthPass({ type: "boleh" });
    }
    setPassword(e.target.value);
  };
  const onChangeRetype = (e) => {
    setPassRetype(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/TambahUser", {
        username,
        password,
        role,
      });
      setisSubmitSuccess(true);
    } catch (e) {
      setisSubmitSuccess(false);
    } finally {
      setModalClosed(false);
    }
  };
  const onChangeRole = (e) => {
    setRole(e.target.value);
  };
  const MenambahkanUserLagi = () => {
    dispacth({ type: "default" });
    dispacthPass({ type: "default" });
    setUsername("");
    setPassword("");
    setPassRetype("");
    setShow(false);
    setShowRetype(false);
    setRole("pemilik");
    setModalClosed();
  };

  const typeOfIcon2 =
    isShowRetype === false ? (
      <EyeSlash onClick={changeisShowRetype} />
    ) : (
      <Eye onClick={changeisShowRetype} />
    );

  const hasilRetype =
    passRetype === password && password.length === 8 ? (
      <p className="help is-success" style={{ fontSize: "15px" }}>
        password sudah sama!
      </p>
    ) : password !== passRetype && password.length === 8 ? (
      <p className="help is-danger" style={{ fontSize: "15px" }}>
        password tidak sama!
      </p>
    ) : (
      ""
    );
  const warnaTexboxtRetype =
    passRetype === password && password.length === 8
      ? "input is-success"
      : password !== passRetype && password.length === 8
      ? "input is-danger"
      : "input";

  return (
    <>
      <Head>
        <title>Tambah User</title>
      </Head>
      <h1 className="title">Tambah User</h1>
      <form onSubmit={onSubmit}>
        <Username
          className={state.warnaTextbox}
          value={username}
          onChange={onChangeUsername}
          icon={state.icon}
          hasil={state.hasil}
        />
        <Role onChange={onChangeRole} value={role} />
        <Password
          className={passState.warnaTextbox}
          type={isShow === true ? "text" : "password"}
          value={password}
          onChange={onChangePassword}
          icon={typeOfIcon}
          hasil={passState.hasil}
        />
        <Password
          className={warnaTexboxtRetype}
          type={isShowRetype === true ? "text" : "password"}
          value={passRetype}
          onChange={onChangeRetype}
          icon={typeOfIcon2}
          hasil={hasilRetype}
          label="Retype-Password"
          disabled={
            passState.warnaTextbox === "input is-success" ? false : true
          }
        />
        <FieldButton nama="Submit" disabled={isDisabled} />
      </form>
      <Modal className={isModalClosed === false && "is-active"}>
        {isSubmitSuccess === true ? (
          <IsiModalSuccess pesan="BERHASIL MENAMBAHKAN USER">
            <button
              className="button is-primary"
              onClick={MenambahkanUserLagi}
              style={{ marginRight: "10px" }}
            >
              Lanjutkan Menambah User
            </button>
            <button
              className="button is-primary"
              onClick={() => router.push("/PengaturanUser")}
            >
              Kembali Ke Pengaturan User
            </button>
          </IsiModalSuccess>
        ) : (
          <IsiModalFailed
            pesan={
              <>
                Tidak berhasil menambahkan user
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
Tambah.getLayout = function getLayout(page) {
  return <Layout clicked="Pengaturan User">{page}</Layout>;
};
