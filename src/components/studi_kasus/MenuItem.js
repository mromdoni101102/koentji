export default function MenuItem({ name, price, onAdd }) {
return (
    <div className="border p-4 flex justify-between items-center">
      <div>
        <h2 className="font-bold">{name}</h2>
        <p>Rp {price.toLocaleString()}</p>
      </div>
      <button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
        Tambah
      </button>
    </div>
  );
}