import { ImageOfAdora, Menu, MenuWithDropdown } from "./LayoutComponent";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Modal, FieldWithEye, FieldKhusus } from "./AllComponent";
import { Password, passwordReducer, passinitValue } from "./TambahUserComp";
import { useReducer, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
const Layout = ({ children, clicked }) => {
  const clickedMenu = clicked;
  const dropdownProduk = [
    { nama: "Daftar Item?p=1", icon: "fas fa-capsules" },
    { nama: "Jenis Item", icon: "fas fa-pills" },
    { nama: "Satuan Item", icon: "fas fa-prescription-bottle" },
    { nama: "Rak", icon: "fas fa-cubes" },
  ];
  const dropdownTransaksi = [
    { nama: "Transaksi Stok Opname", icon: "fas fa-file-invoice-dollar" },
    { nama: "Transaksi Pembelian?p=1", icon: "fas fa-file-invoice-dollar" },
    { nama: "Transaksi Penjualan", icon: "fas fa-file-invoice-dollar" },
  ];
  const dropdownLaporan = [
    { nama: "Laporan Penjualan", icon: "far fa-file-alt" },
    { nama: "Laporan Pembelian", icon: "far fa-file-alt" },
    { nama: "Laporan Item Terlaris", icon: "far fa-file-alt" },
  ];
  const dropdownSupplier = [
    { nama: "Data Supplier", icon: "fas fa-address-book" },
    { nama: "Kota", icon: "fas fa-city" },
  ];

  const { data: session, status, update } = useSession({ required: true });
  const Router = useRouter();

  // Ganti Username
  const [modalFormUsername, setModalFormUsername] = useState(false);
  const [fieldUsername, setFieldUsername] = useState({
    "Username Baru": "",
    "Username Baru Checked": false,
  });
  const submitUsername = fieldUsername["Username Baru Checked"] === true;
  const [hasilUsername, setHasilUsername] = useState(undefined);
  //

  // Ganti Password
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

  const [modalFormPassword, setModalFormPassword] = useState(false);
  // field Password
  const [password, setPassword] = useState("");
  const [passstate, dispacthpass] = useReducer(passwordReducer, passinitValue);
  const [isShow, setShow] = useState(false);
  const changeisShow = (e) => {
    setShow(!isShow);
  };
  const typeOfIcon =
    isShow === false ? (
      <EyeSlash onClick={changeisShow} />
    ) : (
      <Eye onClick={changeisShow} />
    );
  const onChangePassword = (e) => {
    if (e.target.value.length < 8 || e.target.value.length > 8) {
      dispacthpass({ type: "tidak boleh" });
    } else {
      dispacthpass({ type: "boleh" });
    }
    setPassword(e.target.value);
  };
  //
  // field Retype
  const [passRetype, setPassRetype] = useState("");
  const [isShowRetype, setShowRetype] = useState(false);
  const isDisabled =
    password.length === 8 && passRetype === password ? false : true;

  const changeisShowRetype = (e) => {
    setShowRetype(!isShowRetype);
  };

  const onChangeRetype = (e) => {
    setPassRetype(e.target.value);
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

  const [hasilPass, setHasilPass] = useState(undefined);
  const cleanupPass = () => {
    dispacthpass({ type: "default" });
    setPassword("");
    setPassRetype("");
    setShow(false);
    setShowRetype(false);
    setHasilPass(undefined);
    setModalFormPassword(false);
  };
  const AksesPemilik = (
    <>
      <Menu
        clickedMenu={clickedMenu}
        nama="Dashboard"
        icon="fas fa-chart-line"
      />
      <Menu clickedMenu={clickedMenu} nama="Kasir" icon="fas fa-receipt" />
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        dropdown={dropdownSupplier}
        nama="Supplier"
        icon="fas fa-user-tie"
      />
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        nama="Transaksi"
        dropdown={dropdownTransaksi}
        icon="fas fa-wallet"
      />
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        nama="Produk"
        dropdown={dropdownProduk}
        icon="fas fa-box"
      />
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        nama="Laporan"
        dropdown={dropdownLaporan}
        icon="fas fa-clipboard-list"
      />
    </>
  );
  const AksesTTK = (
    <>
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        dropdown={dropdownSupplier}
        nama="Supplier"
        icon="fas fa-user-tie"
      />
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        nama="Transaksi"
        dropdown={dropdownTransaksi}
        icon="fas fa-wallet"
      />
    </>
  );
  const AksesKasir = (
    <Menu clickedMenu={clickedMenu} nama="Kasir" icon="fas fa-receipt" />
  );
  const idUser = status === "authenticated" && session.user.idUser;
  const CheckUsername = async (Username) => {
    if (Username === "") {
      return "default";
    }
    const res = await axios.post("/api/CheckUsername", {
      sendUsername: Username,
      tujuan: "edit",
      id: idUser,
    });
    return res.data;
  };
  const runCode = () => {
    const Username = document.getElementById("Username");

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    nativeInputValueSetter.call(Username, "");

    const event = new Event("input", { bubbles: true });
    Username.dispatchEvent(event);
  };
  const onsubmitUsername = async (e) => {
    e.preventDefault();

    console.log("SUBMIT USERNAME");
    try {
      const res = await axios.patch("/api/ChangeUsername", {
        UsernameBaru: fieldUsername["Username Baru"],
        IdUser: idUser,
      });
      update({ Username: fieldUsername["Username Baru"] });
      runCode();
      setHasilUsername(undefined);
      setModalFormUsername(false);
    } catch (e) {
      setHasilUsername(e.response.data);
    }
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();
    console.log("SUBMIT PASS");
    console.log("PASSNYA " + password);
    try {
      const res = await axios.patch("/api/ChangePassword", {
        passwordBaru: password,
        UserId: idUser,
      });
      cleanupPass();
    } catch (e) {
      setHasilPass(e.response.data);
    }
  };

  return (
    <>
      <div className="columns" style={{ marginTop: "0" }}>
        <div className="column is-2" style={{ height: "100vh" }}>
          <aside className="menu" style={{ height: "73vh", overflow: "auto" }}>
            <ul className="menu-list">
              <ImageOfAdora />
              {status === "authenticated" && session.user.role === "pemilik"
                ? AksesPemilik
                : status === "authenticated" && session.user.role === "kasir"
                ? AksesKasir
                : status === "authenticated" && session.user.role === "ttk"
                ? AksesTTK
                : null}
            </ul>
          </aside>

          <aside
            className="menu"
            style={{
              height: "24vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <ul className="menu-list">
              {status === "authenticated" &&
                session.user.role === "pemilik" && (
                  <Menu
                    clickedMenu={clickedMenu}
                    nama="Pengaturan User"
                    icon="fas fa-users-cog"
                  />
                )}

              <Menu
                clickedMenu={clickedMenu}
                nama="Log Out"
                onClick={signOut}
                icon="fas fa-sign-out-alt"
              />
            </ul>
          </aside>
        </div>
        <div
          className="column"
          style={{
            backgroundColor: "#f3f3f3",
            height: "100vh",
            padding: "13vh",
            overflowY: "auto",
          }}
        >
          <div
            className="container"
            style={{ display: "flex", justifyContent: "end" }}
          >
            <div className="dropdown is-hoverable">
              <div className="dropdown-trigger">
                <button
                  className="button"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu2"
                >
                  <span style={{ width: "10vw" }}>
                    <i className="fas fa-user" style={{ marginRight: "5px" }} />
                    {status === "authenticated" && session.user.username}
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="dropdown-menu2" role="menu">
                <div className="dropdown-content">
                  <div
                    className="dropdown-item"
                    style={{ textAlign: "center" }}
                  >
                    <strong>
                      USER ID : <br />
                      {status === "authenticated" && session.user.idUser}
                    </strong>
                    <hr className="dropdown-divider" />
                    <strong>
                      USERNAME : <br />
                      {status === "authenticated" && session.user.username}
                    </strong>
                    <hr className="dropdown-divider" />
                    <strong>
                      ROLE : <br />
                      {status === "authenticated" &&
                        session.user.role.toUpperCase()}
                    </strong>
                    <hr className="dropdown-divider" />
                    <div style={{ textAlign: "center" }}>
                      <button
                        className="button is-success"
                        style={{ marginBottom: "5px" }}
                        onClick={() => setModalFormUsername(true)}
                      >
                        <i
                          className="fas fa-user"
                          style={{ color: "#ffffff", marginRight: "5px" }}
                        />
                        Ganti Username
                      </button>
                      <button
                        className="button is-success"
                        onClick={() => setModalFormPassword(true)}
                      >
                        <i
                          className="fas fa-key"
                          style={{ color: "#ffffff", marginRight: "5px" }}
                        />
                        Ganti Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal show={modalFormUsername === true && "is-active"}>
            <form onSubmit={onsubmitUsername}>
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Ganti Username</p>
                  <button
                    type="button"
                    className="delete"
                    aria-label="close"
                    onClick={() => {
                      runCode();
                      setModalFormUsername(false);
                      setHasilUsername(undefined);
                    }}
                  />
                </header>
                <section className="modal-card-body">
                  <FieldKhusus
                    nama="Username Baru"
                    value={fieldUsername["Username Baru"]}
                    onChange={setFieldUsername}
                    IconLeft="fas fa-user"
                    field={fieldUsername}
                    maxLength="15"
                    fungsiCheck={CheckUsername}
                    id="Username"
                  />
                  <p className="help is-danger">{hasilUsername}</p>
                </section>
                <footer className="modal-card-foot">
                  <button
                    className="button is-success"
                    disabled={!submitUsername}
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => {
                      runCode();
                      setModalFormUsername(false);
                      setHasilUsername(undefined);
                    }}
                  >
                    Cancel
                  </button>
                </footer>
              </div>
            </form>
          </Modal>
          <Modal show={modalFormPassword === true && "is-active"}>
            <form onSubmit={onSubmitPassword}>
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Ganti Password</p>
                  <button
                    type="button"
                    className="delete"
                    aria-label="close"
                    onClick={() => {
                      cleanupPass();
                    }}
                  />
                </header>
                <section className="modal-card-body">
                  <Password
                    className={passstate.warnaTextbox}
                    type={isShow === true ? "text" : "password"}
                    value={password}
                    onChange={onChangePassword}
                    icon={typeOfIcon}
                    hasil={passstate.hasil}
                  />
                  <Password
                    className={warnaTexboxtRetype}
                    type={isShowRetype === true ? "text" : "password"}
                    value={passRetype}
                    onChange={onChangeRetype}
                    icon={typeOfIcon2}
                    hasil={hasilRetype}
                    label="Retype-Password"
                    disabled={password.length === 8 ? false : true}
                  />
                  <p className="help is-danger">{hasilPass}</p>
                </section>
                <footer className="modal-card-foot">
                  <button className="button is-success" disabled={isDisabled}>
                    Save changes
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => cleanupPass()}
                  >
                    Cancel
                  </button>
                </footer>
              </div>
            </form>
          </Modal>
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
// 688
