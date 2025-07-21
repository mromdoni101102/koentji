'use client';
import React, { useState } from 'react';

const Project = () => {
  const [cart, setCart] = useState([]);

  const menuItems = [
    { id: 1, name: 'Bakso', price: 100000 },
    { id: 2, name: 'Ayam Bakar', price: 35000 },
    { id: 3, name: 'Es Teh Manis', price: 8000 }
  ];

  const cartItem = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    const total = calculateTotal();
    alert(`Terima kasih! Total pesanan Anda: Rp ${total.toLocaleString('id-ID')}`);
    setCart([]);
  };

  const total = calculateTotal();
  const isCartEmpty = cart.length === 0;

  return (
    <div data-testid="projectnya" className="container mx-auto p-6 max-w-4xl">
      <h1 data-testid="menu-heading" className="text-3xl font-bold text-center mb-8 text-gray-800">
        Daftar Menu Restoran
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6" data-testid="menu-section">
          {menuItems.map((item) => (
            <div key={item.id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                  <p className="text-green-600 font-semibold">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <button
                  data-testid={`add-button-${item.id}`}
                  onClick={() => cartItem(item)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Tambah
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6" data-testid="cart-section">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Keranjang:</h2>

          {isCartEmpty ? (
            <p data-testid="cart-empty" className="text-gray-500 italic mb-6">Belum ada pesanan.</p>
          ) : (
            <div data-testid="cart-items" className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    data-testid={`remove-button-${item.id}`}
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <span data-testid="total-amount" className="text-xl font-semibold text-gray-800">
              Total Belanja: Rp {total.toLocaleString('id-ID')}
            </span>

            <button
              data-testid="checkout-button"
              onClick={handleCheckout}
              disabled={isCartEmpty}
              className={`w-full py-3 rounded-lg font-semibold mt-4 transition-colors duration-200 ${
                isCartEmpty
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isCartEmpty ? 'Keranjang Kosong' : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;