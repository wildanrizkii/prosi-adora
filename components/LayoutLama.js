import { ImageOfAdora, Menu, MenuWithDropdown } from "./LayoutComponent";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
const LayoutLama = ({ children, clicked }) => {
  const clickedMenu = clicked;
  const dropdownProduk = [
    { nama: "Daftar Item?p=1", icon: "fas fa-capsules" },
    { nama: "Jenis Item", icon: "fas fa-pills" },
    { nama: "Satuan Item", icon: "fas fa-prescription-bottle" },
    { nama: "Rak", icon: "fas fa-cubes" },
  ];
  const dropdownTransaksi = [
    { nama: "Transaksi Stok Opname", icon: "fas fa-file-invoice-dollar" },
    { nama: "Transaksi Pembelian", icon: "fas fa-file-invoice-dollar" },
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

  const { data: session, status } = useSession({ required: true });
  const Router = useRouter();

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
          {/* pilihan profile 2 */}
          {/* <span
            style={{
              textAlign: "right",
              fontWeight: "bold",
              borderStyle: "solid",
              borderRadius: "20px",
              float: "right",
              padding: "5px",
              backgroundColor: "white",
            }}
          >
            <i className="fas fa-user" style={{ marginRight: "5px" }} />
            {status === "authenticated" && session.user.username}
          </span> */}
          {/* pilihan profile 2 */}
          {/* pilihan profile 1 */}
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
                  <span>
                    <i className="fas fa-user" style={{ marginRight: "5px" }} />
                    {status === "authenticated" && session.user.username}
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="dropdown-menu2" role="menu">
                <div className="dropdown-content">
                  <div className="dropdown-item">
                    <strong>
                      USER ID :{" "}
                      {status === "authenticated" && session.user.idUser}
                    </strong>
                    <hr className="dropdown-divider" />
                    <strong>
                      USERNAME :{" "}
                      {status === "authenticated" && session.user.username}
                    </strong>
                    <hr className="dropdown-divider" />
                    <strong>
                      ROLE :{" "}
                      {status === "authenticated" &&
                        session.user.role.toUpperCase()}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* pilihan profile 1 */}
          {children}
        </div>
      </div>
    </>
  );
};

export default LayoutLama;
