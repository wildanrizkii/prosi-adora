import Layout from "../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../lib/db";
import { useState } from "react";
import axios from "axios";
import {
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
} from "../../../components/AllComponent";

export default function Kasir({ hasil, stokInfo }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [itemQuantities, setItemQuantities] = useState({});
  const [customerType, setCustomerType] = useState("umum"); // Pelanggan: umum atau resep
  const [discountPercentage, setDiscountPercentage] = useState(0); // Potongan dalam persen
  const [totalBeforeDiscount, setTotalBeforeDiscount] = useState(0); // Total sebelum potongan
  const [paymentAmount, setPaymentAmount] = useState(0); // Jumlah bayar dari kasir
  const [changeAmount, setChangeAmount] = useState(0); // Jumlah kembalian
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [modal, setModal] = useState({
    pesan: undefined,
    isSuccess: true,
    isModalClosed: true,
  });
  const [compoundingFee, setCompoundingFee] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  const onClickTambah = (item) => {
    const newItemQuantities = { ...itemQuantities };
    if (newItemQuantities[item.id_item] === undefined) {
      newItemQuantities[item.id_item] = 0;
    }

    if (newItemQuantities[item.id_item] < stokInfo[item.id_item]) {
      newItemQuantities[item.id_item]++;
      setItemQuantities(newItemQuantities);

      const newSubtotal = subtotal + item.harga;
      setSubtotal(newSubtotal);

      const existingItem = selectedItems.find(
        (selectedItem) => selectedItem.id_item === item.id_item
      );

      if (!existingItem) {
        setSelectedItems([...selectedItems, item]);
      }
    }
  };

  const onClickHapus = (item) => {
    const newItemQuantities = { ...itemQuantities };
    if (newItemQuantities[item.id_item]) {
      newItemQuantities[item.id_item]--;
      if (newItemQuantities[item.id_item] === 0) {
        delete newItemQuantities[item.id_item];
        const newSelectedItems = selectedItems.filter(
          (selectedItem) => selectedItem.id_item !== item.id_item
        );
        setSelectedItems(newSelectedItems);
      }
    }

    setItemQuantities(newItemQuantities);

    const newSubtotal = selectedItems.reduce(
      (acc, selectedItem) =>
        acc + selectedItem.harga * newItemQuantities[selectedItem.id_item],
      0
    );
    setSubtotal(newSubtotal);
  };

  const formatRupiah = (number) => {
    if (typeof number !== "number") {
      return "Rp 0";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Menampilkan item yang telah dipilih dalam tabel "Daftar Beli"
  const daftarBeli = selectedItems.map((item, index) => (
    <tr key={item.id_item}>
      <td>{index + 1}</td>
      <td>{item.id_item}</td>
      <td>{item.nama_item}</td>
      <td>{formatRupiah(item.harga)}</td>
      <td>{itemQuantities[item.id_item]}</td>
      <td>{formatRupiah(item.harga * itemQuantities[item.id_item])}</td>
      <td>
        <button className="button is-danger" onClick={() => onClickHapus(item)}>
          Hapus
        </button>
      </td>
    </tr>
  ));

  const filteredItems = hasil.filter((item) =>
    item.nama_item.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Menampilkan item yang tersedia dalam tabel "Daftar Item"
  const daftarItem = filteredItems.map((x, index) => (
    <tr key={x.id_item}>
      <td className="is-vcentered">{index + 1}</td>
      <td className="is-vcentered">{x.id_item}</td>
      <td className="is-vcentered">{x.nama_item}</td>
      <td className="is-vcentered">{x.stok}</td>
      <td className="is-vcentered">{x.nama_satuan}</td>
      <td className="is-vcentered">{x.nama_jenis}</td>
      <td className="is-vcentered">{formatRupiah(x.harga)}</td>
      <td className="is-vcentered">{x.nama_rak}</td>
      <td className="is-vcentered">-</td>
      <td>
        <button className="button is-success" onClick={() => onClickTambah(x)}>
          +
        </button>
      </td>
    </tr>
  ));

  const calculateTotalBeforeDiscount = () => {
    const total = selectedItems.reduce(
      (acc, selectedItem) =>
        acc +
        selectedItem.harga * itemQuantities[selectedItem.id_item] +
        (customerType === "resep" ? compoundingFee : 0),
      0
    );
    return total;
  };

  const calculateTotalAfterDiscount = () => {
    const totalBeforeDiscount = calculateTotalBeforeDiscount();
    let effectiveDiscount = discountPercentage;

    if (effectiveDiscount > 100) {
      effectiveDiscount = 100;
    }

    const discountAmount = (effectiveDiscount / 100) * totalBeforeDiscount;
    const totalAfterDiscount = totalBeforeDiscount - discountAmount;
    return totalAfterDiscount;
  };

  const calculateChangeAmount = () => {
    return paymentAmount - calculateTotalAfterDiscount();
  };

  const handleCustomerTypeChange = (e) => {
    setCustomerType(e.target.value);

    if (e.target.value === "umum") {
      setCompoundingFee(0);
    }
  };

  const handleDiscountPercentageChange = (e) => {
    let newDiscountPercentage = Number(e.target.value);

    if (newDiscountPercentage > 100) {
      newDiscountPercentage = 100;
    }

    setDiscountPercentage(newDiscountPercentage);
  };

  const handlePaymentAmountChange = (e) => {
    const inputValue = e.target.value;

    const numericValue = parseFloat(
      inputValue.replace(/[^\d,]/g, "").replace(/,/g, ".")
    );

    if (!isNaN(numericValue)) {
      setPaymentAmount(numericValue);
    } else {
      setPaymentAmount(0);
    }
  };

  const handleCancelClick = () => {
    setSelectedItems([]);
    setSubtotal(0);
    setItemQuantities({});
    setCustomerType("umum");
    setDiscountPercentage(0);
    setTotalBeforeDiscount(0);
    setPaymentAmount(0);
    setChangeAmount(0);
  };

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handlePayClick = () => {
    const totalBeforeDiscount = calculateTotalBeforeDiscount();
    setTotalBeforeDiscount(totalBeforeDiscount);

    const changeAmount = calculateChangeAmount();
    setChangeAmount(changeAmount);

    openConfirmationModal();
  };

  const handleCompoundingFeeChange = (e) => {
    const inputValue = e.target.value;

    const numericValue = parseFloat(
      inputValue.replace(/[^\d,]/g, "").replace(/,/g, ".")
    );

    if (!isNaN(numericValue) && numericValue <= 10000) {
      setCompoundingFee(numericValue);
    } else if (!isNaN(numericValue) && numericValue > 10000) {
      setCompoundingFee(10000);
    } else {
      setCompoundingFee(0);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      for (const selectedItem of selectedItems) {
        await reduceItemStock(
          selectedItem.id_item,
          itemQuantities[selectedItem.id_item]
        );
      }

      closeConfirmationModal();

      // setSelectedItems([]);
      // setSubtotal(0);
      // setItemQuantities({});
      // setCustomerType("umum");
      // setDiscountPercentage(0);
      // setTotalBeforeDiscount(0);
      // setPaymentAmount(0);
      // setChangeAmount(0);
    } catch (error) {
      console.error("Gagal mengurangi stok item:", error);
    }
  };

  const reduceItemStock = async (itemId, quantity) => {
    const apiUrl = "/api/KurangStok"; // Adjust the API URL as needed
    const requestBody = { itemId, quantity };

    try {
      const res = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setModal({ pesan: res.data, isSuccess: true, isModalClosed: false });
      setTimeout(function () {
        setModal({ isModalClosed: true });
      }, 2000);
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    } catch (e) {
      setModal({
        pesan: e.response.data,
        isSuccess: false,
        isModalClosed: false,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Kasir</title>
      </Head>
      <h1 className="title">Daftar Beli</h1>
      <div className="columns">
        <div className="column is-8">
          <table className="table is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th>No</th>
                <th>Kode Item</th>
                <th>Nama Item</th>
                <th>Harga</th>
                <th>Jumlah</th>
                <th>Subtotal</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>{daftarBeli}</tbody>
          </table>
        </div>
        <div className="column is-4">
          <div className="columns">
            <div className="column is-6">
              <div className="field">
                <label className="label">Jenis Pelanggan:</label>
                <div className="control">
                  <label className="radio">
                    <input
                      type="radio"
                      value="umum"
                      checked={customerType === "umum"}
                      onChange={handleCustomerTypeChange}
                    />
                    Umum
                  </label>
                  <label className="radio">
                    <input
                      type="radio"
                      value="resep"
                      checked={customerType === "resep"}
                      onChange={handleCustomerTypeChange}
                    />
                    Resep
                  </label>
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label">Total Sebelum Potongan:</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={formatRupiah(totalBeforeDiscount)}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="columns">
            <div className="column is-6">
              <div className="field">
                <label className="label">Potongan (%):</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={discountPercentage}
                    onChange={handleDiscountPercentageChange}
                  />
                </div>
              </div>
            </div>
            {customerType === "resep" && (
              <div className="column is-6">
                <div className="field">
                  <label className="label">Biaya Racik:</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={formatRupiah(compoundingFee)}
                      onChange={handleCompoundingFeeChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="columns">
            <div className="column is-6">
              <div className="field">
                <label className="label">Total Tagihan:</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={formatRupiah(calculateTotalAfterDiscount())}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="column is-6">
              <div className="field">
                <label className="label">Bayar:</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={formatRupiah(paymentAmount)}
                    onChange={handlePaymentAmountChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Kembalian:</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={formatRupiah(changeAmount)}
                readOnly
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-danger" onClick={handleCancelClick}>
                Batal
              </button>
              <button
                className="button is-success ml-2"
                onClick={handlePayClick}
                disabled={
                  selectedItems.length === 0 || paymentAmount < subtotal
                }
              >
                Bayar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal ${isConfirmationModalOpen ? "is-active" : ""}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Konfirmasi Pembayaran</p>
            <button
              className="delete"
              aria-label="close"
              onClick={closeConfirmationModal}
            ></button>
          </header>
          <section className="modal-card-body">
            <div className="content">
              <p>Apakah Anda yakin ingin melakukan pembayaran?</p>
            </div>

            <div className="content">
              <h2>Daftar Belanjaan:</h2>
              <ul>
                {selectedItems.map((item, index) => (
                  <li key={index}>
                    {item.nama_item} - {itemQuantities[item.id_item]} pcs
                  </li>
                ))}
              </ul>
            </div>
            <div className="columns">
              <div className="column">
                <div className="content">
                  <p>Total Sebelum Potongan:</p>
                  <p className="has-text-weight-bold">
                    {formatRupiah(totalBeforeDiscount)}
                  </p>
                </div>
              </div>
              <div className="column">
                <div className="content">
                  <p>Potongan:</p>
                  <p className="has-text-weight-bold">
                    {formatRupiah(discountPercentage)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="content">
                  <p>Total Tagihan:</p>
                  <p className="has-text-weight-bold">
                    {formatRupiah(calculateTotalAfterDiscount())}
                  </p>
                </div>
              </div>
              <div className="column">
                <div className="content">
                  <p>Biaya Racik:</p>
                  <p className="has-text-weight-bold">
                    {formatRupiah(compoundingFee)}
                  </p>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="content">
                  <p>Bayar:</p>
                  <p className="has-text-weight-bold">
                    {formatRupiah(paymentAmount)}
                  </p>
                </div>
              </div>
              <div className="column">
                <div className="content">
                  <p>Kembalian:</p>
                  <p className="has-text-weight-bold">
                    {formatRupiah(changeAmount)}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-danger" onClick={handleConfirmPayment}>
              Ya
            </button>
            <button className="button is-info" onClick={closeConfirmationModal}>
              Tidak
            </button>
          </footer>
        </div>
      </div>
      <div className="columns">
        <div className="column is-10">
          <h1 className="title">Daftar Item</h1>
        </div>
        <div className="column is-2">
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Cari</label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control has-addons-centered">
                  <input
                    type="text"
                    className="input"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <table className="table has-text-centered is-fullwidth">
        <thead>
          <tr>
            <th className="has-text-centered is-vcentered">No</th>
            <th className="has-text-centered is-vcentered">Kode Item</th>
            <th className="has-text-centered is-vcentered">Nama Item</th>
            <th className="has-text-centered is-vcentered">Stok</th>
            <th className="has-text-centered is-vcentered">Satuan</th>
            <th className="has-text-centered is-vcentered">Jenis</th>
            <th className="has-text-centered is-vcentered">Harga</th>
            <th className="has-text-centered is-vcentered">Rak</th>
            <th className="has-text-centered is-vcentered">Keterangan</th>
            <th className="has-text-centered is-vcentered">Tambah</th>
          </tr>
        </thead>
        <tbody>{daftarItem}</tbody>
      </table>
      <Modal show={modal.isModalClosed === false && "is-active"}>
        {modal.isSuccess === true ? (
          <IsiModalSuccess pesan={modal.pesan}></IsiModalSuccess>
        ) : (
          <IsiModalFailed pesan={modal.pesan}>
            <button
              className="button is-danger"
              onClick={() => {
                setModal({ ...modal, isModalClosed: true });
              }}
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
  let query = `
    SELECT DISTINCT item.id_item, item.nama as nama_item, stok, satuan.nama as nama_satuan, jenis.nama as nama_jenis, history_harga_jual.harga, rak.nama_rak
    FROM item
    INNER JOIN satuan ON item.id_satuan = satuan.id_satuan
    INNER JOIN jenis ON item.id_jenis_item = jenis.id_jenis
    INNER JOIN rak ON item.id_rak = rak.id_rak
    INNER JOIN history_harga_jual ON item.id_item = history_harga_jual.id_item
    GROUP BY item.id_item, item.nama;
  `;

  try {
    const getData = await handlerQuery({ query });
    const hasil = JSON.parse(JSON.stringify(getData));

    // Mengambil stok dari hasil query dan menyimpannya ke dalam props stokInfo
    const stokInfo = {};
    hasil.forEach((item) => {
      stokInfo[item.id_item] = item.stok;
    });

    return {
      props: {
        hasil,
        stokInfo, // Menyertakan stokInfo sebagai props
      },
    };
  } catch (e) {
    return {
      props: {
        hasil: e.message,
        stokInfo: {}, // Inisialisasi stokInfo jika terjadi kesalahan
      },
    };
  }
}

Kasir.getLayout = function getLayout(page) {
  return <Layout clicked="Kasir">{page}</Layout>;
};
