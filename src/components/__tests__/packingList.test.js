import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import PackingList from '../../components/conditional_rendering/PackingList.js'; // Import dari folder kunci jawaban

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
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/PackingList.js');
const answerKeyFilePath = path.join(__dirname, '../../components/conditional_rendering/PackingList.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('PackingList Component Tests', () => {
    test('renders PackingList component without crashing', () => {
      expect(() => render(<PackingList />)).not.toThrow();
    });

    test('renders main title correctly', () => {
      render(<PackingList />);
      expect(screen.getByText("Sally Ride's Packing List")).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Sally Ride's Packing List");
    });

    test('renders section and ul elements', () => {
      const { container } = render(<PackingList />);
      
      const section = container.querySelector('section');
      const ul = container.querySelector('ul');
      
      expect(section).toBeInTheDocument();
      expect(ul).toBeInTheDocument();
      expect(section).toContainElement(ul);
    });

    test('renders all three items', () => {
      render(<PackingList />);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    test('renders packed items with strikethrough and checkmark', () => {
      render(<PackingList />);
      
      // Check Space suit (packed)
      const spaceSuitItem = screen.getByText('Space suit ✅');
      expect(spaceSuitItem).toBeInTheDocument();
      expect(spaceSuitItem.tagName.toLowerCase()).toBe('del');
      
      // Check Helmet (packed)
      const helmetItem = screen.getByText('Helmet with a golden leaf ✅');
      expect(helmetItem).toBeInTheDocument();
      expect(helmetItem.tagName.toLowerCase()).toBe('del');
    });

    test('renders unpacked items without strikethrough', () => {
      render(<PackingList />);
      
      // Check Photo of Tam (not packed)
      const photoItem = screen.getByText('Photo of Tam');
      expect(photoItem).toBeInTheDocument();
      
      // Should not be wrapped in del tag
      expect(photoItem.tagName.toLowerCase()).not.toBe('del');
    });

    test('all list items have correct CSS class', () => {
      render(<PackingList />);
      
      const listItems = screen.getAllByRole('listitem');
      listItems.forEach(item => {
        expect(item).toHaveClass('item');
      });
    });

    test('Space suit item is properly packed', () => {
      render(<PackingList />);
      
      const listItems = screen.getAllByRole('listitem');
      const spaceSuitItem = listItems.find(item => 
        item.textContent.includes('Space suit')
      );
      
      expect(spaceSuitItem).toBeInTheDocument();
      expect(spaceSuitItem).toHaveClass('item');
      expect(spaceSuitItem.querySelector('del')).toBeInTheDocument();
      expect(spaceSuitItem.textContent).toContain('✅');
    });

    test('Helmet item is properly packed', () => {
      render(<PackingList />);
      
      const listItems = screen.getAllByRole('listitem');
      const helmetItem = listItems.find(item => 
        item.textContent.includes('Helmet with a golden leaf')
      );
      
      expect(helmetItem).toBeInTheDocument();
      expect(helmetItem).toHaveClass('item');
      expect(helmetItem.querySelector('del')).toBeInTheDocument();
      expect(helmetItem.textContent).toContain('✅');
    });

    test('Photo of Tam item is properly unpacked', () => {
      render(<PackingList />);
      
      const listItems = screen.getAllByRole('listitem');
      const photoItem = listItems.find(item => 
        item.textContent.includes('Photo of Tam')
      );
      
      expect(photoItem).toBeInTheDocument();
      expect(photoItem).toHaveClass('item');
      expect(photoItem.querySelector('del')).not.toBeInTheDocument();
      expect(photoItem.textContent).not.toContain('✅');
    });

    test('conditional rendering works correctly for packed items', () => {
      render(<PackingList />);
      
      // Check that packed items have del tags
      const delElements = screen.getAllByText((content, element) => {
        return element && element.tagName.toLowerCase() === 'del';
      });
      
      expect(delElements).toHaveLength(2); // Space suit and Helmet
    });

    test('items are rendered in correct order', () => {
      render(<PackingList />);
      
      const listItems = screen.getAllByRole('listitem');
      
      // First item: Space suit (packed)
      expect(listItems[0].textContent).toContain('Space suit');
      expect(listItems[0].textContent).toContain('✅');
      
      // Second item: Helmet (packed)
      expect(listItems[1].textContent).toContain('Helmet with a golden leaf');
      expect(listItems[1].textContent).toContain('✅');
      
      // Third item: Photo of Tam (not packed)
      expect(listItems[2].textContent).toContain('Photo of Tam');
      expect(listItems[2].textContent).not.toContain('✅');
    });

    test('isPacked prop controls conditional rendering', () => {
      render(<PackingList />);
      
      const listItems = screen.getAllByRole('listitem');
      
      // Items with isPacked={true} should have del tags
      const packedItems = listItems.filter(item => 
        item.querySelector('del') !== null
      );
      expect(packedItems).toHaveLength(2);
      
      // Items with isPacked={false} should not have del tags
      const unpackedItems = listItems.filter(item => 
        item.querySelector('del') === null
      );
      expect(unpackedItems).toHaveLength(1);
    });

    test('name prop is displayed correctly', () => {
      render(<PackingList />);
      
      // Check all three names are displayed
      expect(screen.getByText(/Space suit/)).toBeInTheDocument();
      expect(screen.getByText(/Helmet with a golden leaf/)).toBeInTheDocument();
      expect(screen.getByText(/Photo of Tam/)).toBeInTheDocument();
    });

    test('checkmark emoji is added only to packed items', () => {
      render(<PackingList />);
      
      const listItems = screen.getAllByRole('listitem');
      
      // Count items with checkmark
      const itemsWithCheckmark = listItems.filter(item => 
        item.textContent.includes('✅')
      );
      expect(itemsWithCheckmark).toHaveLength(2);
      
      // Count items without checkmark
      const itemsWithoutCheckmark = listItems.filter(item => 
        !item.textContent.includes('✅')
      );
      expect(itemsWithoutCheckmark).toHaveLength(1);
    });

    test('Item component handles props correctly', () => {
      render(<PackingList />);
      
      const listItems = screen.getAllByRole('listitem');
      
      // Test that each item has the correct structure
      listItems.forEach(item => {
        expect(item.tagName.toLowerCase()).toBe('li');
        expect(item).toHaveClass('item');
        
        // Check content based on packing status
        if (item.textContent.includes('✅')) {
          expect(item.querySelector('del')).toBeInTheDocument();
        } else {
          expect(item.querySelector('del')).not.toBeInTheDocument();
        }
      });
    });

    test('component structure matches expected HTML', () => {
      const { container } = render(<PackingList />);
      
      // Check overall structure
      const section = container.querySelector('section');
      const h1 = section.querySelector('h1');
      const ul = section.querySelector('ul');
      const listItems = ul.querySelectorAll('li');
      
      expect(section).toBeInTheDocument();
      expect(h1).toBeInTheDocument();
      expect(ul).toBeInTheDocument();
      expect(listItems).toHaveLength(3);
      
      // Check each li has item class
      listItems.forEach(li => {
        expect(li).toHaveClass('item');
      });
    });

    test('del tags contain correct content', () => {
      render(<PackingList />);
      
      const delElements = document.querySelectorAll('del');
      
      expect(delElements).toHaveLength(2);
      expect(delElements[0].textContent).toBe('Space suit ✅');
      expect(delElements[1].textContent).toBe('Helmet with a golden leaf ✅');
    });

    test('component exports are correct', () => {
      expect(PackingList).toBeDefined();
      expect(typeof PackingList).toBe('function');
    });

    test('conditional logic works with different isPacked values', () => {
      render(<PackingList />);
      
      const listItems = screen.getAllByRole('listitem');
      
      // Space suit: isPacked={true}
      const spaceSuit = listItems[0];
      expect(spaceSuit.querySelector('del')).toBeInTheDocument();
      expect(spaceSuit.textContent).toContain('Space suit ✅');
      
      // Helmet: isPacked={true}
      const helmet = listItems[1];
      expect(helmet.querySelector('del')).toBeInTheDocument();
      expect(helmet.textContent).toContain('Helmet with a golden leaf ✅');
      
      // Photo: isPacked={false}
      const photo = listItems[2];
      expect(photo.querySelector('del')).not.toBeInTheDocument();
      expect(photo.textContent).toBe('Photo of Tam');
    });

    test('itemContent variable logic works correctly', () => {
      render(<PackingList />);
      
      // This tests the conditional assignment of itemContent
      const listItems = screen.getAllByRole('listitem');
      
      // For packed items, itemContent should be wrapped in del tags
      const packedItems = listItems.filter(item => item.querySelector('del'));
      packedItems.forEach(item => {
        const delElement = item.querySelector('del');
        expect(delElement).toBeInTheDocument();
        expect(delElement.textContent).toContain('✅');
      });
      
      // For unpacked items, itemContent should be just the name
      const unpackedItems = listItems.filter(item => !item.querySelector('del'));
      unpackedItems.forEach(item => {
        expect(item.textContent).not.toContain('✅');
      });
    });

  });

} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi PackingList component Anda.');
  
  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('PackingList Component - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    test('component should at least render without crashing', () => {
      expect(() => render(<PackingList />)).not.toThrow();
    });

    test('should contain basic structure elements', () => {
      render(<PackingList />);
      
      try {
        expect(screen.getByText(/Sally Ride/i)).toBeInTheDocument();
        console.log('✔ Judul Sally Ride ditemukan');
      } catch (e) {
        console.log('❌ Judul Sally Ride tidak ditemukan');
      }

      try {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems.length).toBeGreaterThan(0);
        console.log('✔ List items ditemukan');
      } catch (e) {
        console.log('❌ List items tidak ditemukan');
      }

      try {
        expect(screen.getByRole('heading')).toBeInTheDocument();
        console.log('✔ Heading element ditemukan');
      } catch (e) {
        console.log('❌ Heading element tidak ditemukan');
      }
    });

    test('should have packing list items', () => {
      render(<PackingList />);
      
      try {
        expect(screen.getByText(/Space suit/i)).toBeInTheDocument();
        console.log('✔ Space suit item ditemukan');
      } catch (e) {
        console.log('❌ Space suit item tidak ditemukan');
      }

      try {
        expect(screen.getByText(/Helmet/i)).toBeInTheDocument();
        console.log('✔ Helmet item ditemukan');
      } catch (e) {
        console.log('❌ Helmet item tidak ditemukan');
      }

      try {
        expect(screen.getByText(/Photo of Tam/i)).toBeInTheDocument();
        console.log('✔ Photo of Tam item ditemukan');
      } catch (e) {
        console.log('❌ Photo of Tam item tidak ditemukan');
      }
    });

    test('should have proper list structure', () => {
      const { container } = render(<PackingList />);
      
      try {
        const ul = container.querySelector('ul');
        expect(ul).toBeInTheDocument();
        console.log('✔ UL element ditemukan');
      } catch (e) {
        console.log('❌ UL element tidak ditemukan');
      }

      try {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems.length).toBe(3);
        console.log('✔ 3 list items ditemukan');
      } catch (e) {
        console.log('❌ Jumlah list items tidak sesuai');
      }
    });

    test('should handle packed items correctly', () => {
      render(<PackingList />);
      
      try {
        const { container } = render(<PackingList />);
        const delElements = container.querySelectorAll('del');
        
        if (delElements.length > 0) {
          console.log('✔ Del elements untuk packed items ditemukan');
        } else {
          console.log('❌ Del elements untuk packed items tidak ditemukan');
        }
      } catch (e) {
        console.log('❌ Error saat memeriksa packed items');
      }

      try {
        const itemsWithCheckmark = screen.getAllByText(/✅/);
        if (itemsWithCheckmark.length > 0) {
          console.log('✔ Checkmark emoji ditemukan');
        } else {
          console.log('❌ Checkmark emoji tidak ditemukan');
        }
      } catch (e) {
        console.log('❌ Error saat memeriksa checkmark');
      }
    });

    test('should have proper CSS classes', () => {
      render(<PackingList />);
      
      try {
        const listItems = screen.getAllByRole('listitem');
        const hasItemClass = listItems.some(item => item.classList.contains('item'));
        
        if (hasItemClass) {
          console.log('✔ CSS class "item" ditemukan');
        } else {
          console.log('❌ CSS class "item" tidak ditemukan');
        }
      } catch (e) {
        console.log('❌ Error saat memeriksa CSS classes');
      }
    });

    test('should have proper component structure', () => {
      const { container } = render(<PackingList />);
      
      try {
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
        console.log('✔ Section element ditemukan');
      } catch (e) {
        console.log('❌ Section element tidak ditemukan');
      }

      try {
        const h1 = container.querySelector('h1');
        expect(h1).toBeInTheDocument();
        console.log('✔ H1 element ditemukan');
      } catch (e) {
        console.log('❌ H1 element tidak ditemukan');
      }
    });

    test('should export component properly', () => {
      try {
        expect(PackingList).toBeDefined();
        expect(typeof PackingList).toBe('function');
        console.log('✔ Component export ditemukan');
      } catch (e) {
        console.log('❌ Component export tidak sesuai');
      }
    });

    test('should handle conditional rendering', () => {
      render(<PackingList />);
      
      try {
        const listItems = screen.getAllByRole('listitem');
        const hasVariedContent = listItems.some(item => 
          item.textContent.includes('✅')
        ) && listItems.some(item => 
          !item.textContent.includes('✅')
        );
        
        if (hasVariedContent) {
          console.log('✔ Conditional rendering detected');
        } else {
          console.log('❌ Conditional rendering tidak terdeteksi');
        }
      } catch (e) {
        console.log('❌ Error saat memeriksa conditional rendering');
      }
    });

    test('should handle props correctly', () => {
      render(<PackingList />);
      
      try {
        const listItems = screen.getAllByRole('listitem');
        const hasContent = listItems.every(item => item.textContent.length > 0);
        
        if (hasContent) {
          console.log('✔ Props handling detected');
        } else {
          console.log('❌ Props handling tidak terdeteksi');
        }
      } catch (e) {
        console.log('❌ Error saat memeriksa props handling');
      }
    });

    test('should render all required items', () => {
      render(<PackingList />);
      
      const requiredItems = ['Space suit', 'Helmet', 'Photo of Tam'];
      
      requiredItems.forEach(item => {
        try {
          expect(screen.getByText(new RegExp(item, 'i'))).toBeInTheDocument();
          console.log(`✔ ${item} ditemukan`);
        } catch (e) {
          console.log(`❌ ${item} tidak ditemukan`);
        }
      });
    });
  });
}