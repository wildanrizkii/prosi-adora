import { ImageOfAdora, Menu, MenuWithDropdown } from "./LayoutComponent";
import nextConfig from "../next.config";
import { useEffect, useState } from "react";
import axios from "axios";
const Layout = ({ children, clicked }) => {
  const clickedMenu = clicked;
  const dropdownProduk = ["Daftar Item", "Jenis Item", "Satuan Item"];
  const dropdownTransaksi = ["Transaksi Stok Opname", "Transaksi Pembelian", "Transaksi Penjualan"];
  const dropdownLaporan = ["Laporan Penjualan", "Laporan Pembelian", "Laporan Item Terlaris"];
  const dropdownSupplier = ["Data Supplier", "Kota"];
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function getUsername() {
      const hasil = await axios.get("/api/get-session");
      setUsername(hasil.data[0]);
    }
    getUsername();
  });

  return (
    <>
      <div className="columns">
        <div className="column is-2">
          <aside className="menu" style={{ height: 500, overflow: "auto" }}>
            <ul className="menu-list">
              <ImageOfAdora />
              <Menu clickedMenu={clickedMenu} nama="Dashboard"></Menu>
              <Menu clickedMenu={clickedMenu} nama="Kasir"></Menu>
              <MenuWithDropdown clickedMenu={clickedMenu} nama="Supplier" dropdown={dropdownSupplier}></MenuWithDropdown>
              <MenuWithDropdown clickedMenu={clickedMenu} nama="Transaksi" dropdown={dropdownTransaksi}></MenuWithDropdown>
              <MenuWithDropdown clickedMenu={clickedMenu} nama="Produk" dropdown={dropdownProduk}></MenuWithDropdown>
              <MenuWithDropdown clickedMenu={clickedMenu} nama="Laporan" dropdown={dropdownLaporan}></MenuWithDropdown>
            </ul>
          </aside>
          <div className="columns" style={{ marginTop: 60 }}>
            <div className="column">
              <aside className="menu">
                <ul className="menu-list">
                  <Menu clickedMenu={clickedMenu} nama="Pengaturan User"></Menu>
                  <Menu clickedMenu={clickedMenu} nama="Log Out"></Menu>
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
          <div
            style={{
              textAlign: "right",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            {username}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
// 688
