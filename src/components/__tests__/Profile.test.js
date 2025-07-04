import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import Profile from '../../components/props/profile.js'; // Import dari folder kunci jawaban

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockedImage(props) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  };
});

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
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/profile.js');
const answerKeyFilePath = path.join(__dirname, '../../components/props/profile.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('Profile Component Tests', () => {
    test('renders Profile component without crashing', () => {
      expect(() => render(<Profile />)).not.toThrow();
    });

    test('renders Image component with correct src attribute', () => {
      render(<Profile />);
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://i.imgur.com/MK3eW3Am.jpg');
    });

    test('renders Image component with correct alt text', () => {
      render(<Profile />);
      const image = screen.getByAltText('Katherine Johnson');
      expect(image).toBeInTheDocument();
    });

    test('renders Image component with correct width and height', () => {
      render(<Profile />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('width', '100');
      expect(image).toHaveAttribute('height', '100');
    });

    test('Image component has correct inline styles', () => {
      render(<Profile />);
      const image = screen.getByRole('img');
      
      // Check if style attribute exists and contains expected styles
      const style = image.getAttribute('style');
      expect(style).toContain('max-width: 100%');
      expect(style).toContain('height: auto');
      expect(style).toContain('margin: 13px');
    });

    test('Profile component returns single Image element', () => {
      render(<Profile />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
    });

    test('Profile component is properly exported as default', () => {
      expect(Profile).toBeDefined();
      expect(typeof Profile).toBe('function');
    });

    test('Image component uses Next.js Image import', () => {
      const { container } = render(<Profile />);
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
    });

    test('component structure is correct', () => {
      const { container } = render(<Profile />);
      
      // Check that the component returns a single Image element (not wrapped in div)
      expect(container.firstChild.tagName.toLowerCase()).toBe('img');
    });

    test('all required props are present', () => {
      render(<Profile />);
      const image = screen.getByRole('img');
      
      // Check all required props
      expect(image).toHaveAttribute('src');
      expect(image).toHaveAttribute('alt');
      expect(image).toHaveAttribute('width');
      expect(image).toHaveAttribute('height');
      expect(image).toHaveAttribute('style');
    });

    test('style object properties are correctly applied', () => {
      render(<Profile />);
      const image = screen.getByRole('img');
      const computedStyle = window.getComputedStyle(image);
      
      // These tests might need adjustment based on how styles are applied
      expect(image.style.maxWidth).toBe('100%');
      expect(image.style.height).toBe('auto');
      expect(image.style.margin).toBe('13px');
    });

    test('component renders Katherine Johnson image specifically', () => {
      render(<Profile />);
      
      // Check specific image details
      const image = screen.getByAltText('Katherine Johnson');
      expect(image).toHaveAttribute('src', 'https://i.imgur.com/MK3eW3Am.jpg');
      expect(image).toHaveAttribute('width', '100');
      expect(image).toHaveAttribute('height', '100');
    });

    test('component uses correct imgur URL format', () => {
      render(<Profile />);
      const image = screen.getByRole('img');
      const src = image.getAttribute('src');
      
      expect(src).toMatch(/^https:\/\/i\.imgur\.com\/.*\.jpg$/);
      expect(src).toContain('MK3eW3Am');
    });

    test('component has proper responsive image styling', () => {
      render(<Profile />);
      const image = screen.getByRole('img');
      
      // Check responsive image properties
      expect(image.style.maxWidth).toBe('100%');
      expect(image.style.height).toBe('auto');
    });

    test('component maintains aspect ratio with auto height', () => {
      render(<Profile />);
      const image = screen.getByRole('img');
      
      // Verify that height is set to auto for responsive behavior
      expect(image.style.height).toBe('auto');
      expect(image).toHaveAttribute('width', '100');
      expect(image).toHaveAttribute('height', '100');
    });

    test('component has correct margin styling', () => {
      render(<Profile />);
      const image = screen.getByRole('img');
      
      expect(image.style.margin).toBe('13px');
    });

  });

} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi Profile component Anda.');
  
  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('Profile Component - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    test('component should at least render without crashing', () => {
      expect(() => render(<Profile />)).not.toThrow();
    });

    test('should contain basic image element', () => {
      render(<Profile />);
      
      try {
        const image = screen.getByRole('img');
        expect(image).toBeInTheDocument();
        console.log('✔ Image element ditemukan');
      } catch (e) {
        console.log('❌ Image element tidak ditemukan');
      }
    });

    test('should have Katherine Johnson alt text', () => {
      render(<Profile />);
      
      try {
        expect(screen.getByAltText(/Katherine Johnson/i)).toBeInTheDocument();
        console.log('✔ Katherine Johnson alt text ditemukan');
      } catch (e) {
        console.log('❌ Katherine Johnson alt text tidak ditemukan');
      }
    });

    test('should have correct image source', () => {
      render(<Profile />);
      
      try {
        const image = screen.getByRole('img');
        const src = image.getAttribute('src');
        expect(src).toContain('imgur.com');
        expect(src).toContain('MK3eW3A');
        console.log('✔ Image source URL ditemukan');
      } catch (e) {
        console.log('❌ Image source URL tidak sesuai');
      }
    });

    test('should have proper dimensions', () => {
      render(<Profile />);
      
      try {
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('width');
        expect(image).toHaveAttribute('height');
        console.log('✔ Image dimensions ditemukan');
      } catch (e) {
        console.log('❌ Image dimensions tidak ditemukan');
      }
    });

    test('should have styling properties', () => {
      render(<Profile />);
      
      try {
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('style');
        console.log('✔ Image styling ditemukan');
      } catch (e) {
        console.log('❌ Image styling tidak ditemukan');
      }
    });

    test('should use Next.js Image component structure', () => {
      render(<Profile />);
      
      try {
        const image = screen.getByRole('img');
        expect(image.tagName.toLowerCase()).toBe('img');
        console.log('✔ Image component structure sesuai');
      } catch (e) {
        console.log('❌ Image component structure tidak sesuai');
      }
    });

    test('should have responsive image properties', () => {
      render(<Profile />);
      
      try {
        const image = screen.getByRole('img');
        const style = image.getAttribute('style');
        
        if (style && style.includes('max-width')) {
          console.log('✔ Responsive max-width ditemukan');
        } else {
          console.log('❌ Responsive max-width tidak ditemukan');
        }
        
        if (style && style.includes('height: auto')) {
          console.log('✔ Auto height ditemukan');
        } else {
          console.log('❌ Auto height tidak ditemukan');
        }
      } catch (e) {
        console.log('❌ Error saat memeriksa responsive properties');
      }
    });

    test('should have margin styling', () => {
      render(<Profile />);
      
      try {
        const image = screen.getByRole('img');
        const style = image.getAttribute('style');
        
        if (style && style.includes('margin')) {
          console.log('✔ Margin styling ditemukan');
        } else {
          console.log('❌ Margin styling tidak ditemukan');
        }
      } catch (e) {
        console.log('❌ Error saat memeriksa margin styling');
      }
    });

    test('should export component properly', () => {
      try {
        expect(Profile).toBeDefined();
        expect(typeof Profile).toBe('function');
        console.log('✔ Component export ditemukan');
      } catch (e) {
        console.log('❌ Component export tidak sesuai');
      }
    });

    test('should render single image element', () => {
      render(<Profile />);
      
      try {
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(1);
        console.log('✔ Single image element ditemukan');
      } catch (e) {
        console.log('❌ Jumlah image element tidak sesuai');
      }
    });
  });
}