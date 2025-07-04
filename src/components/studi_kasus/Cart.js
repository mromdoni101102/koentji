export default function Cart({ total, items, onRemove, onCheckout }) {
  return (
    <div className="mt-6 p-4 border rounded">
      <h3 className="font-semibold mb-2">Keranjang:</h3>
      {items.length === 0 ? (
        <p className="text-gray-500">Belum ada pesanan.</p>
      ) : (
        <ul className="mb-4">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b py-1"
            >
              <span>
                {item.name} - Rp {item.price.toLocaleString()}
              </span>
              <button
                onClick={() => {
                  if (confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) {
                    onRemove(index);
                  }
                }}
                className="text-red-500 hover:underline text-sm"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
      <h3 className="font-semibold">
        Total Belanja: Rp {total.toLocaleString()}
      </h3>
      {total > 100000 ? (
        <p className="text-green-600 font-bold">Gratis ongkir!</p>
      ) : (
        <p className="text-red-600 font-bold">Tidak Dapat Gratis Ongkir</p>
      )}
      {items.length > 0 && (
        <button
          onClick={onCheckout}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Checkout
        </button>
      )}
    </div>
  );
}