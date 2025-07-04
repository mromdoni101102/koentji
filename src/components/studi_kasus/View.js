'use client';
import { useState } from 'react';
import MenuItem from '../../components/studi_kasus/MenuItem';
import Cart from '../../components/studi_kasus/Cart';

export default function View() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const menu = [
    { id: 1, name: 'Nasi Goreng', price: 25000 },
    { id: 2, name: 'Ayam Bakar', price: 35000 },
    { id: 3, name: 'Es Teh Manis', price: 8000 },
  ];

  const handleAdd = (item) => {
    setItems([...items, item]);
    setTotal(total + item.price);
  };

  const handleRemove = (index) => {
    const removedItem = items[index];
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    setTotal(total - removedItem.price);
  };

  const handleCheckout = () => {
    alert('Terima kasih! Pesanan Anda sedang diproses.');
    setItems([]);
    setTotal(0);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Menu</h1>
      <div className="space-y-4">
        {menu.map((item) => (
          <MenuItem
            key={item.id}
            name={item.name}
            price={item.price}
            onAdd={() => handleAdd(item)}
          />
        ))}
      </div>

      <Cart total={total} items={items} onRemove={handleRemove} onCheckout={handleCheckout} />
    </div>
  );
}