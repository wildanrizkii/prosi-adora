import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Username,
  FieldWithEye,
  Pembungkus,
  Gambar,
} from "../../components/AllComponent";
import { useSession, signIn } from "next-auth/react";

const Login = () => {
  const [field, setField] = useState({ Username: "", Password: "" });
  const [hasil, setHasil] = useState("");
  const [kelas, setKelas] = useState("button is-success is-fullwidth");
  const [disable, setDisabled] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const checkUsernameAndPassword = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setKelas(kelas + " is-loading");
    const res = await signIn("credentials", {
      username: field.Username,
      password: field.Password,
      redirect: false,
    });
    console.log(res);
    if (res.status === 200) {
      setDisabled(false);
      setKelas("button is-success is-fullwidth");
    } else {
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
          <Username
            nama="Username"
            classInput="is-normal is-success"
            placeholder="Username"
            value={field.Username}
            onChange={setField}
            field={field}
            maxLength="15"
            disabled={disable}
          />
          {/* password */}
          <FieldWithEye
            nama="Password"
            classInput="is-normal is-success"
            placeholder="Password"
            value={field.Password}
            onChange={setField}
            field={field}
            maxLength="8"
            disabled={disable}
          />
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
