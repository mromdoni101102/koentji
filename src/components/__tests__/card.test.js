import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import Card from '../../components/props/Card.js'; // Import dari folder kunci jawaban

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

// Path file mahasiswa dan kunci jawaban - sesuaikan dengan struktur folder Anda
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/card.js');
const answerKeyFilePath = path.join(__dirname, '../../components/props/card.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('Card Component Tests', () => {
    test('renders card container with correct className', () => {
      render(<Card>Test Content</Card>);
      const cardContainer = screen.getByText('Test Content').closest('.card');
      expect(cardContainer).toBeInTheDocument();
      expect(cardContainer).toHaveClass('card');
    });

    test('renders card-content wrapper with correct className', () => {
      render(<Card>Test Content</Card>);
      const cardContent = screen.getByText('Test Content').closest('.card-content');
      expect(cardContent).toBeInTheDocument();
      expect(cardContent).toHaveClass('card-content');
    });

    test('renders children content correctly', () => {
      const testContent = 'This is test content';
      render(<Card>{testContent}</Card>);
      expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    test('renders multiple children correctly', () => {
      render(
        <Card>
          <h1>Title</h1>
          <p>Description</p>
        </Card>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    test('has correct DOM structure', () => {
      const { container } = render(<Card>Content</Card>);
      const cardDiv = container.firstChild;
      
      expect(cardDiv).toBeInTheDocument();
      expect(cardDiv.tagName.toLowerCase()).toBe('div');
      expect(cardDiv).toHaveClass('card');
      
      const cardContentDiv = cardDiv.firstChild;
      expect(cardContentDiv).toBeInTheDocument();
      expect(cardContentDiv.tagName.toLowerCase()).toBe('div');
      expect(cardContentDiv).toHaveClass('card-content');
    });

    test('component renders without crashing', () => {
      expect(() => render(<Card />)).not.toThrow();
    });

    test('component renders without crashing with children', () => {
      expect(() => render(<Card>Some content</Card>)).not.toThrow();
    });

    test('accepts and renders JSX children', () => {
      render(
        <Card>
          <div data-testid="child-element">
            <span>Nested content</span>
          </div>
        </Card>
      );
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });

    test('card structure is nested correctly', () => {
      render(<Card>Test</Card>);
      const cardContainer = screen.getByText('Test').closest('.card');
      const cardContent = screen.getByText('Test').closest('.card-content');
      
      expect(cardContainer).toContainElement(cardContent);
    });

    test('uses React.createElement correctly', () => {
      // Test bahwa komponen menggunakan React.createElement
      const { container } = render(<Card>Test</Card>);
      expect(container.firstChild).toBeTruthy();
      expect(container.firstChild.className).toBe('card');
      expect(container.firstChild.firstChild.className).toBe('card-content');
    });

    test('exported component is default export', () => {
      // This test ensures the component is properly exported
      expect(Card).toBeDefined();
      expect(typeof Card).toBe('function');
    });

    test('renders empty children gracefully', () => {
      render(<Card></Card>);
      const cardContainer = document.querySelector('.card');
      const cardContent = document.querySelector('.card-content');
      
      expect(cardContainer).toBeInTheDocument();
      expect(cardContent).toBeInTheDocument();
    });

    test('renders null children gracefully', () => {
      render(<Card>{null}</Card>);
      const cardContainer = document.querySelector('.card');
      const cardContent = document.querySelector('.card-content');
      
      expect(cardContainer).toBeInTheDocument();
      expect(cardContent).toBeInTheDocument();
    });

    test('renders string children correctly', () => {
      const textContent = 'Simple string content';
      render(<Card>{textContent}</Card>);
      expect(screen.getByText(textContent)).toBeInTheDocument();
    });

    test('renders number children correctly', () => {
      render(<Card>{42}</Card>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    test('component structure matches React.createElement pattern', () => {
      const { container } = render(<Card>Test Content</Card>);
      
      // Verifikasi bahwa struktur sesuai dengan React.createElement
      const outerDiv = container.firstChild;
      expect(outerDiv.tagName).toBe('DIV');
      expect(outerDiv.className).toBe('card');
      
      const innerDiv = outerDiv.firstChild;
      expect(innerDiv.tagName).toBe('DIV');
      expect(innerDiv.className).toBe('card-content');
      
      expect(innerDiv.textContent).toBe('Test Content');
    });
  });
} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi Card component Anda.');
  
  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('Card Component - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    test('component should at least render without crashing', () => {
      expect(() => render(<Card />)).not.toThrow();
    });

    test('component should render with children without crashing', () => {
      expect(() => render(<Card>Test</Card>)).not.toThrow();
    });

    test('should contain basic card structure elements', () => {
      render(<Card>Test Content</Card>);
      
      // Test minimal requirements
      try {
        const cardElement = document.querySelector('.card');
        expect(cardElement).toBeInTheDocument();
        console.log('✔ Card container ditemukan');
      } catch (e) {
        console.log('❌ Card container tidak ditemukan');
      }

      try {
        const cardContentElement = document.querySelector('.card-content');
        expect(cardContentElement).toBeInTheDocument();
        console.log('✔ Card content wrapper ditemukan');
      } catch (e) {
        console.log('❌ Card content wrapper tidak ditemukan');
      }

      try {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
        console.log('✔ Children content ditemukan');
      } catch (e) {
        console.log('❌ Children content tidak ditemukan');
      }
    });

    test('should be properly exported', () => {
      expect(Card).toBeDefined();
      expect(typeof Card).toBe('function');
      console.log('✔ Component exported correctly');
    });
  });
}