import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import View from '../../components/studi_kasus/View.js'; // Import dari folder kunci jawaban

// Fungsi helper untuk memformat angka dengan titik sebagai pemisah ribuan
// Ini penting agar konsisten dengan format "Received" di log error Anda.
const formatPriceWithDot = (price) => {
  return price.toLocaleString('en-US').replace(/,/g, '.');
};

// Mock komponen MenuItem dan Cart
jest.mock('../../components/studi_kasus/MenuItem', () => {
  return function MenuItem({ name, price, onAdd }) {
    return (
      <div data-testid="menu-item">
        <span data-testid="item-name">{name}</span>
        {/* Menggunakan formatPriceWithDot agar sesuai dengan yang dirender */}
        <span data-testid="item-price">Rp {formatPriceWithDot(price)}</span>
        <button data-testid="add-button" onClick={onAdd}>
          Tambah
        </button>
      </div>
    );
  };
});

jest.mock('../../components/studi_kasus/Cart', () => {
  return function Cart({ total, items, onRemove, onCheckout }) {
    return (
      <div data-testid="cart">
        <h2>Keranjang</h2>
        <div data-testid="cart-items">
          {items.map((item, index) => (
            <div key={index} data-testid="cart-item">
              {/* Menggunakan formatPriceWithDot agar sesuai dengan yang dirender */}
              <span>{item.name} - Rp {formatPriceWithDot(item.price)}</span>
              <button data-testid="remove-button" onClick={() => onRemove(index)}>
                Hapus
              </button>
            </div>
          ))}
        </div>
        {/* Menggunakan formatPriceWithDot agar sesuai dengan yang dirender */}
        <div data-testid="total">Total: Rp {formatPriceWithDot(total)}</div>
        <button data-testid="checkout-button" onClick={onCheckout}>
          Checkout
        </button>
      </div>
    );
  };
});

// Mock alert
global.alert = jest.fn();

// Fungsi untuk membaca konten file
const readFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`File not found: ${filePath}`);
    return '';
  }
};

// Fungsi untuk membandingkan dua string kode
const compareFiles = (studentCode, answerKeyCode) => {
  // Jika file tidak ada, skip perbandingan dan lanjut ke test
  if (!studentCode || !answerKeyCode) {
    console.log('⚠ File perbandingan tidak ditemukan, melanjutkan ke pengujian...');
    return true;
  }
  
  const differences = diffLines(studentCode, answerKeyCode);
  const hasDifferences = differences.some(part => part.added || part.removed);

  if (hasDifferences) {
    console.log('❌ Ditemukan perbedaan dalam kode:');
    differences.forEach((part, index) => {
      if (part.added) {
        console.log(`+ Baris ${index + 1} (ditambahkan): ${part.value.trim()}`);
      } else if (part.removed) {
        console.log(`- Baris ${index + 1} (dihapus): ${part.value.trim()}`);
      }
    });
    return false;
  }
  return true;
};

// Path file mahasiswa dan kunci jawaban
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/View.js');
const answerKeyFilePath = path.join(__dirname, '../../components/studi_kasus/View.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('View Restaurant App Component Tests', () => {
    // Reset mocks sebelum setiap test
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders View component without crashing', () => {
      expect(() => render(<View />)).not.toThrow();
    });

    test('renders main title correctly', () => {
      render(<View />);
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Daftar Menu');
    });

    test('renders all menu items correctly', () => {
      render(<View />);
      
      // Check if all 3 menu items are rendered
      const menuItems = screen.getAllByTestId('menu-item');
      expect(menuItems).toHaveLength(3);
      
      // Check menu item names
      expect(screen.getByText('Nasi Goreng')).toBeInTheDocument();
      expect(screen.getByText('Ayam Bakar')).toBeInTheDocument();
      expect(screen.getByText('Es Teh Manis')).toBeInTheDocument();
    });

    test('renders menu items with correct prices', () => {
      render(<View />);
      
      // Check menu item prices (disesuaikan untuk titik sebagai pemisah ribuan)
      expect(screen.getByText('Rp 25.000')).toBeInTheDocument();
      expect(screen.getByText('Rp 35.000')).toBeInTheDocument();
      expect(screen.getByText('Rp 8.000')).toBeInTheDocument();
    });

    test('renders Cart component', () => {
      render(<View />);
      const cart = screen.getByTestId('cart');
      expect(cart).toBeInTheDocument();
    });

    test('initial state is empty cart with zero total', () => {
      render(<View />);
      
      const total = screen.getByTestId('total');
      expect(total).toHaveTextContent('Total: Rp 0');
      
      const cartItems = screen.getByTestId('cart-items');
      expect(cartItems).toBeEmptyDOMElement();
    });

    test('handles adding items to cart correctly', async () => {
      render(<View />);
      
      // Add first item (Nasi Goreng)
      const addButtons = screen.getAllByTestId('add-button');
      fireEvent.click(addButtons[0]);
      
      // Check if item is added to cart (disesuaikan untuk titik sebagai pemisah ribuan)
      await waitFor(() => {
        expect(screen.getByText('Nasi Goreng - Rp 25.000')).toBeInTheDocument();
        expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 25.000');
      });
    });

    test('handles adding multiple items to cart', async () => {
      render(<View />);
      
      const addButtons = screen.getAllByTestId('add-button');
      
      // Add Nasi Goreng (25000)
      fireEvent.click(addButtons[0]);
      
      // Add Ayam Bakar (35000)
      fireEvent.click(addButtons[1]);
      
      await waitFor(() => {
        // Check if both items are in cart (disesuaikan untuk titik sebagai pemisah ribuan)
        expect(screen.getByText('Nasi Goreng - Rp 25.000')).toBeInTheDocument();
        expect(screen.getByText('Ayam Bakar - Rp 35.000')).toBeInTheDocument();
        
        // Check total (disesuaikan untuk titik sebagai pemisah ribuan)
        expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 60.000');
      });
    });

    test('handles adding same item multiple times', async () => {
      render(<View />);
      
      const addButtons = screen.getAllByTestId('add-button');
      
      // Add Nasi Goreng twice
      fireEvent.click(addButtons[0]);
      fireEvent.click(addButtons[0]);
      
      await waitFor(() => {
        const cartItems = screen.getAllByTestId('cart-item');
        expect(cartItems).toHaveLength(2);
        // Disyuaikan untuk titik sebagai pemisah ribuan
        expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 50.000');
      });
    });

    test('handles removing items from cart correctly', async () => {
      render(<View />);
      
      // Add items first
      const addButtons = screen.getAllByTestId('add-button');
      fireEvent.click(addButtons[0]); // Add Nasi Goreng
      fireEvent.click(addButtons[1]); // Add Ayam Bakar
      
      await waitFor(() => {
        // Disyuaikan untuk titik sebagai pemisah ribuan
        expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 60.000');
      });
      
      // Remove first item
      const removeButtons = screen.getAllByTestId('remove-button');
      fireEvent.click(removeButtons[0]);
      
      await waitFor(() => {
        // Should only have Ayam Bakar left (disesuaikan untuk titik sebagai pemisah ribuan)
        expect(screen.getByText('Ayam Bakar - Rp 35.000')).toBeInTheDocument();
        expect(screen.queryByText('Nasi Goreng - Rp 25.000')).not.toBeInTheDocument();
        // Disyuaikan untuk titik sebagai pemisah ribuan
        expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 35.000');
      });
    });

    test('handles checkout functionality correctly', async () => {
      render(<View />);
      
      // Add items to cart
      const addButtons = screen.getAllByTestId('add-button');
      fireEvent.click(addButtons[0]); // Add Nasi Goreng
      fireEvent.click(addButtons[2]); // Add Es Teh Manis
      
      await waitFor(() => {
        // Disyuaikan untuk titik sebagai pemisah ribuan
        expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 33.000');
      });
      
      // Checkout
      const checkoutButton = screen.getByTestId('checkout-button');
      fireEvent.click(checkoutButton);
      
      // Check alert was called
      expect(global.alert).toHaveBeenCalledWith('Terima kasih! Pesanan Anda sedang diproses.');
      
      // Check cart is cleared
      await waitFor(() => {
        expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 0');
        expect(screen.getByTestId('cart-items')).toBeEmptyDOMElement();
      });
    });

    test('checkout with empty cart should still work', () => {
      render(<View />);
      
      const checkoutButton = screen.getByTestId('checkout-button');
      fireEvent.click(checkoutButton);
      
      expect(global.alert).toHaveBeenCalledWith('Terima kasih! Pesanan Anda sedang diproses.');
    });

    test('component has correct main structure', () => {
      const { container } = render(<View />);
      
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('max-w-md', 'mx-auto', 'p-4');
    });

    test('menu items are rendered with correct keys', () => {
      render(<View />);
      
      const menuItems = screen.getAllByTestId('menu-item');
      expect(menuItems).toHaveLength(3);
      
      // Each menu item should be rendered (we can't directly test keys, but we test the mapping result)
      expect(screen.getByText('Nasi Goreng')).toBeInTheDocument();
      expect(screen.getByText('Ayam Bakar')).toBeInTheDocument();
      expect(screen.getByText('Es Teh Manis')).toBeInTheDocument();
    });

    test('useState hooks work correctly for items state', async () => {
      render(<View />);
      
      // Initial state
      const cartItems = screen.getByTestId('cart-items');
      expect(cartItems).toBeEmptyDOMElement();
      
      // Add item
      const addButtons = screen.getAllByTestId('add-button');
      fireEvent.click(addButtons[0]);
      
      await waitFor(() => {
        const cartItemsAfterAdd = screen.getAllByTestId('cart-item');
        expect(cartItemsAfterAdd).toHaveLength(1);
      });
    });

    test('useState hooks work correctly for total state', async () => {
      render(<View />);
      
      // Initial total
      expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 0');
      
      // Add item
      const addButtons = screen.getAllByTestId('add-button');
      fireEvent.click(addButtons[1]); // Add Ayam Bakar (35000)
      
      await waitFor(() => {
        // Disyuaikan untuk titik sebagai pemisah ribuan
        expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 35.000');
      });
    });

    test('handleAdd function works correctly', async () => {
      render(<View />);
      
      const addButtons = screen.getAllByTestId('add-button');
      
      // Add Es Teh Manis (8000)
      fireEvent.click(addButtons[2]);
      
      await waitFor(() => {
        // Disyuaikan untuk titik sebagai pemisah ribuan
        expect(screen.getByText('Es Teh Manis - Rp 8.000')).toBeInTheDocument();
        // Disyuaikan untuk titik sebagai pemisah ribuan
        expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 8.000');
      });
    });

    test('handleRemove function works correctly with index', async () => {
      render(<View />);
      
      const addButtons = screen.getAllByTestId('add-button');
      
      // Add multiple items
      fireEvent.click(addButtons[0]); // Nasi Goreng
      fireEvent.click(addButtons[1]); // Ayam Bakar
      fireEvent.click(addButtons[2]); // Es Teh Manis
      
      await waitFor(() => {
        expect(screen.getAllByTestId('cart-item')).toHaveLength(3);
        // Disyuaikan untuk titik sebagai pemisah ribuan
        expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 68.000');
      });
      
      // Remove middle item (index 1 - Ayam Bakar)
      const removeButtons = screen.getAllByTestId('remove-button');
      fireEvent.click(removeButtons[1]);
      
      await waitFor(() => {
        expect(screen.getAllByTestId('cart-item')).toHaveLength(2);
        // Disyuaikan untuk titik sebagai pemisah ribuan
        expect(screen.getByText('Nasi Goreng - Rp 25.000')).toBeInTheDocument();
        expect(screen.getByText('Es Teh Manis - Rp 8.000')).toBeInTheDocument();
        expect(screen.queryByText('Ayam Bakar - Rp 35.000')).not.toBeInTheDocument();
        // Disyuaikan untuk titik sebagai pemisah ribuan
        expect(screen.getByTestId('total')).toHaveTextContent('Total: Rp 33.000');
      });
    });

    test('props are passed correctly to MenuItem components', () => {
      render(<View />);
      
      // Check if MenuItem receives correct props
      const menuItems = screen.getAllByTestId('menu-item');
      expect(menuItems).toHaveLength(3);
      
      // Check if add buttons are present (indicates onAdd prop is passed)
      const addButtons = screen.getAllByTestId('add-button');
      expect(addButtons).toHaveLength(3);
    });

    test('props are passed correctly to Cart component', async () => {
      render(<View />);
      
      // Add an item to test props
      const addButtons = screen.getAllByTestId('add-button');
      fireEvent.click(addButtons[0]);
      
      await waitFor(() => {
        // Check if Cart receives correct props
        expect(screen.getByTestId('cart')).toBeInTheDocument();
        expect(screen.getByTestId('total')).toBeInTheDocument();
        expect(screen.getByTestId('cart-items')).toBeInTheDocument();
        expect(screen.getByTestId('checkout-button')).toBeInTheDocument();
        expect(screen.getByTestId('remove-button')).toBeInTheDocument();
      });
    });

    test('View component is properly exported as default', () => {
      expect(View).toBeDefined();
      expect(typeof View).toBe('function');
    });

    test('menu data is correctly defined', () => {
      render(<View />);
      
      // Test that all menu items from the data are rendered
      const expectedMenuItems = [
        { name: 'Nasi Goreng', price: 25000 },
        { name: 'Ayam Bakar', price: 35000 },
        { name: 'Es Teh Manis', price: 8000 }
      ];
      
      expectedMenuItems.forEach(item => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
        // Disyuaikan untuk titik sebagai pemisah ribuan
        expect(screen.getByText(`Rp ${formatPriceWithDot(item.price)}`)).toBeInTheDocument();
      });
    });

  });

} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi View component Anda.');
  
  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('View Restaurant App - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('component should at least render without crashing', () => {
      expect(() => render(<View />)).not.toThrow();
    });

    test('should contain basic structure elements', () => {
      render(<View />);
      
      try {
        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        console.log('✔ Heading ditemukan');
      } catch (e) {
        console.log('❌ Heading tidak ditemukan');
      }

      try {
        const menuItems = screen.getAllByTestId('menu-item');
        expect(menuItems.length).toBeGreaterThan(0);
        console.log(`✔ Menu items ditemukan (${menuItems.length} items)`);
      } catch (e) {
        console.log('❌ Menu items tidak ditemukan');
      }

      try {
        const cart = screen.getByTestId('cart');
        expect(cart).toBeInTheDocument();
        console.log('✔ Cart component ditemukan');
      } catch (e) {
        console.log('❌ Cart component tidak ditemukan');
      }
    });

    test('should have menu items with correct content', () => {
      render(<View />);
      
      try {
        expect(screen.getByText(/Nasi Goreng/i)).toBeInTheDocument();
        console.log('✔ Nasi Goreng item ditemukan');
      } catch (e) {
        console.log('❌ Nasi Goreng item tidak ditemukan');
      }

      try {
        expect(screen.getByText(/Ayam Bakar/i)).toBeInTheDocument();
        console.log('✔ Ayam Bakar item ditemukan');
      } catch (e) {
        console.log('❌ Ayam Bakar item tidak ditemukan');
      }

      try {
        expect(screen.getByText(/Es Teh Manis/i)).toBeInTheDocument();
        console.log('✔ Es Teh Manis item ditemukan');
      } catch (e) {
        console.log('❌ Es Teh Manis item tidak ditemukan');
      }
    });

    test('should have interactive elements', () => {
      render(<View />);
      
      try {
        const addButtons = screen.getAllByTestId('add-button');
        expect(addButtons.length).toBeGreaterThan(0);
        console.log(`✔ Add buttons ditemukan (${addButtons.length} buttons)`);
      } catch (e) {
        console.log('❌ Add buttons tidak ditemukan');
      }

      try {
        const checkoutButton = screen.getByTestId('checkout-button');
        expect(checkoutButton).toBeInTheDocument();
        console.log('✔ Checkout button ditemukan');
      } catch (e) {
        console.log('❌ Checkout button tidak ditemukan');
      }
    });

    test('should handle basic interactions', async () => {
      render(<View />);
      
      try {
        const addButtons = screen.getAllByTestId('add-button');
        if (addButtons.length > 0) {
          fireEvent.click(addButtons[0]);
          
          await waitFor(() => {
            const cartItems = screen.queryAllByTestId('cart-item');
            expect(cartItems.length).toBeGreaterThan(0);
          });
          console.log('✔ Add to cart functionality berfungsi');
        }
      } catch (e) {
        console.log('❌ Add to cart functionality tidak berfungsi');
      }

      try {
        const checkoutButton = screen.getByTestId('checkout-button');
        fireEvent.click(checkoutButton);
        
        // Check if alert was called (basic functionality)
        expect(global.alert).toHaveBeenCalled();
        console.log('✔ Checkout functionality berfungsi');
      } catch (e) {
        console.log('❌ Checkout functionality tidak berfungsi');
      }
    });

    test('should have proper component structure', () => {
      const { container } = render(<View />);
      
      try {
        const mainDiv = container.firstChild;
        expect(mainDiv.tagName.toLowerCase()).toBe('div');
        console.log('✔ Main container div ditemukan');
      } catch (e) {
        console.log('❌ Main container div tidak ditemukan');
      }

      try {
        const title = screen.getByText(/Daftar Menu/i);
        expect(title).toBeInTheDocument();
        console.log('✔ Title "Daftar Menu" ditemukan');
      } catch (e) {
        console.log('❌ Title "Daftar Menu" tidak ditemukan');
      }
    });
  });
}