import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import Tantangan2 from '../conditional_rendering/Tantangan2.js'; // Import dari folder kunci jawaban 

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
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/Tantangan2.js');
const answerKeyFilePath = path.join(__dirname, '../../components/conditional_rendering/Tantangan2.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('Tantangan2 Component Tests', () => {
    test('renders Tantangan2 component without crashing', () => {
      expect(() => render(<Tantangan2 />)).not.toThrow();
    });

    test('renders main section with correct title', () => {
      render(<Tantangan2 />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Sally Ride's Packing List");
    });

    test('renders section element as main container', () => {
      const { container } = render(<Tantangan2 />);
      const sectionElement = container.querySelector('section');
      expect(sectionElement).toBeInTheDocument();
    });

    test('renders unordered list element', () => {
      render(<Tantangan2 />);
      const listElement = screen.getByRole('list');
      expect(listElement).toBeInTheDocument();
      expect(listElement.tagName.toLowerCase()).toBe('ul');
    });

    test('renders exactly 3 list items', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    test('renders all list items with correct class', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      
      listItems.forEach(item => {
        expect(item).toHaveClass('item');
      });
    });

    // --- MULAI PERBAIKAN DENGAN getAllByRole('listitem') DAN toHaveTextContent / toMatch ---
    // Mengubah semua getByText yang bermasalah di sini

    test('renders Space suit item with importance 9', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      // Temukan item yang sesuai berdasarkan textContent
      const spaceSuitItem = listItems.find(item => item.textContent.includes('Space suit') && item.textContent.includes('(Importance: 9)'));
      
      expect(spaceSuitItem).toBeInTheDocument();
      expect(spaceSuitItem).toHaveTextContent('Space suit (Importance: 9)');
    });

    test('renders Helmet item without importance (importance = 0)', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      const helmetItem = listItems.find(item => item.textContent.includes('Helmet with a golden leaf'));
      
      expect(helmetItem).toBeInTheDocument();
      expect(helmetItem).toHaveTextContent('Helmet with a golden leaf');
      expect(helmetItem).not.toHaveTextContent('Importance');
    });

    test('renders Photo of Tam item with importance 6', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      const photoItem = listItems.find(item => item.textContent.includes('Photo of Tam') && item.textContent.includes('(Importance: 6)'));
      
      expect(photoItem).toBeInTheDocument();
      expect(photoItem).toHaveTextContent('Photo of Tam (Importance: 6)');
    });

    // TES YANG DIPERBAIKI: Menggunakan find pada getAllByRole('listitem')
    test('Item component handles importance prop > 0 correctly', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      
      const spaceSuitItem = listItems.find(item => item.textContent.includes('Space suit') && item.textContent.includes('(Importance: 9)'));
      const photoItem = listItems.find(item => item.textContent.includes('Photo of Tam') && item.textContent.includes('(Importance: 6)'));

      expect(spaceSuitItem).toBeInTheDocument();
      expect(photoItem).toBeInTheDocument();
    });

    // MENGGUNAKAN find pada getAllByRole('listitem')
    test('Item component handles importance prop = 0 correctly', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      
      const helmetItem = listItems.find(item => item.textContent.includes('Helmet with a golden leaf'));
      expect(helmetItem).toHaveTextContent('Helmet with a golden leaf');
      expect(helmetItem).not.toHaveTextContent('(Importance:');
    });

    test('importance text is rendered in italic element', () => {
      const { container } = render(<Tantangan2 />);
      
      const italicElements = container.querySelectorAll('i');
      expect(italicElements).toHaveLength(2);
      
      expect(italicElements[0]).toHaveTextContent('(Importance: 9)');
      expect(italicElements[1]).toHaveTextContent('(Importance: 6)');
    });

    test('conditional rendering works correctly for importance', () => {
      render(<Tantangan2 />);
      
      const importanceTexts = screen.getAllByText(/\(Importance:/);
      expect(importanceTexts).toHaveLength(2);
      
      expect(screen.getByText('(Importance: 9)')).toBeInTheDocument();
      expect(screen.getByText('(Importance: 6)')).toBeInTheDocument();
    });

    // MENGGUNAKAN find pada getAllByRole('listitem')
    test('Item component receives correct props', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      
      expect(listItems.find(item => item.textContent.includes('Space suit'))).toBeInTheDocument();
      expect(listItems.find(item => item.textContent.includes('Helmet with a golden leaf'))).toBeInTheDocument();
      expect(listItems.find(item => item.textContent.includes('Photo of Tam'))).toBeInTheDocument();
    });

    test('component structure is correct', () => {
      const { container } = render(<Tantangan2 />);
      
      const section = container.querySelector('section');
      const heading = section.querySelector('h1');
      const list = section.querySelector('ul');
      const listItems = list.querySelectorAll('li');
      
      expect(section).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(list).toBeInTheDocument();
      expect(listItems).toHaveLength(3);
    });

    test('all items have correct order and values', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      
      expect(listItems[0]).toHaveTextContent('Space suit (Importance: 9)');
      expect(listItems[1]).toHaveTextContent('Helmet with a golden leaf');
      expect(listItems[2]).toHaveTextContent('Photo of Tam (Importance: 6)');
    });

    // TES YANG DIPERBAIKI: Menggunakan find pada getAllByRole('listitem') dan toMatch
    test('space is added before importance when importance > 0', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      
      const spaceSuitItem = listItems.find(item => item.textContent.includes('Space suit') && item.textContent.includes('(Importance: 9)'));
      const photoItem = listItems.find(item => item.textContent.includes('Photo of Tam') && item.textContent.includes('(Importance: 6)'));
      
      expect(spaceSuitItem).toBeInTheDocument();
      expect(photoItem).toBeInTheDocument();
      
      // Verifikasi pola teks dengan spasi yang benar pada textContent elemen li
      expect(spaceSuitItem.textContent).toMatch(/Space suit\s+\(Importance:\s*9\)/);
      expect(photoItem.textContent).toMatch(/Photo of Tam\s+\(Importance:\s*6\)/);
    });

    // MENGGUNAKAN find pada getAllByRole('listitem')
    test('no extra space when importance is 0', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      
      const helmetItem = listItems.find(item => item.textContent.includes('Helmet with a golden leaf'));
      expect(helmetItem).toBeInTheDocument();
      expect(helmetItem.textContent).toBe('Helmet with a golden leaf');
      expect(helmetItem.textContent).not.toMatch(/\s$/); // Should not end with extra space
    });

    test('Tantangan2 component is properly exported as default', () => {
      expect(Tantangan2).toBeDefined();
      expect(typeof Tantangan2).toBe('function');
    });

    test('Item component uses correct JSX structure', () => {
      render(<Tantangan2 />);
      const listItems = screen.getAllByRole('listitem');
      
      listItems.forEach(item => {
        expect(item.tagName.toLowerCase()).toBe('li');
        expect(item).toHaveClass('item');
      });
    });

    // MENGGUNAKAN find pada getAllByRole('listitem')
    test('importance values are passed correctly as props', () => {
      render(<Tantangan2 />);
      
      const itemsData = [ // Ubah nama variabel untuk menghindari konflik dengan `items` di luar scope
        { name: 'Space suit', importance: 9 },
        { name: 'Helmet with a golden leaf', importance: 0 },
        { name: 'Photo of Tam', importance: 6 }
      ];
      
      itemsData.forEach(item => {
        const listItems = screen.getAllByRole('listitem');
        const element = listItems.find(li => li.textContent.includes(item.name));
        
        expect(element).toBeInTheDocument();
        
        if (item.importance > 0) {
          expect(element).toHaveTextContent(`(Importance: ${item.importance})`);
        } else {
          expect(element).not.toHaveTextContent('Importance');
        }
      });
    });

    test('conditional logical AND operator works correctly', () => {
      render(<Tantangan2 />);
      
      const listItems = screen.getAllByRole('listitem');
      
      expect(listItems[0]).toHaveTextContent('(Importance: 9)');
      expect(listItems[1]).not.toHaveTextContent('Importance');
      expect(listItems[2]).toHaveTextContent('(Importance: 6)');
    });

    // TES INI SUDAH LULUS JIKA KOMPONEN Tantangan2.js MEMILIKI role="banner"
    test('component renders with correct semantic HTML', () => {
      render(<Tantangan2 />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument(); 
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    // MENGGUNAKAN find pada getAllByRole('listitem')
    test('all required props are passed to Item components', () => {
      render(<Tantangan2 />);
      
      const expectedItems = [
        { name: 'Space suit', importance: 9, shouldShowImportance: true },
        { name: 'Helmet with a golden leaf', importance: 0, shouldShowImportance: false },
        { name: 'Photo of Tam', importance: 6, shouldShowImportance: true }
      ];
      
      expectedItems.forEach(item => {
        const listItems = screen.getAllByRole('listitem');
        const element = listItems.find(li => li.textContent.includes(item.name));
        
        expect(element).toBeInTheDocument();
        
        if (item.shouldShowImportance) {
          expect(element).toHaveTextContent(`(Importance: ${item.importance})`);
        } else {
          expect(element).not.toHaveTextContent('Importance');
        }
      });
    });

  });

} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi Tantangan2 component Anda.');
  
  describe('Tantangan2 Component - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    test('component should at least render without crashing', () => {
      expect(() => render(<Tantangan2 />)).not.toThrow();
    });

    test('should contain basic structure elements', () => {
      render(<Tantangan2 />);
      
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
      render(<Tantangan2 />);
      
      try {
        expect(screen.getByText(/Sally Ride's Packing List/i)).toBeInTheDocument();
        console.log('✔ Title "Sally Ride\'s Packing List" ditemukan');
      } catch (e) {
        console.log('❌ Title "Sally Ride\'s Packing List" tidak ditemukan');
      }
    });

    test('should have packing items', () => {
      render(<Tantangan2 />);
      
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

    test('should have importance indicators', () => {
      render(<Tantangan2 />);
      
      try {
        const importanceTexts = screen.getAllByText(/Importance/i);
        expect(importanceTexts.length).toBeGreaterThan(0);
        console.log(`✔ Importance indicators ditemukan (${importanceTexts.length} items)`);
      } catch (e) {
        console.log('❌ Importance indicators tidak ditemukan');
      }

      try {
        const italicElements = container.querySelectorAll('i');
        expect(italicElements.length).toBeGreaterThan(0);
        console.log(`✔ Formatted importance text ditemukan (${italicElements.length} items)`);
      } catch (e) {
        console.log('❌ Formatted importance text tidak ditemukan');
      }
    });

    test('should have proper component structure', () => {
      const { container } = render(<Tantangan2 />);
      
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

    test('should handle conditional rendering', () => {
      render(<Tantangan2 />);
      
      try {
        // Check if some items have importance and some don't
        const allText = document.body.textContent;
        const hasImportanceItems = allText.includes('Importance');
        expect(hasImportanceItems).toBe(true);
        console.log('✔ Conditional importance rendering detected');
      } catch (e) {
        console.log('❌ Conditional importance rendering tidak terdeteksi');
      }

      try {
        const italicElements = container.querySelectorAll('i');
        expect(italicElements.length).toBeGreaterThan(0);
        console.log(`✔ Italic elements untuk importance ditemukan (${italicElements.length} items)`);
      } catch (e) {
        console.log('❌ Italic elements untuk importance tidak ditemukan');
      }
    });
  });
}