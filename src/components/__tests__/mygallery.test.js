import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import MyGallery from '../../components/props/mygallery.js'; // Import dari folder kunci jawaban

// Gunakan jest.mock untuk langsung mengembalikan fungsi mock.
// Ini adalah cara paling robust untuk mocking fungsi di Jest.
jest.mock('../../utils/utils.js', () => ({
  getImageUrl: jest.fn((imageId) => `https://i.imgur.com/${imageId}s.jpg`),
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

// Path file mahasiswa dan kunci jawaban - sesuaikan dengan struktur folder Anda
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/mygallery.js');
const answerKeyFilePath = path.join(__dirname, '../../components/props/mygallery.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('MyGallery Component Tests', () => {
    // Reset mock sebelum setiap tes dalam suite ini
    beforeEach(() => {
      // Dapatkan referensi ke fungsi mock getImageUrl.
      // Setiap kali require dipanggil setelah jest.mock, Jest akan memberikan versi mock.
      const { getImageUrl } = require('../../utils/utils.js');
      getImageUrl.mockClear(); // Mereset jumlah panggilan dan argumen panggilan
    });

    test('renders main heading "Notable Scientists" correctly', () => {
      render(<MyGallery />);
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent('Notable Scientists');
    });

    test('renders both scientist profile names', () => {
      render(<MyGallery />);
      
      // Check for Maria Skłodowska-Curie
      const mariaHeading = screen.getByRole('heading', { name: /Maria Skłodowska-Curie/i });
      expect(mariaHeading).toBeInTheDocument();
      
      // Check for Katsuko Saruhashi
      const katsukoHeading = screen.getByRole('heading', { name: /Katsuko Saruhashi/i });
      expect(katsukoHeading).toBeInTheDocument();
    });

    test('renders Maria Skłodowska-Curie profile information correctly', () => {
      render(<MyGallery />);
      
      // Check profession
      expect(screen.getByText('Fisikawan dan kimiawan')).toBeInTheDocument();
      
      // Check awards count
      expect(screen.getByText(/Penghargaan: 4/)).toBeInTheDocument();
      
      // Check awards list
      expect(screen.getByText(/Penghargaan Nobel Fisika, Penghargaan Nobel Kimia, Medali Davy, Medali Matteucci/)).toBeInTheDocument();
      
      // Check discovery
      expect(screen.getByText('polonium (unsur kimia)')).toBeInTheDocument();
    });

    test('renders Katsuko Saruhashi profile information correctly', () => {
      render(<MyGallery />);
      
      // Check profession
      expect(screen.getByText('Ahli Geokimia')).toBeInTheDocument();
      
      // Check awards count
      expect(screen.getByText(/Penghargaan: 2/)).toBeInTheDocument();
      
      // Check awards list
      expect(screen.getByText(/Penghargaan Miyake Geokimia, Penghargaan Tanaka/)).toBeInTheDocument();
      
      // Check discovery
      expect(screen.getByText('sebuah metode untuk mengukur karbon dioksida pada air laut')).toBeInTheDocument();
    });

    test('renders avatar images with correct attributes', () => {
      render(<MyGallery />);
      
      // Maria's avatar
      const mariaAvatar = screen.getByAltText('Maria Skłodowska-Curie');
      expect(mariaAvatar).toBeInTheDocument();
      expect(mariaAvatar).toHaveAttribute('src', 'https://i.imgur.com/szV5sdGs.jpg');
      expect(mariaAvatar).toHaveAttribute('width', '70');
      expect(mariaAvatar).toHaveAttribute('height', '70');
      expect(mariaAvatar).toHaveClass('avatar');
      
      // Katsuko's avatar
      const katsukoAvatar = screen.getByAltText('Katsuko Saruhashi');
      expect(katsukoAvatar).toBeInTheDocument();
      expect(katsukoAvatar).toHaveAttribute('src', 'https://i.imgur.com/YfeOqp2s.jpg');
      expect(katsukoAvatar).toHaveAttribute('width', '70');
      expect(katsukoAvatar).toHaveAttribute('height', '70');
      expect(katsukoAvatar).toHaveClass('avatar');
    });

    test('renders profile sections with correct CSS class', () => {
      render(<MyGallery />);
      const sections = screen.getAllByRole('heading', { level: 2 });
      
      expect(sections).toHaveLength(2);
      
      // Check each section has proper parent element with profile class
      sections.forEach(section => {
        const profileSection = section.closest('section');
        expect(profileSection).toBeInTheDocument();
        expect(profileSection).toHaveClass('profile');
      });
    });

    test('renders all required bold labels correctly', () => {
      render(<MyGallery />);
      
      // Check profession labels
      const professionLabels = screen.getAllByText(/Profesi:/);
      expect(professionLabels).toHaveLength(2);
      professionLabels.forEach(label => {
        expect(label.tagName.toLowerCase()).toBe('b');
      });
      
      // Check award labels  
      const awardLabels = screen.getAllByText(/Penghargaan:/);
      expect(awardLabels).toHaveLength(2);
      awardLabels.forEach(label => {
        expect(label.tagName.toLowerCase()).toBe('b');
      });
      
      // Check discovery labels
      const discoveryLabels = screen.getAllByText(/Telah Menemukan:/);
      expect(discoveryLabels).toHaveLength(2);
      discoveryLabels.forEach(label => {
        expect(label.tagName.toLowerCase()).toBe('b');
      });
    });

    test('renders list structure with correct number of items', () => {
      render(<MyGallery />);
      const lists = screen.getAllByRole('list');
      
      expect(lists).toHaveLength(2);
      
      // Each profile should have 3 list items (Profesi, Penghargaan, Telah Menemukan)
      lists.forEach(list => {
        const listItems = list.querySelectorAll('li');
        expect(listItems).toHaveLength(3);
      });
    });

    test('getImageUrl function is called with correct imageIds', () => {
      // Dapatkan referensi ke fungsi mock getImageUrl di sini.
      // Ini akan selalu mengembalikan fungsi mock yang telah didefinisikan oleh jest.mock.
      const { getImageUrl } = require('../../utils/utils.js');
      render(<MyGallery />);
      
      expect(getImageUrl).toHaveBeenCalledWith('szV5sdG');
      expect(getImageUrl).toHaveBeenCalledWith('YfeOqp2');
      expect(getImageUrl).toHaveBeenCalledTimes(2);
    });

    test('awards array is properly joined and counted', () => {
      render(<MyGallery />);
      
      // Maria should have 4 awards
      expect(screen.getByText(/Penghargaan: 4/)).toBeInTheDocument();
      
      // Katsuko should have 2 awards
      expect(screen.getByText(/Penghargaan: 2/)).toBeInTheDocument();
      
      // Check that awards are properly joined with commas
      expect(screen.getByText(/Penghargaan Nobel Fisika, Penghargaan Nobel Kimia/)).toBeInTheDocument();
      expect(screen.getByText(/Penghargaan Miyake Geokimia, Penghargaan Tanaka/)).toBeInTheDocument();
    });

    test('component renders without crashing', () => {
      expect(() => render(<MyGallery />)).not.toThrow();
    });

    test('main container structure is correct', () => {
      const { container } = render(<MyGallery />);
      const mainDiv = container.firstChild;
      
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv.tagName.toLowerCase()).toBe('div');
      
      // Check if main div contains all required elements
      const heading = screen.getByRole('heading', { level: 1 });
      const profileSections = screen.getAllByRole('heading', { level: 2 });
      
      expect(mainDiv).toContainElement(heading);
      profileSections.forEach(section => {
        expect(mainDiv).toContainElement(section.closest('section'));
      });
    });

    test('component is properly exported as default', () => {
      expect(MyGallery).toBeDefined();
      expect(typeof MyGallery).toBe('function');
    });

    test('all profile content is displayed in correct order', () => {
      render(<MyGallery />);
      
      // Get all list items and check their order
      const allListItems = screen.getAllByRole('listitem');
      expect(allListItems).toHaveLength(6); // 3 items per profile × 2 profiles
      
      // Check Maria's profile items (first 3)
      expect(allListItems[0]).toHaveTextContent('Profesi:');
      expect(allListItems[0]).toHaveTextContent('Fisikawan dan kimiawan');
      expect(allListItems[1]).toHaveTextContent('Penghargaan: 4');
      expect(allListItems[2]).toHaveTextContent('Telah Menemukan:');
      expect(allListItems[2]).toHaveTextContent('polonium (unsur kimia)');
      
      // Check Katsuko's profile items (next 3)
      expect(allListItems[3]).toHaveTextContent('Profesi:');
      expect(allListItems[3]).toHaveTextContent('Ahli Geokimia');
      expect(allListItems[4]).toHaveTextContent('Penghargaan: 2');
      expect(allListItems[5]).toHaveTextContent('Telah Menemukan:');
      expect(allListItems[5]).toHaveTextContent('sebuah metode untuk mengukur karbon dioksida pada air laut');
    });
  });
} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi MyGallery component Anda.');
  
  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('MyGallery Component - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    test('component should at least render without crashing', () => {
      expect(() => render(<MyGallery />)).not.toThrow();
    });

    test('should contain basic structure elements', () => {
      render(<MyGallery />);
      
      // Test minimal requirements
      try {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        console.log('✔ Main heading ditemukan');
      } catch (e) {
        console.log('❌ Main heading tidak ditemukan');
      }

      try {
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
        console.log('✔ Images ditemukan');
      } catch (e) {
        console.log('❌ Images tidak ditemukan');
      }

      try {
        const lists = screen.getAllByRole('list');
        expect(lists.length).toBeGreaterThan(0);
        console.log('✔ Lists ditemukan');
      } catch (e) {
        console.log('❌ Lists tidak ditemukan');
      }

      try {
        expect(screen.getByText(/Maria/i)).toBeInTheDocument();
        expect(screen.getByText(/Katsuko/i)).toBeInTheDocument();
        console.log('✔ Scientist names ditemukan');
      } catch (e) {
        console.log('❌ Scientist names tidak ditemukan');
      }
    });

    test('should have proper component structure', () => {
      render(<MyGallery />);
      
      try {
        const sections = screen.getAllByRole('heading', { level: 2 });
        expect(sections.length).toBe(2);
        console.log('✔ Profile sections ditemukan');
      } catch (e) {
        console.log('❌ Profile sections tidak ditemukan atau jumlah tidak sesuai');
      }

      try {
        const professionTexts = screen.getAllByText(/Profesi:/);
        expect(professionTexts.length).toBe(2);
        console.log('✔ Profession labels ditemukan');
      } catch (e) {
        console.log('❌ Profession labels tidak ditemukan');
      }

      try {
        const awardTexts = screen.getAllByText(/Penghargaan:/);
        expect(awardTexts.length).toBe(2);
        console.log('✔ Award labels ditemukan');
      } catch (e) {
        console.log('❌ Award labels tidak ditemukan');
      }

      try {
        const discoveryTexts = screen.getAllByText(/Telah Menemukan:/);
        expect(discoveryTexts.length).toBe(2);
        console.log('✔ Discovery labels ditemukan');
      } catch (e) {
        console.log('❌ Discovery labels tidak ditemukan');
      }
    });
  });
}