import { ImageOfAdora, Menu, MenuWithDropdown } from "./LayoutComponent";
import nextConfig from "../next.config";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { useSession, getSession, signOut } from "next-auth/react";
import { NextResponse } from "next/server";
import { redirect, useRouter } from "next/navigation";
const Layout = ({ children, clicked }) => {
  const clickedMenu = clicked;
  const dropdownProduk = [
    "Daftar Item?p=1",
    "Jenis Item",
    "Satuan Item",
    "Rak",
  ];
  const dropdownTransaksi = [
    "Transaksi Stok Opname",
    "Transaksi Pembelian",
    "Transaksi Penjualan",
  ];
  const dropdownLaporan = [
    "Laporan Penjualan",
    "Laporan Pembelian",
    "Laporan Item Terlaris",
  ];
  const dropdownSupplier = ["Data Supplier", "Kota"];

  const { data: session, status } = useSession({ required: true });
  const Router = useRouter();

  const AksesPemilik = (
    <>
      <Menu clickedMenu={clickedMenu} nama="Dashboard" />
      <Menu clickedMenu={clickedMenu} nama="Kasir" />
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        dropdown={dropdownSupplier}
        nama="Supplier"
      />
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        nama="Transaksi"
        dropdown={dropdownTransaksi}
      />
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        nama="Produk"
        dropdown={dropdownProduk}
      />
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        nama="Laporan"
        dropdown={dropdownLaporan}
      />
    </>
  );
  const AksesTTK = (
    <>
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        dropdown={dropdownSupplier}
        nama="Supplier"
      />
      <MenuWithDropdown
        clickedMenu={clickedMenu}
        nama="Transaksi"
        dropdown={dropdownTransaksi}
      />
    </>
  );
  const AksesKasir = <Menu clickedMenu={clickedMenu} nama="Kasir" />;

  return (
    <>
      <div className="columns">
        <div className="column is-2">
          <aside className="menu" style={{ height: 500, overflow: "auto" }}>
            <ul className="menu-list">
              <ImageOfAdora />
              {status === "authenticated" && session.user.role === "pemilik"
                ? AksesPemilik
                : status === "authenticated" && session.user.role === "kasir"
                ? AksesKasir
                : status === "authenticated" && session.user.role === "ttk"
                ? AksesTTK
                : null}

              {/* <Menu clickedMenu={clickedMenu} nama="Dashboard" />
              <Menu clickedMenu={clickedMenu} nama="Kasir" />
              <MenuWithDropdown
                clickedMenu={clickedMenu}
                dropdown={dropdownSupplier}
                nama="Supplier"
              />
              <MenuWithDropdown
                clickedMenu={clickedMenu}
                nama="Transaksi"
                dropdown={dropdownTransaksi}
              />
              <MenuWithDropdown
                clickedMenu={clickedMenu}
                nama="Produk"
                dropdown={dropdownProduk}
              />
              <MenuWithDropdown
                clickedMenu={clickedMenu}
                nama="Laporan"
                dropdown={dropdownLaporan}
              /> */}
            </ul>
          </aside>
          {/* 60 */}
          <div
            className="columns"
            style={{
              marginTop:
                status === "authenticated" && session.user.role === "pemilik"
                  ? 60
                  : 110,
            }}
          >
            <div className="column">
              <aside className="menu">
                <ul className="menu-list">
                  {status === "authenticated" &&
                    session.user.role === "pemilik" && (
                      <Menu clickedMenu={clickedMenu} nama="Pengaturan User" />
                    )}

                  <Menu
                    clickedMenu={clickedMenu}
                    nama="Log Out"
                    onClick={signOut}
                  />
                </ul>
              </aside>
            </div>
          </div>
        </div>
        <div
          className="column"
          style={{
            padding: "100px",
            backgroundColor: "#f3f3f3",
            overflowY: "auto",
            height: 688,
          }}
        >
          <span
            style={{
              textAlign: "right",
              fontWeight: "bold",
              borderStyle: "solid",
              float: "right",
              padding: "5px",
            }}
          >
            <i className="far fa-user-circle" style={{ marginRight: "5px" }} />
            {status === "authenticated" && session.user.username}
          </span>
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
// 688
