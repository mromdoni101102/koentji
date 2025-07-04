import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import { Gallery } from '../props/gallery';

// Mock komponen Profile karena kita fokus test Gallery
jest.mock('../props/profile', () => {
  return function Profile() {
    return <div data-testid="profile-component">Profile Component</div>;
  };
});

const readFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8'); // Hapus path.resolve di sini
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
    differences.forEach((part, index) => {
      if (part.added || part.removed) {
        console.log(`Difference at line ${index + 1}: ${part.value}`);
      }
    });
    return false;
  }
  return true;
};

// Path file mahasiswa dan kunci jawaban - sesuaikan dengan struktur folder Anda
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/gallery.js');
const answerKeyFilePath = path.join(__dirname, '../../components/props/gallery.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('Gallery component', () => {
    test('renders correctly', () => {
      render(<Gallery />);
      const galleryContainer = document.querySelector('.columns-3');
      expect(galleryContainer).toBeInTheDocument();
      expect(galleryContainer).toHaveClass('columns-3');
    });

    test('renders with columns-3 class', () => {
      const { container } = render(<Gallery />);
      const galleryContainer = container.querySelector('.columns-3');
      expect(galleryContainer).toHaveClass('columns-3');
    });

    test('renders exactly 3 Profile components', () => {
      render(<Gallery />);
      const profileComponents = screen.getAllByTestId('profile-component');
      expect(profileComponents).toHaveLength(3);
    });

    test('each Profile component renders correctly', () => {
      render(<Gallery />);
      const profileComponents = screen.getAllByTestId('profile-component');
      
      profileComponents.forEach((profile) => {
        expect(profile).toBeInTheDocument();
        expect(profile).toHaveTextContent('Profile Component');
      });
    });

    test('Gallery structure is correct', () => {
      const { container } = render(<Gallery />);
      const galleryContainer = container.querySelector('.columns-3');
      const profiles = screen.getAllByTestId('profile-component');
      
      // Pastikan container memiliki 3 child Profile components
      expect(galleryContainer.children).toHaveLength(3);
      expect(profiles).toHaveLength(3);
    });

    test('component renders without crashing', () => {
      expect(() => render(<Gallery />)).not.toThrow();
    });

    test('Gallery container has proper structure', () => {
      const { container } = render(<Gallery />);
      const galleryDiv = container.firstChild;
      
      expect(galleryDiv).toBeInTheDocument();
      expect(galleryDiv.tagName.toLowerCase()).toBe('div');
      expect(galleryDiv).toHaveClass('columns-3');
    });

    test('all Profile components are children of Gallery container', () => {
      const { container } = render(<Gallery />);
      const galleryDiv = container.firstChild;
      const profileElements = screen.getAllByTestId('profile-component');
      
      profileElements.forEach((profile) => {
        expect(galleryDiv).toContainElement(profile);
      });
    });
  });
} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
}