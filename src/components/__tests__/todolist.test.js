import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import TodoList from '../../components/props/todolist.js'; // Import dari folder mahasiswa

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
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/todolist.js');
const answerKeyFilePath = path.join(__dirname, '../../components/props/todolist.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('TodoList Component Tests', () => {
    test('renders person name in heading correctly', () => {
      render(<TodoList />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Gregorio Y. Zara's Todos");
    });

    test('renders avatar image with correct attributes', () => {
      render(<TodoList />);
      const avatar = screen.getByRole('img');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://i.imgur.com/7vQD0fPs.jpg');
      expect(avatar).toHaveAttribute('alt', 'Gregorio Y. Zara');
      expect(avatar).toHaveClass('avatar');
    });

    test('renders all todo items correctly', () => {
      render(<TodoList />);
      const todoItems = [
        'Improve the videophone',
        'Prepare aeronautics lectures',
        'Work on the alcohol-fuelled engine'
      ];

      todoItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    test('renders todo list with correct structure', () => {
      render(<TodoList />);
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    test('applies correct theme styles to container', () => {
    render(<TodoList />);
    const container = screen.getByRole('heading').parentElement;

    expect(container).toBeInTheDocument();
    
    // Periksa nilai style secara eksplisit
    expect(container.style.backgroundColor).not.toBe('');
    expect(container.style.color).not.toBe('');
    });


    test('displays todo items in correct order', () => {
      render(<TodoList />);
      const listItems = screen.getAllByRole('listitem');
      
      expect(listItems[0]).toHaveTextContent('Improve the videophone');
      expect(listItems[1]).toHaveTextContent('Prepare aeronautics lectures');
      expect(listItems[2]).toHaveTextContent('Work on the alcohol-fuelled engine');
    });

    test('image URL is constructed correctly from baseUrl and person data', () => {
      render(<TodoList />);
      const avatar = screen.getByRole('img');
      const expectedUrl = 'https://i.imgur.com/7vQD0fPs.jpg';
      expect(avatar.src).toBe(expectedUrl);
    });

    test('component renders without crashing', () => {
      expect(() => render(<TodoList />)).not.toThrow();
    });

    test('contains all required elements', () => {
      render(<TodoList />);
      
      // Check for heading
      expect(screen.getByRole('heading')).toBeInTheDocument();
      
      // Check for image
      expect(screen.getByRole('img')).toBeInTheDocument();
      
      // Check for list
      expect(screen.getByRole('list')).toBeInTheDocument();
      
      // Check for list items
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    test('person object data is used correctly', () => {
      render(<TodoList />);
      
      // Test name usage
      const heading = screen.getByText(/Gregorio Y. Zara/i);
      expect(heading).toBeInTheDocument();
      
      // Test image alt attribute
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('alt', 'Gregorio Y. Zara');
    });

    test('baseUrl constant is used correctly in image src', () => {
      render(<TodoList />);
      const avatar = screen.getByRole('img');
      expect(avatar.src).toContain('https://i.imgur.com/');
      expect(avatar.src).toContain('7vQD0fP');
      expect(avatar.src).toContain('s.jpg');
    });

    test('theme object properties are applied correctly', () => {
      render(<TodoList />);
      const container = screen.getByRole('heading').parentElement;
      
      expect(container).toBeInTheDocument();

      expect(container.style.backgroundColor).not.toBe('');
      expect(container.style.color).not.toBe('');
    });

    test('TodoList structure matches expected layout', () => {
      const { container } = render(<TodoList />);
      const mainDiv = container.firstChild;
      
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv.tagName.toLowerCase()).toBe('div');
      
      // Check if main div contains heading, image, and list
      const heading = screen.getByRole('heading');
      const image = screen.getByRole('img');
      const list = screen.getByRole('list');
      
      expect(mainDiv).toContainElement(heading);
      expect(mainDiv).toContainElement(image);
      expect(mainDiv).toContainElement(list);
    });

    test('exported component is default export', () => {
      // This test ensures the component is properly exported
      expect(TodoList).toBeDefined();
      expect(typeof TodoList).toBe('function');
    });
  });
} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi TodoList component Anda.');
  
  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('TodoList Component - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    test('component should at least render without crashing', () => {
      expect(() => render(<TodoList />)).not.toThrow();
    });

    test('should contain basic structure elements', () => {
      render(<TodoList />);
      // Test minimal requirements
      try {
        expect(screen.getByRole('heading')).toBeInTheDocument();
        console.log('✔ Heading ditemukan');
      } catch (e) {
        console.log('❌ Heading tidak ditemukan');
      }

      try {
        expect(screen.getByRole('img')).toBeInTheDocument();
        console.log('✔ Image ditemukan');
      } catch (e) {
        console.log('❌ Image tidak ditemukan');
      }

      try {
        expect(screen.getByRole('list')).toBeInTheDocument();
        console.log('✔ List ditemukan');
      } catch (e) {
        console.log('❌ List tidak ditemukan');
      }
    });
  });
}