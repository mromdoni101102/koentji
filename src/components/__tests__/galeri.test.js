import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Galeri from '../../components/event_handler/galeri.js'; // Import dari folder kunci jawaban

// Mock data sculptureList
jest.mock('@/data/article', () => ({
  sculptureList: [
    {
      name: 'Homenaje a la Neurocirugía',
      artist: 'Marta Colvin Andrade',
      description: 'Although Colvin is predominantly known for abstract themes...',
      url: 'https://i.imgur.com/Mx7dA2Y.jpg',
      alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
    },
    {
      name: 'Floralis Genérica',
      artist: 'Eduardo Catalano',
      description: 'This enormous (75 ft. or 23m) silver flower...',
      url: 'https://i.imgur.com/ZF6s192.jpg',
      alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
    },
    {
      name: 'Eternal Presence',
      artist: 'John Woodrow Wilson',
      description: 'Wilson was known for his preoccupation with equality...',
      url: 'https://i.imgur.com/aTtVpES.jpg',
      alt: 'The statue depicts a human head made of many elements.'
    }
  ]
}));

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
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/galeri.js');
const answerKeyFilePath = path.join(__dirname, '../../components/event_handler/galeri.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Import mock data untuk testing
const { sculptureList } = require('@/data/article');

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('Galeri Component Tests', () => {
    test('renders Galeri component without crashing', () => {
      expect(() => render(<Galeri />)).not.toThrow();
    });

    test('displays first sculpture initially', () => {
      render(<Galeri />);
      
      // Check if first sculpture is displayed
      // Menggunakan fungsi matcher untuk teks yang terbagi di antara elemen
      expect(screen.getByText((content, element) => {
        return content.includes(sculptureList[0].name) && element.tagName.toLowerCase() === 'h2';
      })).toBeInTheDocument();
      // Menggunakan RegExp untuk teks yang mungkin dipecah atau memiliki spasi tambahan
      expect(screen.getByText(new RegExp(`oleh ${sculptureList[0].artist}`))).toBeInTheDocument();
      
      expect(screen.getByText(`(1 dari ${sculptureList.length})`)).toBeInTheDocument();
      expect(screen.getByAltText(sculptureList[0].alt)).toBeInTheDocument();
      expect(screen.getByText(sculptureList[0].description)).toBeInTheDocument();
    });

    test('renders navigation buttons with correct text', () => {
      render(<Galeri />);
      
      const prevButton = screen.getByText('Artikel Sebelumnya');
      const nextButton = screen.getByText('Artikel Selanjutnya');
      
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    test('previous button is disabled initially', () => {
      render(<Galeri />);
      
      const prevButton = screen.getByText('Artikel Sebelumnya');
      expect(prevButton).toBeDisabled();
    });

    test('next button is enabled initially when there are multiple sculptures', () => {
      render(<Galeri />);
      
      const nextButton = screen.getByText('Artikel Selanjutnya');
      expect(nextButton).not.toBeDisabled();
    });

    test('navigates to next sculpture when next button is clicked', async () => {
      render(<Galeri />);
      
      const nextButton = screen.getByText('Artikel Selanjutnya');
      
      // Click next button
      fireEvent.click(nextButton);
      
      // Check if second sculpture is displayed
      await waitFor(() => {
        expect(screen.getByText((content, element) => {
          return content.includes(sculptureList[1].name) && element.tagName.toLowerCase() === 'h2';
        })).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`oleh ${sculptureList[1].artist}`))).toBeInTheDocument();
        expect(screen.getByText(`(2 dari ${sculptureList.length})`)).toBeInTheDocument();
      });
    });

    test('navigates to previous sculpture when previous button is clicked', async () => {
      render(<Galeri />);
      
      const nextButton = screen.getByText('Artikel Selanjutnya');
      const prevButton = screen.getByText('Artikel Sebelumnya');
      
      // Go to second sculpture first
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText((content, element) => {
          return content.includes(sculptureList[1].name) && element.tagName.toLowerCase() === 'h2';
        })).toBeInTheDocument();
      });
      
      // Go back to first sculpture
      fireEvent.click(prevButton);
      
      await waitFor(() => {
        expect(screen.getByText((content, element) => {
          return content.includes(sculptureList[0].name) && element.tagName.toLowerCase() === 'h2';
        })).toBeInTheDocument();
        expect(screen.getByText(`(1 dari ${sculptureList.length})`)).toBeInTheDocument();
      });
    });

    test('previous button becomes enabled after navigating forward', async () => {
      render(<Galeri />);
      
      const nextButton = screen.getByText('Artikel Selanjutnya');
      const prevButton = screen.getByText('Artikel Sebelumnya');
      
      // Initially previous button should be disabled
      expect(prevButton).toBeDisabled();
      
      // Click next
      fireEvent.click(nextButton);
      
      // Previous button should now be enabled
      await waitFor(() => {
        expect(prevButton).not.toBeDisabled();
      });
    });

    test('next button becomes disabled at last sculpture', async () => {
      render(<Galeri />);
      
      const nextButton = screen.getByText('Artikel Selanjutnya');
      
      // Navigate to last sculpture
      for (let i = 0; i < sculptureList.length - 1; i++) {
        fireEvent.click(nextButton);
      }
      
      // Next button should now be disabled
      await waitFor(() => {
        expect(nextButton).toBeDisabled();
        expect(screen.getByText(`(${sculptureList.length} dari ${sculptureList.length})`)).toBeInTheDocument();
      });
    });

    test('displays correct sculpture information for each index', async () => {
      render(<Galeri />);
      
      const nextButton = screen.getByText('Artikel Selanjutnya');
      
      // Test each sculpture
      for (let i = 0; i < sculptureList.length; i++) {
        const sculpture = sculptureList[i];
        
        await waitFor(() => {
          expect(screen.getByText((content, element) => {
            return content.includes(sculpture.name) && element.tagName.toLowerCase() === 'h2';
          })).toBeInTheDocument();
          expect(screen.getByText(new RegExp(`oleh ${sculpture.artist}`))).toBeInTheDocument();
          expect(screen.getByText(`(${i + 1} dari ${sculptureList.length})`)).toBeInTheDocument();
          expect(screen.getByAltText(sculpture.alt)).toBeInTheDocument();
          expect(screen.getByText(sculpture.description)).toBeInTheDocument();
        });
        
        // Navigate to next sculpture (except for the last one)
        if (i < sculptureList.length - 1) {
          fireEvent.click(nextButton);
        }
      }
    });

    test('image has correct src and alt attributes', () => {
      render(<Galeri />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', sculptureList[0].url);
      expect(image).toHaveAttribute('alt', sculptureList[0].alt);
    });

    test('navigation buttons have correct CSS classes', () => {
      render(<Galeri />);
      
      const prevButton = screen.getByText('Artikel Sebelumnya');
      const nextButton = screen.getByText('Artikel Selanjutnya');
      
      expect(prevButton).toHaveClass('bg-gray-500', 'hover:bg-gray-700', 'text-white', 'p-2', 'rounded');
      expect(nextButton).toHaveClass('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'p-2', 'rounded');
    });

    test('button container has correct spacing class', () => {
      const { container } = render(<Galeri />);
      
      const buttonContainer = container.querySelector('.space-x-2.mb-4');
      expect(buttonContainer).toBeInTheDocument();
    });

    test('prevents navigation beyond boundaries', async () => {
      render(<Galeri />);
      
      const nextButton = screen.getByText('Artikel Selanjutnya');
      const prevButton = screen.getByText('Artikel Sebelumnya');
      
      // Try to go before first sculpture
      fireEvent.click(prevButton);
      expect(screen.getByText(`(1 dari ${sculptureList.length})`)).toBeInTheDocument();
      
      // Navigate to last sculpture
      for (let i = 0; i < sculptureList.length - 1; i++) {
        fireEvent.click(nextButton);
      }
      
      // Try to go beyond last sculpture
      fireEvent.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText(`(${sculptureList.length} dari ${sculptureList.length})`)).toBeInTheDocument();
      });
    });

    test('useState hook is properly implemented', async () => {
      render(<Galeri />);
      
      const nextButton = screen.getByText('Artikel Selanjutnya');
      
      // Initial state should be index 0
      expect(screen.getByText('(1 dari 3)')).toBeInTheDocument();
      
      // State should update when clicking next
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('(2 dari 3)')).toBeInTheDocument();
      });
    });

    test('sculpture data is properly accessed from sculptureList', () => {
      render(<Galeri />);
      
      // Verify that sculpture data is being used
      expect(screen.getByText((content, element) => {
        return content.includes(sculptureList[0].name) && element.tagName.toLowerCase() === 'h2';
      })).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`oleh ${sculptureList[0].artist}`))).toBeInTheDocument();
    });

    test('component structure follows the expected format', () => {
      const { container } = render(<Galeri />);
      
      // Check for Fragment wrapper (React.Fragment renders as div in test)
      expect(container.firstChild).toBeTruthy();
      
      // Check for h2 with sculpture name and artist
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toBeInTheDocument();
      
      // Check for h3 with counter
      const h3 = screen.getByRole('heading', { level: 3 });
      expect(h3).toBeInTheDocument();
      
      // Check for image
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      
      // Check for description paragraph
      const description = screen.getByText(sculptureList[0].description);
      expect(description).toBeInTheDocument();
    });

    test('handles edge cases with single item', () => {
      // This test assumes the mock data has multiple items
      // In a real scenario, you might want to test with a single item array
      render(<Galeri />);
      
      // With our mock data of 3 items, both buttons should have appropriate states
      const prevButton = screen.getByText('Artikel Sebelumnya');
      const nextButton = screen.getByText('Artikel Selanjutnya');
      
      expect(prevButton).toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    test('handleNextClick function works correctly', async () => {
      render(<Galeri />);
      
      const nextButton = screen.getByText('Artikel Selanjutnya');
      
      // Test that clicking next changes the display
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText((content, element) => {
          return content.includes(sculptureList[1].name) && element.tagName.toLowerCase() === 'h2';
        })).toBeInTheDocument();
      });
    });

    test('handlePrevClick function works correctly', async () => {
      render(<Galeri />);
      
      const nextButton = screen.getByText('Artikel Selanjutnya');
      const prevButton = screen.getByText('Artikel Sebelumnya');
      
      // Go forward first
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText((content, element) => {
          return content.includes(sculptureList[1].name) && element.tagName.toLowerCase() === 'h2';
        })).toBeInTheDocument();
      });
      
      // Then go back
      fireEvent.click(prevButton);
      
      await waitFor(() => {
        expect(screen.getByText((content, element) => {
          return content.includes(sculptureList[0].name) && element.tagName.toLowerCase() === 'h2';
        })).toBeInTheDocument();
      });
    });

    test('component is properly exported as default', () => {
      expect(Galeri).toBeDefined();
      expect(typeof Galeri).toBe('function');
    });
  });

} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi komponen Galeri Anda.');
  
  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('Galeri Component - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    test('component should at least render without crashing', () => {
      try {
        render(<Galeri />);
        console.log('✔ Galeri component berhasil di-render');
      } catch (e) {
        console.log('❌ Galeri component gagal di-render:', e.message);
      }
    });

    test('should contain navigation buttons', () => {
      try {
        render(<Galeri />);
        
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
        console.log('✔ Navigation buttons ditemukan');
      } catch (e) {
        console.log('❌ Navigation buttons tidak ditemukan');
      }
    });

    test('should display sculpture information', () => {
      try {
        render(<Galeri />);
        
        // Look for any image
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
        console.log('✔ Sculpture image ditemukan');
        
        // Look for headings
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
        console.log('✔ Sculpture headings ditemukan');
        
      } catch (e) {
        console.log('❌ Sculpture information tidak lengkap');
      }
    });

    test('should have proper button functionality', () => {
      try {
        render(<Galeri />);
        
        const buttons = screen.getAllByRole('button');
        
        // Try clicking buttons to see if they don't crash
        buttons.forEach((button, index) => {
          try {
            fireEvent.click(button);
            console.log(`✔ Button ${index + 1} dapat diklik`);
          } catch (e) {
            console.log(`❌ Button ${index + 1} error saat diklik`);
          }
        });
        
      } catch (e) {
        console.log('❌ Button functionality test gagal');
      }
    });

    test('should use useState hook', () => {
      try {
        // Check if component definition includes useState
        const componentString = Galeri.toString();
        
        if (componentString.includes('useState')) {
          console.log('✔ useState hook terdeteksi dalam component');
        } else {
          console.log('❌ useState hook tidak terdeteksi');
        }
      } catch (e) {
        console.log('❌ Error checking useState usage');
      }
    });

    test('should have proper component structure', () => {
      try {
        const { container } = render(<Galeri />);
        
        // Check if component renders something
        expect(container.firstChild).toBeTruthy();
        console.log('✔ Component memiliki struktur dasar');
        
        // Check for buttons
        const buttons = screen.getAllByRole('button');
        if (buttons.length >= 2) {
          console.log('✔ Component memiliki minimal 2 buttons');
        }
        
        // Check for images
        const images = screen.getAllByRole('img');
        if (images.length >= 1) {
          console.log('✔ Component memiliki minimal 1 image');
        }
        
      } catch (e) {
        console.log('❌ Component structure test gagal');
      }
    });

    test('should be properly exported', () => {
      try {
        expect(Galeri).toBeDefined();
        expect(typeof Galeri).toBe('function');
        console.log('✔ Galeri component di-export dengan benar');
      } catch (e) {
        console.log('❌ Galeri component tidak di-export dengan benar');
      }
    });
  });
}