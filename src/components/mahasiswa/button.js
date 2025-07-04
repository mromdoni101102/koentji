export function Tombol_2({isipesan, namaTombol}) {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
    onClick={() => {alert(isipesan)}}>
      {namaTombol}
    </button>
  );
}

export function Tombol_3({isipesan, namaTombol}) {
  return (
    <button 
    className="bg-green-400 hover:bg-green-700 text-white p-2 rounded m-2"
    onClick={(e) => {
        e.stopPropagation();
        alert(isipesan);
      }
    }>
      {namaTombol}
    </button>
  );
}

export default function Tombol_1() {
  // Menambahkan fungsi untuk menangani klik tombol
  function handleClick() {
    alert("Tombol telah ditekan!!!");
  }
  function handleMouseOver() {
    alert("Eits, mau pencet tombol ini ya??");
  }
  return (
    <button 
    className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
    onClick={handleClick}
    // onMouseOver={handleMouseOver}
    onMouseLeave={()=> {
      alert("Loh, kok sudah pergi?")
    }
    }
    > 
    ini tombol
    </button>
  );
}