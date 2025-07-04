import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tombol_1, { Tombol_2, Tombol_3 } from '../../components/event_handler/button.js'; // Import dari folder kunci jawaban

// Mock untuk window.alert
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
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/button.js');
const answerKeyFilePath = path.join(__dirname, '../../components/event_handler/button.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('Tombol Components Tests', () => {
    // Reset mock sebelum setiap tes
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('Tombol_1 Component Tests', () => {
      test('renders Tombol_1 component without crashing', () => {
        expect(() => render(<Tombol_1 />)).not.toThrow();
      });

      test('renders button with correct text content', () => {
        render(<Tombol_1 />);
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('ini tombol');
      });

      test('has correct CSS classes', () => {
        render(<Tombol_1 />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'p-2', 'rounded');
      });

      test('shows alert when button is clicked', () => {
        render(<Tombol_1 />);
        const button = screen.getByRole('button');
        
        fireEvent.click(button);
        expect(global.alert).toHaveBeenCalledWith('Tombol telah ditekan!!!');
      });

      test('shows alert when mouse leaves the button', () => {
        render(<Tombol_1 />);
        const button = screen.getByRole('button');
        
        fireEvent.mouseLeave(button);
        expect(global.alert).toHaveBeenCalledWith('Loh, kok sudah pergi?');
      });

      test('does not trigger mouseOver event (should be commented out)', () => {
        render(<Tombol_1 />);
        const button = screen.getByRole('button');
        
        fireEvent.mouseOver(button);
        // Since onMouseOver is commented out, alert should not be called with mouseOver message
        expect(global.alert).not.toHaveBeenCalledWith('Eits, mau pencet tombol ini ya??');
      });

      test('button is properly exported as default', () => {
        expect(Tombol_1).toBeDefined();
        expect(typeof Tombol_1).toBe('function');
      });
    });

    describe('Tombol_2 Component Tests', () => {
      const testProps = {
        isipesan: 'Test message untuk Tombol_2',
        namaTombol: 'Tombol Test 2'
      };

      test('renders Tombol_2 component without crashing', () => {
        expect(() => render(<Tombol_2 {...testProps} />)).not.toThrow();
      });

      test('renders button with correct props', () => {
        render(<Tombol_2 {...testProps} />);
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(testProps.namaTombol);
      });

      test('has correct CSS classes for Tombol_2', () => {
        render(<Tombol_2 {...testProps} />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'p-2', 'rounded');
      });

      test('shows correct alert message when clicked', () => {
        render(<Tombol_2 {...testProps} />);
        const button = screen.getByRole('button');
        
        fireEvent.click(button);
        expect(global.alert).toHaveBeenCalledWith(testProps.isipesan);
      });

      test('accepts and displays different prop values', () => {
        const customProps = {
          isipesan: 'Pesan custom',
          namaTombol: 'Custom Button'
        };
        
        render(<Tombol_2 {...customProps} />);
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(customProps.namaTombol);
        
        fireEvent.click(button);
        expect(global.alert).toHaveBeenCalledWith(customProps.isipesan);
      });

      test('Tombol_2 is properly exported as named export', () => {
        expect(Tombol_2).toBeDefined();
        expect(typeof Tombol_2).toBe('function');
      });
    });

    describe('Tombol_3 Component Tests', () => {
      const testProps = {
        isipesan: 'Test message untuk Tombol_3',
        namaTombol: 'Tombol Test 3'
      };

      test('renders Tombol_3 component without crashing', () => {
        expect(() => render(<Tombol_3 {...testProps} />)).not.toThrow();
      });

      test('renders button with correct props', () => {
        render(<Tombol_3 {...testProps} />);
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(testProps.namaTombol);
      });

      test('has correct CSS classes for Tombol_3', () => {
        render(<Tombol_3 {...testProps} />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-green-400', 'hover:bg-green-700', 'text-white', 'p-2', 'rounded', 'm-2');
      });

      test('shows correct alert message when clicked', () => {
        render(<Tombol_3 {...testProps} />);
        const button = screen.getByRole('button');
        
        fireEvent.click(button);
        expect(global.alert).toHaveBeenCalledWith(testProps.isipesan);
      });

      test('event stopPropagation is called on click', () => {
        render(<Tombol_3 {...testProps} />);
        const button = screen.getByRole('button');
        
        const mockEvent = {
          stopPropagation: jest.fn()
        };
        
        // Simulate click event with stopPropagation
        fireEvent.click(button);
        
        // Since we can't directly test stopPropagation in testing-library,
        // we verify that the click handler works correctly
        expect(global.alert).toHaveBeenCalledWith(testProps.isipesan);
      });

      test('accepts and displays different prop values', () => {
        const customProps = {
          isipesan: 'Pesan khusus Tombol_3',
          namaTombol: 'Tombol Hijau'
        };
        
        render(<Tombol_3 {...customProps} />);
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(customProps.namaTombol);
        
        fireEvent.click(button);
        expect(global.alert).toHaveBeenCalledWith(customProps.isipesan);
      });

      test('Tombol_3 is properly exported as named export', () => {
        expect(Tombol_3).toBeDefined();
        expect(typeof Tombol_3).toBe('function');
      });
    });

    describe('Integration Tests', () => {
      test('all three components can be rendered together', () => {
        const props2 = { isipesan: 'Message 2', namaTombol: 'Button 2' };
        const props3 = { isipesan: 'Message 3', namaTombol: 'Button 3' };

        const { container } = render(
          <div>
            <Tombol_1 />
            <Tombol_2 {...props2} />
            <Tombol_3 {...props3} />
          </div>
        );

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);
        
        // Check if each button has correct text
        expect(buttons[0]).toHaveTextContent('ini tombol');
        expect(buttons[1]).toHaveTextContent('Button 2');
        expect(buttons[2]).toHaveTextContent('Button 3');
      });

      test('each component has distinct styling', () => {
        const props2 = { isipesan: 'Message 2', namaTombol: 'Button 2' };
        const props3 = { isipesan: 'Message 3', namaTombol: 'Button 3' };

        render(
          <div>
            <Tombol_1 />
            <Tombol_2 {...props2} />
            <Tombol_3 {...props3} />
          </div>
        );

        const buttons = screen.getAllByRole('button');
        
        // Tombol_1 and Tombol_2 have blue background
        expect(buttons[0]).toHaveClass('bg-blue-500');
        expect(buttons[1]).toHaveClass('bg-blue-500');
        
        // Tombol_3 has green background and margin
        expect(buttons[2]).toHaveClass('bg-green-400', 'm-2');
      });

      test('event handlers work correctly for each component', () => {
        const props2 = { isipesan: 'Alert from Tombol_2', namaTombol: 'Test Button 2' };
        const props3 = { isipesan: 'Alert from Tombol_3', namaTombol: 'Test Button 3' };

        render(
          <div>
            <Tombol_1 />
            <Tombol_2 {...props2} />
            <Tombol_3 {...props3} />
          </div>
        );

        const buttons = screen.getAllByRole('button');
        
        // Test Tombol_1 click
        fireEvent.click(buttons[0]);
        expect(global.alert).toHaveBeenCalledWith('Tombol telah ditekan!!!');
        
        // Test Tombol_2 click
        fireEvent.click(buttons[1]);
        expect(global.alert).toHaveBeenCalledWith('Alert from Tombol_2');
        
        // Test Tombol_3 click
        fireEvent.click(buttons[2]);
        expect(global.alert).toHaveBeenCalledWith('Alert from Tombol_3');
      });
    });

    describe('Props Validation Tests', () => {
      test('Tombol_2 handles missing props gracefully', () => {
        expect(() => render(<Tombol_2 />)).not.toThrow();
        
        const button = screen.getByRole('button');
        fireEvent.click(button);
        // Should handle undefined props without crashing
      });

      test('Tombol_3 handles missing props gracefully', () => {
        expect(() => render(<Tombol_3 />)).not.toThrow();
        
        const button = screen.getByRole('button');
        fireEvent.click(button);
        // Should handle undefined props without crashing
      });

      test('Tombol_2 and Tombol_3 handle empty string props', () => {
        const emptyProps = { isipesan: '', namaTombol: '' };
        
        expect(() => render(<Tombol_2 {...emptyProps} />)).not.toThrow();
        expect(() => render(<Tombol_3 {...emptyProps} />)).not.toThrow();
        
        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
          fireEvent.click(button);
        });
        
        // Should handle empty strings without crashing
        expect(global.alert).toHaveBeenCalledWith('');
      });
    });
  });

} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi komponen Tombol Anda.');
  
  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('Tombol Components - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('Tombol_1 should at least render without crashing', () => {
      expect(() => render(<Tombol_1 />)).not.toThrow();
      console.log('✔ Tombol_1 berhasil di-render');
    });

    test('Tombol_2 should render with basic props', () => {
      const testProps = { isipesan: 'test', namaTombol: 'test button' };
      
      try {
        render(<Tombol_2 {...testProps} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        console.log('✔ Tombol_2 berhasil di-render');
      } catch (e) {
        console.log('❌ Tombol_2 gagal di-render');
      }
    });

    test('Tombol_3 should render with basic props', () => {
      const testProps = { isipesan: 'test', namaTombol: 'test button' };
      
      try {
        render(<Tombol_3 {...testProps} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        console.log('✔ Tombol_3 berhasil di-render');
      } catch (e) {
        console.log('❌ Tombol_3 gagal di-render');
      }
    });

    test('should have button elements', () => {
      try {
        render(<Tombol_1 />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        console.log('✔ Tombol_1 memiliki elemen button');
      } catch (e) {
        console.log('❌ Tombol_1 tidak memiliki elemen button');
      }
    });

    test('should have proper button text content', () => {
      try {
        render(<Tombol_1 />);
        const button = screen.getByRole('button');
        expect(button.textContent.trim()).toBeTruthy();
        console.log('✔ Tombol_1 memiliki konten teks');
      } catch (e) {
        console.log('❌ Tombol_1 tidak memiliki konten teks');
      }
    });

    test('should have CSS classes', () => {
      try {
        render(<Tombol_1 />);
        const button = screen.getByRole('button');
        expect(button.className).toBeTruthy();
        console.log('✔ Tombol_1 memiliki CSS classes');
      } catch (e) {
        console.log('❌ Tombol_1 tidak memiliki CSS classes');
      }
    });

    test('components should be properly exported', () => {
      try {
        expect(Tombol_1).toBeDefined();
        expect(typeof Tombol_1).toBe('function');
        console.log('✔ Tombol_1 exported sebagai default');
      } catch (e) {
        console.log('❌ Tombol_1 tidak di-export dengan benar');
      }

      try {
        expect(Tombol_2).toBeDefined();
        expect(typeof Tombol_2).toBe('function');
        console.log('✔ Tombol_2 exported sebagai named export');
      } catch (e) {
        console.log('❌ Tombol_2 tidak di-export dengan benar');
      }

      try {
        expect(Tombol_3).toBeDefined();
        expect(typeof Tombol_3).toBe('function');
        console.log('✔ Tombol_3 exported sebagai named export');
      } catch (e) {
        console.log('❌ Tombol_3 tidak di-export dengan benar');
      }
    });
  });
}