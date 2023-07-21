import Head from "next/head";
import Layout from "../../../../components/Layout";
import handlerQuery from "../../../../lib/db";
import {
  Username,
  Password,
  Role,
  FieldButton,
  Usernamereducer,
  passwordReducer,
  userinitValue,
  passinitValue,
  Modal,
  IsiModalFailed,
  IsiModalSuccess,
} from "../../../../components/TambahUserComp";
import { useRouter } from "next/router";
import { useState, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
export default function Edit({ hasil }) {
  const [state, dispacth] = useReducer(Usernamereducer, userinitValue);
  const [username, setUsername] = useState(hasil[0].username);
  const [password, setPassword] = useState("");
  const [isShow, setShow] = useState(false);
  const [passState, dispacthPass] = useReducer(passwordReducer, passinitValue);
  const [role, setRole] = useState(hasil[0].role);
  const [isModalClosed, setModalClosed] = useState(true);
  const [isSubmitSuccess, setisSubmitSuccess] = useState(false);
  const [isShowRetype, setShowRetype] = useState(false);
  const [passRetype, setPassRetype] = useState("");
  const router = useRouter();
  const isDisabled =
    ((state.warnaTextbox === "input is-success" ||
      state.warnaTextbox === "input") &&
      password.length === 8 &&
      passRetype === password) ||
    state.warnaTextbox === "input is-success" ||
    (state.warnaTextbox === "input" && password.length === 0)
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
        tujuan: "edit",
        id: router.query.id,
      });
      if (response.data === "BISA") {
        dispacth({ type: "available" });
      } else if (response.data === "TIDAK BISA") {
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
      await axios.patch("/api/EditUser", {
        username,
        password,
        role,
        id: router.query.id,
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
        <title>Edit User</title>
      </Head>
      <h1 className="title">Edit User</h1>
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
          label="Password Pengganti"
        />
        <Password
          className={warnaTexboxtRetype}
          type={isShowRetype === true ? "text" : "password"}
          value={passRetype}
          onChange={onChangeRetype}
          icon={typeOfIcon2}
          hasil={hasilRetype}
          label="Retype-Password Pengganti"
          disabled={
            passState.warnaTextbox === "input is-success" ? false : true
          }
        />
        <FieldButton nama="Submit" disabled={isDisabled} />
      </form>
      <Modal className={isModalClosed === false && "is-active"}>
        {isSubmitSuccess === true ? (
          <IsiModalSuccess pesan="BERHASIL MENGUPDATE USER">
            <button
              className="button is-primary"
              onClick={() => router.push("/PengaturanUser")}
            >
              OK
            </button>
          </IsiModalSuccess>
        ) : (
          <IsiModalFailed pesan={<>GAGAL MENGUPDATE USER</>}>
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
  const query = "select username,role from user where idUser=?";
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
  return <Layout clicked="Pengaturan User">{page}</Layout>;
};
