import Head from "next/head";
import Layout from "../../../components/Layout";
import { useReducer, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
function Usernamereducer(state, action) {
  if (action.type === "loading") {
    return {
      hasil: (
        <p className="help is-info" style={{ fontSize: "15px" }}>
          loading
        </p>
      ),
      warnaTextbox: "input is-info",
      icon: <FontAwesomeIcon icon="spinner" spin color="blue" />,
    };
  } else if (action.type === "available") {
    return {
      hasil: (
        <p className="help is-success" style={{ fontSize: "15px" }}>
          username tersedia
        </p>
      ),
      warnaTextbox: "input is-success",
      icon: <FontAwesomeIcon icon="check" color="green" />,
    };
  } else if (action.type === "not available") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          username sudah dipakai
        </p>
      ),
      warnaTextbox: "input is-danger",
      icon: <FontAwesomeIcon icon="times" color="red" />,
    };
  } else if (action.type === "not allowed") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          username tidak memenuhi ketentuan
        </p>
      ),
      warnaTextbox: "input is-danger",
      icon: <FontAwesomeIcon icon="times" color="red" />,
    };
  } else if (action.type === "error") {
    return {
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          Terjadi masalah saat mengakses database
        </p>
      ),
      warnaTextbox: "input is-danger",
      icon: <FontAwesomeIcon icon="times" color="red" />,
    };
  } else if (action.type === "default") {
    return initValue;
  }
}

const initValue = {
  hasil: (
    <p className="help" style={{ fontSize: "15px" }}>
      Silahkan masukan username !
    </p>
  ),
  warnaTextbox: "input",
  icon: null,
};

const passinitValue = {
  warnaTextbox: "input",
  hasil: (
    <p className="help" style={{ fontSize: "15px" }}>
      Silahkan masukan password!
    </p>
  ),
};

const passwordReducer = (state, action) => {
  if (action.type === "boleh") {
    return {
      warnaTextbox: "input is-success",
      hasil: (
        <p className="help is-success" style={{ fontSize: "15px" }}>
          password sudah sesuai ketentuan!
        </p>
      ),
    };
  } else if (action.type === "tidak boleh") {
    return {
      warnaTextbox: "input is-danger",
      hasil: (
        <p className="help is-danger" style={{ fontSize: "15px" }}>
          password tidak sesuai ketentuan!
        </p>
      ),
    };
  } else if (action.type === "default") {
    return passinitValue;
  }
};
export default function Tambah() {
  const [state, dispacth] = useReducer(Usernamereducer, initValue);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShow, setShow] = useState(false);
  const [passState, dispacthPass] = useReducer(passwordReducer, passinitValue);
  const [role, setRole] = useState("Pemilik");
  const [isModalClosed, setModalClosed] = useState(true);
  const [isSubmitSuccess, setisSubmitSuccess] = useState(false);
  const router = useRouter();
  const changeisShow = (e) => {
    setShow(!isShow);
  };
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
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/TambahUser", {
        username,
        password,
        role,
      });
      setisSubmitSuccess(true);
      // setTimeout(() => {
      //   router.push("/PengaturanUser");
      // }, 2000);
    } catch (e) {
      setisSubmitSuccess(false);
    } finally {
      setModalClosed(false);
    }
  };

  return (
    <>
      <Head>
        <title>Tambah User</title>
      </Head>
      <h1 className="title">Tambah User</h1>
      <form onSubmit={onSubmit}>
        <div className="field">
          <label className="label">Username</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className={`${state.warnaTextbox}`}
              type="text"
              placeholder="Username"
              value={username}
              onChange={onChangeUsername}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-user" />
            </span>
            <span className="icon is-small is-right">{state.icon}</span>
          </div>
          {state.hasil}
        </div>
        <div className="field">
          <label className="label">Role</label>
          <div className="control">
            <div className="select">
              <select onChange={(e) => setRole(e.target.value)} value={role}>
                <option value="pemilik">Pemilik</option>
                <option value="kasir">Kasir</option>
                <option value="ttk">TTK</option>
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className={passState.warnaTextbox}
              type={isShow === true ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={onChangePassword}
              maxLength="8"
              minLength="8"
            />
            <span className="icon is-small is-left">
              <i className="fas fa-lock" />
            </span>
            <span className="icon is-small is-right">
              {isShow === false ? (
                <FontAwesomeIcon
                  icon="eye-slash"
                  onClick={changeisShow}
                  pointerEvents="all"
                  cursor="pointer"
                />
              ) : (
                <FontAwesomeIcon
                  icon="eye"
                  onClick={changeisShow}
                  pointerEvents="all"
                  cursor="pointer"
                />
              )}
            </span>
          </div>
          {passState.hasil}
        </div>
        <div className="field">
          <div className="control">
            <button
              className="button is-link"
              disabled={
                state.warnaTextbox === "input is-success" &&
                password.length === 8
                  ? false
                  : true
              }
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <div className={`modal ${isModalClosed === false && "is-active"}`}>
        <div className="modal-background" />
        <div className="modal-content">
          {/* Any other Bulma elements you want */}
          {isSubmitSuccess === true ? (
            <article className="message">
              <div
                className="message-body"
                style={{
                  fontSize: "25px",
                  textAlign: "center",
                  color: "green",
                }}
              >
                Berhasil menambahkan user
              </div>
              <button
                className="button is-primary"
                onClick={() => {
                  dispacth({ type: "default" });
                  dispacthPass({ type: "default" });
                  setUsername("");
                  setPassword("");
                  setRole("pemilik");
                  setModalClosed();
                }}
                style={{
                  marginLeft: "70px",
                  marginRight: "20px",
                  marginBottom: "10px",
                }}
              >
                Lanjutkan menambah User
              </button>
              <button
                className="button is-primary"
                onClick={() => router.push("/PengaturanUser")}
              >
                Kembali Ke Pengaturan User
              </button>
            </article>
          ) : (
            <article className="message">
              <div
                className="message-body"
                style={{ fontSize: "25px", textAlign: "center", color: "red" }}
              >
                Tidak berhasil menambahkan user
                <br />
                Silahkan Coba Lagi!
              </div>
              <button
                className="button is-primary"
                style={{ marginLeft: "270px", marginBottom: "20px" }}
                onClick={() => setModalClosed(true)}
              >
                OK
              </button>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
Tambah.getLayout = function getLayout(page) {
  return <Layout clicked="Pengaturan User">{page}</Layout>;
};
