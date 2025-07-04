import { useState } from 'react';
import { sculptureList } from "@/data/article";

export default function Galeri() {
  const [index, setIndex] = useState(0);

  function handleNextClick() {
    // Cek apakah index belum mencapai batas akhir
    if (index < sculptureList.length - 1) {
      setIndex(index + 1);
    }
  }

  function handlePrevClick() {
    // Cek apakah index lebih dari 0
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  const sculpture = sculptureList[index];

  return (
    <>
      <div className="space-x-2 mb-4">
        <button
          onClick={handlePrevClick}
          className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded"
          disabled={index === 0}
        >
          Artikel Sebelumnya
        </button>
        <button
          onClick={handleNextClick}
          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
          disabled={index === sculptureList.length - 1}
        >
          Artikel Selanjutnya
        </button>
      </div>

      <h2>{sculpture.name} <i /> oleh {sculpture.artist}</h2>
      <h3>({index + 1} dari {sculptureList.length})</h3>
      <img src={sculpture.url} alt={sculpture.alt} />
      <p>{sculpture.description}</p>
    </>
  );
}
