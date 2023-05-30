import Script from "next/script";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Pembungkus, Gambar, Field, Icon } from "../../components/LoginComponents";
import Head from "next/head";
import { signIn } from "next-auth/react";

export default function Index() {
  return (
    <>
      <Head>
        <title>SI Adora</title>
      </Head>
      <section className="hero is-success is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <p className="title">Sistem Informasi</p>
            <p className="subtitle">Apotek Adora</p>
            <button className="button" onClick={() => signIn()}>
              Masuk
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
