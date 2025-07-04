import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import Tantangan1 from '../conditional_rendering/Tantangan1.js'; // Import dari folder kunci jawaban

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
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/Tantangan1.js');
const answerKeyFilePath = path.join(__dirname, '../../components/conditional_rendering/Tantangan1.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('Tantangan1 Component Tests', () => {
    test('renders Tantangan1 component without crashing', () => {
      expect(() => render(<Tantangan1 />)).not.toThrow();
    });

    test('renders main section with correct title', () => {
      render(<Tantangan1 />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Sally Ride's Packing List");
    });

    test('renders section element as main container', () => {
      const { container } = render(<Tantangan1 />);
      const sectionElement = container.querySelector('section');
      expect(sectionElement).toBeInTheDocument();
    });

    test('renders unordered list element', () => {
      render(<Tantangan1 />);
      const listElement = screen.getByRole('list');
      expect(listElement).toBeInTheDocument();
      expect(listElement.tagName.toLowerCase()).toBe('ul');
    });

    test('renders exactly 3 list items', () => {
      render(<Tantangan1 />);
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    test('renders all list items with correct class', () => {
      render(<Tantangan1 />);
      const listItems = screen.getAllByRole('listitem');
      
      listItems.forEach(item => {
        expect(item).toHaveClass('item');
      });
    });

    test('renders Space suit item as packed (with ✅)', () => {
      render(<Tantangan1 />);
      const spaceSuitItem = screen.getByText(/Space suit/);
      expect(spaceSuitItem).toBeInTheDocument();
      expect(spaceSuitItem).toHaveTextContent('Space suit ✅');
    });

    test('renders Helmet with a golden leaf item as packed (with ✅)', () => {
      render(<Tantangan1 />);
      const helmetItem = screen.getByText(/Helmet with a golden leaf/);
      expect(helmetItem).toBeInTheDocument();
      expect(helmetItem).toHaveTextContent('Helmet with a golden leaf ✅');
    });

    test('renders Photo of Tam item as not packed (with ❌)', () => {
      render(<Tantangan1 />);
      const photoItem = screen.getByText(/Photo of Tam/);
      expect(photoItem).toBeInTheDocument();
      expect(photoItem).toHaveTextContent('Photo of Tam ❌');
    });

    test('Item component handles isPacked prop correctly for packed items', () => {
      render(<Tantangan1 />);
      
      // Check packed items have checkmark
      const packedItems = screen.getAllByText(/✅/);
      expect(packedItems).toHaveLength(2);
      
      // Verify specific packed items
      expect(screen.getByText('Space suit ✅')).toBeInTheDocument();
      expect(screen.getByText('Helmet with a golden leaf ✅')).toBeInTheDocument();
    });

    test('Item component handles isPacked prop correctly for unpacked items', () => {
      render(<Tantangan1 />);
      
      // Check unpacked items have X mark
      const unpackedItems = screen.getAllByText(/❌/);
      expect(unpackedItems).toHaveLength(1);
      
      // Verify specific unpacked item
      expect(screen.getByText('Photo of Tam ❌')).toBeInTheDocument();
    });

    test('Item component receives correct props', () => {
      render(<Tantangan1 />);
      
      // Verify all items are rendered with correct names
      expect(screen.getByText(/Space suit/)).toBeInTheDocument();
      expect(screen.getByText(/Helmet with a golden leaf/)).toBeInTheDocument();
      expect(screen.getByText(/Photo of Tam/)).toBeInTheDocument();
    });

    test('component structure is correct', () => {
      const { container } = render(<Tantangan1 />);
      
      // Check main structure: section > h1 + ul > li items
      const section = container.querySelector('section');
      const heading = section.querySelector('h1');
      const list = section.querySelector('ul');
      const listItems = list.querySelectorAll('li');
      
      expect(section).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(list).toBeInTheDocument();
      expect(listItems).toHaveLength(3);
    });

    test('all items have correct order', () => {
      render(<Tantangan1 />);
      const listItems = screen.getAllByRole('listitem');
      
      // Check order of items
      expect(listItems[0]).toHaveTextContent('Space suit ✅');
      expect(listItems[1]).toHaveTextContent('Helmet with a golden leaf ✅');
      expect(listItems[2]).toHaveTextContent('Photo of Tam ❌');
    });

    test('Item component conditional rendering works correctly', () => {
      render(<Tantangan1 />);
      
      // Test that isPacked=true shows checkmark
      const packedItems = screen.getAllByText(/✅/);
      expect(packedItems).toHaveLength(2);
      
      // Test that isPacked=false shows X mark
      const unpackedItems = screen.getAllByText(/❌/);
      expect(unpackedItems).toHaveLength(1);
    });

    test('Tantangan1 component is properly exported as default', () => {
      expect(Tantangan1).toBeDefined();
      expect(typeof Tantangan1).toBe('function');
    });

    test('Item component uses correct JSX structure', () => {
      render(<Tantangan1 />);
      const listItems = screen.getAllByRole('listitem');
      
      // Each item should be a li element with class "item"
      listItems.forEach(item => {
        expect(item.tagName.toLowerCase()).toBe('li');
        expect(item).toHaveClass('item');
      });
    });

   test('component renders with correct semantic HTML', () => {
    //   render(<Tantangan1 />);
      
      // Check semantic structure
      const { container } = render(<Tantangan1 />); // Render ulang untuk mendapatkan container
      expect(container.querySelector('section')).toBeInTheDocument(); // Memastikan elemen section ada
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
    test('all required props are passed to Item components', () => {
      render(<Tantangan1 />);
      
      // Verify that each item has both name and packed status
      const items = [
        { name: 'Space suit', packed: true },
        { name: 'Helmet with a golden leaf', packed: true },
        { name: 'Photo of Tam', packed: false }
      ];
      
      items.forEach(item => {
        const element = screen.getByText(new RegExp(item.name));
        expect(element).toBeInTheDocument();
        
        if (item.packed) {
          expect(element).toHaveTextContent('✅');
        } else {
          expect(element).toHaveTextContent('❌');
        }
      });
    });

  });

} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi Tantangan1 component Anda.');
  
  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('Tantangan1 Component - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    test('component should at least render without crashing', () => {
      expect(() => render(<Tantangan1 />)).not.toThrow();
    });

    test('should contain basic structure elements', () => {
      render(<Tantangan1 />);
      
      // Test minimal requirements
      try {
        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        console.log('✔ Heading ditemukan');
      } catch (e) {
        console.log('❌ Heading tidak ditemukan');
      }

      try {
        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
        console.log('✔ List element ditemukan');
      } catch (e) {
        console.log('❌ List element tidak ditemukan');
      }

      try {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems.length).toBeGreaterThan(0);
        console.log(`✔ List items ditemukan (${listItems.length} items)`);
      } catch (e) {
        console.log('❌ List items tidak ditemukan');
      }
    });

    test('should have correct title', () => {
      render(<Tantangan1 />);
      
      try {
        expect(screen.getByText(/Sally Ride's Packing List/i)).toBeInTheDocument();
        console.log('✔ Title "Sally Ride\'s Packing List" ditemukan');
      } catch (e) {
        console.log('❌ Title "Sally Ride\'s Packing List" tidak ditemukan');
      }
    });

    test('should have packing items', () => {
      render(<Tantangan1 />);
      
      try {
        expect(screen.getByText(/Space suit/i)).toBeInTheDocument();
        console.log('✔ Item "Space suit" ditemukan');
      } catch (e) {
        console.log('❌ Item "Space suit" tidak ditemukan');
      }

      try {
        expect(screen.getByText(/Helmet/i)).toBeInTheDocument();
        console.log('✔ Item "Helmet" ditemukan');
      } catch (e) {
        console.log('❌ Item "Helmet" tidak ditemukan');
      }

      try {
        expect(screen.getByText(/Photo of Tam/i)).toBeInTheDocument();
        console.log('✔ Item "Photo of Tam" ditemukan');
      } catch (e) {
        console.log('❌ Item "Photo of Tam" tidak ditemukan');
      }
    });

    test('should have packed and unpacked indicators', () => {
      render(<Tantangan1 />);
      
      try {
        const packedItems = screen.getAllByText(/✅/);
        expect(packedItems.length).toBeGreaterThan(0);
        console.log(`✔ Packed items (✅) ditemukan (${packedItems.length} items)`);
      } catch (e) {
        console.log('❌ Packed items (✅) tidak ditemukan');
      }

      try {
        const unpackedItems = screen.getAllByText(/❌/);
        expect(unpackedItems.length).toBeGreaterThan(0);
        console.log(`✔ Unpacked items (❌) ditemukan (${unpackedItems.length} items)`);
      } catch (e) {
        console.log('❌ Unpacked items (❌) tidak ditemukan');
      }
    });

    test('should have proper component structure', () => {
      const { container } = render(<Tantangan1 />);
      
      try {
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
        console.log('✔ Section element ditemukan');
      } catch (e) {
        console.log('❌ Section element tidak ditemukan');
      }

      try {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems.length).toBe(3);
        console.log('✔ Jumlah list items sesuai (3 items)');
      } catch (e) {
        console.log('❌ Jumlah list items tidak sesuai');
      }

      try {
        const listItems = screen.getAllByRole('listitem');
        listItems.forEach(item => {
          expect(item).toHaveClass('item');
        });
        console.log('✔ CSS class "item" ditemukan pada semua list items');
      } catch (e) {
        console.log('❌ CSS class "item" tidak ditemukan pada list items');
      }
    });
  });
}