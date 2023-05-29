import Script from "next/script";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Pembungkus,
  Gambar,
  Field,
  Icon,
} from "../../components/LoginComponents";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasil, setHasil] = useState("");
  const [kelas, setKelas] = useState("button is-success is-fullwidth");
  const [disable, setDisabled] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const checkUsernameAndPassword = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setKelas(kelas + " is-loading");
    const Data = { x: username, y: password };

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/Kasir",
    });
    console.log(res);
    if (res.error === null) {
      // router.replace("/Dashboard");
      setDisabled(false);
      setKelas("button is-success is-fullwidth");
    } else {
      console.log(res.error);
      setHasil(res.error);
      setDisabled(false);
      setKelas("button is-success is-fullwidth");
    }
  };
  if (status === "authenticated") {
    if (session.user.role === "pemilik") {
      router.replace("/Dashboard");
    } else if (session.user.role === "kasir") {
      router.replace("/Kasir");
    } else if (session.user.role === "ttk") {
      router.replace("/Supplier/DataSupplier");
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Pembungkus>
        <Gambar />
        <form onSubmit={checkUsernameAndPassword}>
          {/* field username */}
          <Field>
            <input
              className="input is-normal is-success"
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="username"
              required
              disabled={disable}
            />
            <Icon kelas="fa-user" />
          </Field>
          {/* password */}
          <Field>
            <input
              className="input is-normal is-success"
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="password"
              required
              disabled={disable}
              maxLength="8"
              minLength="8"
            />
            <Icon kelas="fa-lock" />
          </Field>
          {/* field button */}
          <div className="field">
            <button type="submit" className={kelas}>
              LOGIN
            </button>
          </div>
          {/* hasil */}
          <div className="field">
            <p id="hasil" className="help is-danger">
              {hasil}
            </p>
          </div>
        </form>
      </Pembungkus>
    </>
  );
};

export default Login;
