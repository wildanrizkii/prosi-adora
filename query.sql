SELECT DISTINCT item.id_item, item.nama as nama_item, stok, satuan.nama as nama_satuan, jenis.nama as nama_jenis, history_harga_jual.harga, rak.nama_rak
FROM item
INNER JOIN satuan ON item.id_satuan = satuan.id_satuan
INNER JOIN jenis ON item.id_jenis_item = jenis.id_jenis
INNER JOIN rak ON item.id_rak = rak.id_rak
INNER JOIN history_harga_jual ON item.id_item = history_harga_jual.id_item
GROUP BY item.id_item, item.nama;