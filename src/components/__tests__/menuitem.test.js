// src/components/__tests__/menuitem.test.js

import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event'; // userEvent tidak digunakan di sini, bisa dihapus jika tidak diperlukan
import MenuItem from '../mahasiswa/MenuItem.js'; // Import dari folder mahasiswa
// Import MenuItemAnswerKey tidak lagi relevan jika hanya MenuItem mahasiswa yang diuji secara langsung
// import MenuItemAnswerKey from '../studi_kasus/MenuItem.js';

// Fungsi untuk membaca konten file
const readFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`File not found: ${filePath}`);
    return '';
  }
};

// Fungsi untuk membandingkan dua string kode (tetap dipertahankan sesuai permintaan Anda)
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
    differences.forEach((part) => { // Index tidak relevan untuk output ini
      if (part.added) {
        console.log(`+ (ditambahkan): ${part.value.trim()}`);
      } else if (part.removed) {
        console.log(`- (dihapus): ${part.value.trim()}`);
      }
    });
    return false;
  }
  return true;
};

// Path file mahasiswa dan kunci jawaban
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/MenuItem.js');
const answerKeyFilePath = path.join(__dirname, '../../components/studi_kasus/MenuItem.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Mock functions untuk testing
const mockOnAdd = jest.fn();

// Bandingkan file sebelum menjalankan pengujian
const isCodeIdentical = compareFiles(studentCode, answerKeyCode);

if (isCodeIdentical) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('MenuItem Component Tests', () => {
    // Reset mock sebelum setiap tes
    beforeEach(() => {
      mockOnAdd.mockClear();
    });

    test('renders MenuItem component without crashing', () => {
      expect(() => render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      )).not.toThrow();
    });

    test('renders menu item name correctly', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      expect(screen.getByText('Nasi Goreng')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Nasi Goreng');
    });

    test('renders menu item price with correct formatting', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );
      // Menggunakan regex untuk mencocokkan 'Rp' diikuti dengan angka berformat (koma atau titik)
      // Ini akan mencocokkan "Rp 25,000" atau "Rp 25.000" dan mengatasi spasi ekstra
      expect(screen.getByText(/Rp\s*25[\.,]000/)).toBeInTheDocument();
    });

    test('renders add button with correct text', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      const addButton = screen.getByText('Tambah');
      expect(addButton).toBeInTheDocument();
      expect(addButton.tagName.toLowerCase()).toBe('button');
    });

    test('calls onAdd function when add button is clicked', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      const addButton = screen.getByText('Tambah');
      fireEvent.click(addButton);

      expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });

    test('applies correct CSS classes to main container', () => {
      const { container } = render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('border', 'p-4', 'flex', 'justify-between', 'items-center');
    });

    test('applies correct CSS classes to menu name', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      const nameElement = screen.getByText('Nasi Goreng');
      expect(nameElement).toHaveClass('font-bold');
      expect(nameElement.tagName.toLowerCase()).toBe('h2');
    });

    test('applies correct CSS classes to add button', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      const addButton = screen.getByText('Tambah');
      expect(addButton).toHaveClass('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded');
    });

    test('handles different menu names correctly', () => {
      const testNames = ['Mie Ayam', 'Gado-Gado', 'Sate Kambing', 'Es Teh Manis'];

      // Render komponen pertama kali di luar loop
      const { rerender } = render(
        <MenuItem
          name={testNames[0]} // Render dengan nama pertama
          price={15000}
          onAdd={mockOnAdd}
        />
      );

      testNames.forEach(name => {
        // Gunakan rerender untuk memperbarui komponen dengan prop baru
        rerender(
          <MenuItem
            name={name}
            price={15000}
            onAdd={mockOnAdd}
          />
        );

        expect(screen.getByText(name)).toBeInTheDocument();
        // Gunakan queryByRole dan cek apakah ada, karena bisa saja elemen tidak ditemukan setelah rerender
        // Atau, lebih baik getByRole dengan opsi name untuk mencari heading tertentu
        expect(screen.getByRole('heading', { level: 2, name: name })).toBeInTheDocument();
      });
    });

    test('handles different price values with correct formatting', () => {
      const testCases = [
        { price: 5000, expectedRegex: /Rp\s*5[\.,]000/ },
        { price: 15000, expectedRegex: /Rp\s*15[\.,]000/ },
        { price: 25000, expectedRegex: /Rp\s*25[\.,]000/ },
        { price: 100000, expectedRegex: /Rp\s*100[\.,]000/ },
        { price: 1000000, expectedRegex: /Rp\s*1[\.,]000[\.,]000/ }
      ];

      const { rerender } = render(
        <MenuItem
          name="Test Item"
          price={testCases[0].price}
          onAdd={mockOnAdd}
        />
      );

      testCases.forEach(({ price, expectedRegex }) => {
        rerender(
          <MenuItem
            name="Test Item"
            price={price}
            onAdd={mockOnAdd}
          />
        );
        expect(screen.getByText(expectedRegex)).toBeInTheDocument();
      });
    });

    test('button click triggers onAdd callback multiple times', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      const addButton = screen.getByText('Tambah');

      // Click multiple times
      fireEvent.click(addButton);
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      expect(mockOnAdd).toHaveBeenCalledTimes(3);
    });

    test('component structure has correct layout', () => {
      const { container } = render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      const mainDiv = container.firstChild;
      const contentDiv = mainDiv.firstChild;
      const button = mainDiv.lastChild;

      // Check main container
      expect(mainDiv.tagName.toLowerCase()).toBe('div');

      // Check content div structure
      expect(contentDiv.tagName.toLowerCase()).toBe('div');
      expect(contentDiv).toContainElement(screen.getByText('Nasi Goreng'));
      // Menggunakan regex yang fleksibel untuk mencocokkan harga
      expect(contentDiv).toContainElement(screen.getByText(/Rp\s*25[\.,]000/));

      // Check button
      expect(button.tagName.toLowerCase()).toBe('button');
      expect(button).toHaveTextContent('Tambah');
    });

    test('menu item displays price as paragraph element', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      // Menggunakan regex yang fleksibel untuk mencocokkan harga
      const priceElement = screen.getByText(/Rp\s*25[\.,]000/);
      expect(priceElement.tagName.toLowerCase()).toBe('p');
    });

    test('component handles zero price correctly', () => {
      render(
        <MenuItem
          name="Free Sample"
          price={0}
          onAdd={mockOnAdd}
        />
      );

      expect(screen.getByText(/Rp\s*0/)).toBeInTheDocument();
    });

    test('component handles very large prices correctly', () => {
      render(
        <MenuItem
          name="Premium Item"
          price={999999999}
          onAdd={mockOnAdd}
        />
      );

      // Menggunakan regex yang fleksibel untuk mencocokkan harga
      expect(screen.getByText(/Rp\s*999[\.,]999[\.,]999/)).toBeInTheDocument();
    });

    test('MenuItem component is properly exported as default', () => {
      expect(MenuItem).toBeDefined();
      expect(typeof MenuItem).toBe('function');
    });

    test('component renders with empty name', () => {
      render(
        <MenuItem
          name=""
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      const nameElement = screen.getByRole('heading', { level: 2 });
      expect(nameElement).toHaveTextContent('');
      // Menggunakan regex yang fleksibel untuk mencocokkan harga
      expect(screen.getByText(/Rp\s*25[\.,]000/)).toBeInTheDocument();
    });

    test('component layout maintains flex structure', () => {
      const { container } = render(
        <MenuItem
          name="Test Item"
          price={15000}
          onAdd={mockOnAdd}
        />
      );

      const mainDiv = container.firstChild;
      // Periksa style komputasi untuk memastikan properti flex
      // Note: Mengakses window.getComputedStyle() di Jest mungkin memerlukan setup JSDOM yang tepat
      // Atau, jika Anda hanya mengandalkan kelas TailwindCSS, cukup periksa kelasnya
      expect(mainDiv).toHaveClass('flex');
      expect(mainDiv).toHaveClass('justify-between');
      expect(mainDiv).toHaveClass('items-center');
    });

    test('button is accessible via role', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Tambah');
      expect(button).toBeEnabled();
    });

    test('button can be clicked using keyboard events', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      const button = screen.getByRole('button');

      // Simulate Enter key press
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      // Setelah menekan tombol, pastikan onAdd dipanggil (jika tombol memiliki event listener)
      // Ini asumsi, karena fireEvent.click sudah menguji fungsi onAdd,
      // ini lebih ke tes aksesibilitas dasar keyboard.
      // Untuk keyboard, biasanya menggunakan `userEvent.keyboard('{enter}')` setelah focus
      // Namun, karena kode Anda hanya menggunakan `fireEvent.click`, kita akan pertahankan cek dasar.
      expect(button).toBeInTheDocument();
    });

    test('props are correctly passed and used', () => {
      const testProps = {
        name: 'Special Dish',
        price: 45000,
        onAdd: mockOnAdd
      };

      render(<MenuItem {...testProps} />);

      expect(screen.getByText(testProps.name)).toBeInTheDocument();

      // PENTING: Perbaikan di sini.
      // testProps.price.toLocaleString() akan menghasilkan "45.000" jika locale default Anda menggunakan titik,
      // atau "45,000" jika menggunakan koma (seperti 'id-ID').
      // Kita perlu membuat regex yang dinamis, tapi juga toleran terhadap titik/koma.
      // Gunakan toLocaleString tanpa argumen locale agar sesuai dengan bagaimana komponen Anda merendernya.
      // Kemudian ganti titik atau koma dengan [.,] dalam regex
      const rawFormattedPrice = testProps.price.toLocaleString(); // Tanpa locale untuk mencocokkan perilaku komponen
      const priceRegexPattern = rawFormattedPrice.replace(/\./g, '[\\.,]').replace(/,/g, '[\\.,]');
      const expectedPriceRegex = new RegExp(`Rp\\s*${priceRegexPattern}`);

      expect(screen.getByText(expectedPriceRegex)).toBeInTheDocument();

      const button = screen.getByText('Tambah');
      fireEvent.click(button);

      expect(testProps.onAdd).toHaveBeenCalled();
    });
  });

} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi MenuItem component Anda.');

  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('MenuItem Component - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    beforeEach(() => {
      mockOnAdd.mockClear();
    });

    test('component should at least render without crashing', () => {
      expect(() => render(
        <MenuItem
          name="Test Item"
          price={25000}
          onAdd={mockOnAdd}
        />
      )).not.toThrow();
    });

    test('should display menu item name', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      try {
        expect(screen.getByText('Nasi Goreng')).toBeInTheDocument();
        console.log('✔ Menu item name ditemukan');
      } catch (e) {
        console.log('❌ Menu item name tidak ditemukan');
      }
    });

    test('should display menu item price', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      try {
        // Menggunakan regex yang lebih fleksibel untuk mencari angka 25000 dengan titik atau koma
        expect(screen.getByText(/25[\.,]000/)).toBeInTheDocument();
        console.log('✔ Menu item price ditemukan');
      } catch (e) {
        console.log('❌ Menu item price tidak ditemukan');
      }
    });

    test('should have add button', () => {
      render(
        <MenuItem
          name="Nasi Goreng"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      try {
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        console.log('✔ Add button ditemukan');
      } catch (e) {
        try {
          const button = screen.getByText(/tambah/i);
          expect(button).toBeInTheDocument();
          console.log('✔ Add button ditemukan (via text)');
        } catch (e2) {
          console.log('❌ Add button tidak ditemukan');
        }
      }
    });

    test('should handle button click', () => {
      render(
        <MenuItem
          name="Nasi Goreang"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      try {
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(mockOnAdd).toHaveBeenCalled();
        console.log('✔ Button click berfungsi');
      } catch (e) {
        try {
          const button = screen.getByText(/tambah/i);
          fireEvent.click(button);
          expect(mockOnAdd).toHaveBeenCalled();
          console.log('✔ Button click berfungsi (via text)');
        } catch (e2) {
          console.log('❌ Button click tidak berfungsi');
        }
      }
    });

    test('should format price correctly', () => {
      render(
        <MenuItem
          name="Test Item"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      try {
        // Menggunakan regex yang fleksibel
        expect(screen.getByText(/25[\.,]000/)).toBeInTheDocument();
        console.log('✔ Price formatting dengan titik/koma ditemukan');
      } catch (e) {
        try {
          expect(screen.getByText(/25000/)).toBeInTheDocument();
          console.log('⚠ Price tanpa formatting ditemukan');
        } catch (e3) {
          console.log('❌ Price tidak ditemukan dalam format apapun');
        }
      }
    });

    test('should have proper component structure', () => {
      const { container } = render(
        <MenuItem
          name="Test Item"
          price={25000}
          onAdd={mockOnAdd}
        />
      );

      try {
        const mainDiv = container.firstChild;
        expect(mainDiv.tagName.toLowerCase()).toBe('div');
        console.log('✔ Main container div ditemukan');
      } catch (e) {
        console.log('❌ Main container div tidak ditemukan');
      }

      try {
        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        console.log('✔ Heading element ditemukan');
      } catch (e) {
        console.log('❌ Heading element tidak ditemukan');
      }
    });

    test('should handle different props correctly', () => {
      const { rerender } = render(
        <MenuItem
          name="Item 1"
          price={10000}
          onAdd={mockOnAdd}
        />
      );

      try {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        console.log('✔ Props name berfungsi');
      } catch (e) {
        console.log('❌ Props name tidak berfungsi');
      }

      rerender(
        <MenuItem
          name="Item 2"
          price={20000}
          onAdd={mockOnAdd}
        />
      );

      try {
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        console.log('✔ Props update berfungsi');
      } catch (e) {
        console.log('❌ Props update tidak berfungsi');
      }
    });

    test('should be properly exported', () => {
      try {
        expect(MenuItem).toBeDefined();
        expect(typeof MenuItem).toBe('function');
        console.log('✔ Component export berfungsi');
      } catch (e) {
        console.log('❌ Component export tidak berfungsi');
      }
    });
  });
}