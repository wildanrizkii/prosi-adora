import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import Head from "next/head";
import handlerQuery from "../../../lib/db";
import { useState } from "react";
import axios from "axios";
import {
  Modal,
  IsiModalSuccess,
  IsiModalFailed,
  Pagination,
} from "../../../components/AllComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareMinus,
  faSquarePlus,
} from "@fortawesome/free-regular-svg-icons";

export default function Kasir({ hasil, stokInfo, jumlah }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [itemQuantities, setItemQuantities] = useState({});
  const [customerType, setCustomerType] = useState(""); // Pelanggan: umum atau resep
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [filteredItems, setFilteredItems] = useState(hasil);

  const router = useRouter();

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
      <td className="is-flex">
        <span className="icon is-left">
          <FontAwesomeIcon
            icon={faSquareMinus}
            onClick={() => onClickHapus(item)}
            className="is-clickable"
          />
        </span>
        <input
          type="text"
          value={itemQuantities[item.id_item]}
          onChange={(e) => handleQuantityChange(item, e.target.value)}
          className="has-text-centered"
          style={{
            width: "50px",
            WebkitAppearance: "none",
            MozAppearance: "textfield",
          }}
        />
        <span className="icon is-left">
          <FontAwesomeIcon
            icon={faSquarePlus}
            onClick={() => onClickTambah(item)}
            className="is-clickable"
          />
        </span>
      </td>
      <td>{formatRupiah(item.harga * itemQuantities[item.id_item])}</td>
      <td>
        <button className="button is-danger" onClick={() => onClickHapus(item)}>
          Hapus
        </button>
      </td>
    </tr>
  ));

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
    setSelectedItems([]);
    setCustomerType(e.target.value);
    setPaymentAmount(0);
    setItemQuantities({});

    if (e.target.value === "umum") {
      setCompoundingFee(0);
    }

    const filteredItemsByCustomerType = hasil.filter((item) => {
      if (e.target.value === "umum") {
        return item.nama_jenis === "UMUM";
      } else if (e.target.value === "resep") {
        return item.nama_jenis === "KERAS";
      } else {
        return true;
      }
    });

    const filteredItems = filteredItemsByCustomerType.filter((item) =>
      item.nama_item.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    setFilteredItems(filteredItems);
  };

  const handleSearchKeywordChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    const filteredItems = hasil.filter((item) =>
      item.nama_item.toLowerCase().includes(keyword.toLowerCase())
    );

    setFilteredItems(filteredItems);
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
    setCustomerType("");
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
    if (selectedPaymentMethod === "qris" || selectedPaymentMethod === "debit") {
      const totalBeforeDiscount = calculateTotalBeforeDiscount();
      setPaymentAmount(calculateTotalAfterDiscount());
      setTotalBeforeDiscount(totalBeforeDiscount);

      setChangeAmount(0);

      openConfirmationModal();
    } else {
      const totalBeforeDiscount = calculateTotalBeforeDiscount();
      setTotalBeforeDiscount(totalBeforeDiscount);

      const changeAmount = calculateChangeAmount();
      setChangeAmount(changeAmount);

      openConfirmationModal();
    }
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
        // Reduce item stock
        const stockReductionResponse = await axios.post("/api/KurangStok", {
          itemId: selectedItem.id_item,
          quantity: itemQuantities[selectedItem.id_item],
        });

        if (stockReductionResponse.status === 200) {
          // Stock reduction was successful
          setModal({
            pesan: "Pembayaran Berhasil",
            isSuccess: true,
            isModalClosed: false,
          });

          setTimeout(function () {
            setModal({ isModalClosed: true });
          }, 2000);

          setTimeout(function () {
            window.location.reload();
          }, 2000);
        } else {
          // Handle errors in stock reduction
          setModal({
            pesan: "Pembayaran Gagal",
            isSuccess: false,
            isModalClosed: false,
          });
        }
      }

      // Generate the transaction number
      const transactionNumberResponse = await axios.get(
        "/api/GenerateNextTransactionNumber"
      );

      if (transactionNumberResponse.status !== 200) {
        throw new Error("Gagal mendapatkan nomor transaksi");
      }

      const transactionNumber = transactionNumberResponse.data;

      // Data transaksi
      const transactionData = {
        transactionNumber,
        timestamp: new Date(),
        totalBeforeDiscount: calculateTotalBeforeDiscount(),
        compoundingFee,
        discount: (discountPercentage / 100) * totalBeforeDiscount,
        idUser: 1,
      };

      // Perform the sales transaction
      const transaksiPenjualanUrl = "/api/TransaksiPenjualan";
      const transaksiResponse = await axios.post(
        transaksiPenjualanUrl,
        transactionData
      );

      if (transaksiResponse.status !== 200) {
        throw new Error("Gagal melakukan transaksi");
      }

      // Generate the detail transaction number
      const detailTransactionNumberResponse = await axios.get(
        "/api/GenerateNextDetailTransactionNumber"
      );

      if (detailTransactionNumberResponse.status !== 200) {
        throw new Error("Gagal mendapatkan nomor detail transaksi");
      }

      const nextDetailTransactionNumber = detailTransactionNumberResponse.data;

      // Data detail transaksi
      const detailTransactionData = selectedItems.map((selectedItem) => ({
        transactionNumber,
        IdItem: selectedItem.id_item,
        quantity_detail: itemQuantities[selectedItem.id_item],
        customer_type: customerType,
        subtotal: selectedItem.harga * itemQuantities[selectedItem.id_item],
        unit_price: selectedItem.harga,
        detailTransactionNumber: nextDetailTransactionNumber,
      }));

      // Perform the detail sales transaction
      const detailTransaksiPenjualanUrl = "/api/DetailTransaksiPenjualan";
      const DetailTransaksiResponse = await axios.post(
        detailTransaksiPenjualanUrl,{detailTransactionData,transactionNumber}
      );

      if (DetailTransaksiResponse.status === 200) {
        closeConfirmationModal();
        setSelectedItems([]);
        setSubtotal(0);
        setItemQuantities({});
        setCustomerType("umum");
        setDiscountPercentage(0);
        setTotalBeforeDiscount(0);
        setPaymentAmount(0);
        setChangeAmount(0);

        console.log("Transaksi berhasil, nomor transaksi:", transactionNumber);
      } else {
        throw new Error("Transaksi detail gagal");
      }
    } catch (error) {
      console.error("Gagal melakukan transaksi:", error);
      setModal({
        pesan: "Transaksi gagal: " + error.message,
        isSuccess: false,
        isModalClosed: false,
      });
    }
  };

  const recalculateSubtotal = () => {
    let newSubtotal = 0;
    for (const selectedItem of selectedItems) {
      const quantity = itemQuantities[selectedItem.id_item] || 0;
      newSubtotal += selectedItem.harga * quantity;
    }
    setSubtotal(newSubtotal);
  };

  const handleQuantityChange = (item, newQuantity) => {
    const newItemQuantities = { ...itemQuantities };
    const parsedQuantity = parseInt(newQuantity);

    if (!isNaN(parsedQuantity)) {
      if (parsedQuantity <= stokInfo[item.id_item]) {
        newItemQuantities[item.id_item] = parsedQuantity;
      } else {
        newItemQuantities[item.id_item] = stokInfo[item.id_item];
      }
    } else {
      newItemQuantities[item.id_item] = 0;
    }

    setItemQuantities(newItemQuantities);
    recalculateSubtotal();
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
              <div className="field is-hidden">
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
              <div className="field">
                <label className="label">Tipe Pembayaran::</label>
                <div className="control">
                  <label className="radio">
                    <input
                      type="radio"
                      value="cash"
                      checked={selectedPaymentMethod === "cash"}
                      onChange={() => setSelectedPaymentMethod("cash")}
                    />
                    Cash
                  </label>
                  <label className="radio">
                    <input
                      type="radio"
                      value="qris"
                      checked={selectedPaymentMethod === "qris"}
                      onChange={() => setSelectedPaymentMethod("qris")}
                    />
                    Qris
                  </label>
                  <label className="radio">
                    <input
                      type="radio"
                      value="debit"
                      checked={selectedPaymentMethod === "debit"}
                      onChange={() => setSelectedPaymentMethod("debit")}
                    />
                    Debit
                  </label>
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
                    readOnly={
                      selectedPaymentMethod === "qris" ||
                      selectedPaymentMethod === "debit"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <div className="field">
            <label className="label ">Kembalian:</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={formatRupiah(changeAmount)}
                readOnly
              />
            </div>
          </div> */}
          <div className="field">
            <div className="control">
              <button className="button is-danger" onClick={handleCancelClick}>
                Batal
              </button>
              <button
                className="button is-success ml-2"
                onClick={handlePayClick}
                disabled={
                  selectedItems.length === 0 ||
                  (selectedPaymentMethod !== "qris" &&
                    selectedPaymentMethod !== "debit" &&
                    paymentAmount < calculateTotalAfterDiscount()) ||
                  customerType === "" ||
                  selectedPaymentMethod === ""
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
              <h2>Daftar Belanjaan</h2>
              {selectedItems.map((item, index) => (
                <div
                  key={index}
                  className="is-flex is-justify-content-space-between mb-5"
                >
                  <div className="is-flex is-flex-direction-column">
                    <p className="p-0">{item.nama_item}</p>
                    <p>
                      {itemQuantities[item.id_item]} pcs x{" "}
                      {formatRupiah(item.harga)}
                    </p>
                  </div>
                  <p className="is-align-self-flex-end">
                    {formatRupiah(itemQuantities[item.id_item] * item.harga)}
                  </p>
                </div>
              ))}
            </div>
            <hr />
            <div className="is-flex is-justify-content-space-between">
              <p>Total Sebelum Potongan</p>
              <p>{formatRupiah(totalBeforeDiscount)}</p>
            </div>
            <div className="is-flex is-justify-content-space-between">
              <p>Potongan ({discountPercentage}%)</p>
              <p>
                {formatRupiah((discountPercentage / 100) * totalBeforeDiscount)}
              </p>
            </div>
            <div className="is-flex is-justify-content-space-between mb-5">
              <p>Biaya Racik</p>
              <p>{formatRupiah(compoundingFee)}</p>
            </div>
            <div className="is-flex is-justify-content-space-between">
              <p>Total Tagihan</p>
              <p>{formatRupiah(calculateTotalAfterDiscount())}</p>
            </div>
            <div className="is-flex is-justify-content-space-between mb-5">
              <p>Bayar</p>
              <p>
                {formatRupiah(paymentAmount)}
                <span> ({selectedPaymentMethod})</span>
              </p>
            </div>
            <div className="content is-flex is-justify-content-space-between">
              <p className="is-size-6">Kembalian</p>
              <p className="has-text-weight-bold is-size-5  has-text-success">
                {formatRupiah(changeAmount)}
              </p>
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
                    onChange={handleSearchKeywordChange}
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
      {/* <Pagination
          href={router.asPath}
          currentPage={router.query.p}
          jumlah={jumlah[0].jumlah}
        /> */}
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
