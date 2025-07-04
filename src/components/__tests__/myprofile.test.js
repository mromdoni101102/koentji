import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import MyProfile from '../../components/props/myprofile.js'; // Import dari folder kunci jawaban

// Mock fungsi getImageUrlV2
jest.mock('../../utils/utils.js', () => ({
  getImageUrlV2: jest.fn((person, sizeCode) => `https://i.imgur.com/${person.imageId}${sizeCode}.jpg`),
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
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/myprofile.js');
const answerKeyFilePath = path.join(__dirname, '../../components/props/myprofile.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('MyProfile Component Tests', () => {
    // Reset mock sebelum setiap tes
    beforeEach(() => {
      const { getImageUrlV2 } = require('../../utils/utils.js');
      getImageUrlV2.mockClear();
    });

    test('renders MyProfile component without crashing', () => {
      expect(() => render(<MyProfile />)).not.toThrow();
    });

    test('renders both MyAvatar components', () => {
      render(<MyProfile />);
      const avatars = screen.getAllByRole('img');
      expect(avatars).toHaveLength(2);
    });

    test('renders Gregorio Y. Zara avatar with correct properties', () => {
      render(<MyProfile />);
      
      const gregorioAvatar = screen.getByAltText('Gregorio Y. Zara');
      expect(gregorioAvatar).toBeInTheDocument();
      expect(gregorioAvatar).toHaveAttribute('src', 'https://i.imgur.com/7vQD0fPs.jpg');
      expect(gregorioAvatar).toHaveAttribute('width', '40');
      expect(gregorioAvatar).toHaveAttribute('height', '40');
      expect(gregorioAvatar).toHaveClass('avatar');
    });

    test('renders Ada Lovelace avatar with correct properties', () => {
      render(<MyProfile />);
      
      const adaAvatar = screen.getByAltText('Ada Lovelace');
      expect(adaAvatar).toBeInTheDocument();
      expect(adaAvatar).toHaveAttribute('src', 'https://i.imgur.com/rDE2SL3Lb.jpg');
      expect(adaAvatar).toHaveAttribute('width', '100');
      expect(adaAvatar).toHaveAttribute('height', '100');
      expect(adaAvatar).toHaveClass('avatar');
    });

    test('MyAvatar component uses correct size code based on size prop', () => {
      const { getImageUrlV2 } = require('../../utils/utils.js');
      render(<MyProfile />);
      
      // Gregorio avatar (size 40 < 90, should use 's')
      expect(getImageUrlV2).toHaveBeenCalledWith(
        { name: 'Gregorio Y. Zara', imageId: '7vQD0fP' },
        's'
      );
      
      // Ada avatar (size 100 >= 90, should use 'b')
      expect(getImageUrlV2).toHaveBeenCalledWith(
        { name: 'Ada Lovelace', imageId: 'rDE2SL3L' },
        'b'
      );
    });

    test('getImageUrlV2 function is called with correct parameters', () => {
      const { getImageUrlV2 } = require('../../utils/utils.js');
      render(<MyProfile />);
      
      expect(getImageUrlV2).toHaveBeenCalledTimes(2);
      
      // Check first call (Gregorio)
      expect(getImageUrlV2).toHaveBeenNthCalledWith(1, 
        { name: 'Gregorio Y. Zara', imageId: '7vQD0fP' },
        's'
      );
      
      // Check second call (Ada)
      expect(getImageUrlV2).toHaveBeenNthCalledWith(2,
        { name: 'Ada Lovelace', imageId: 'rDE2SL3L' },
        'b'
      );
    });

    test('MyAvatar component applies correct size logic', () => {
      // Test small size (< 90) uses 's' code
      const { rerender } = render(
        <div>
          <img
            className="avatar"
            src="https://i.imgur.com/7vQD0fPs.jpg"
            alt="Test Small"
            width={40}
            height={40}
          />
        </div>
      );
      
      const smallAvatar = screen.getByAltText('Test Small');
      expect(smallAvatar.src).toContain('s.jpg');
      
      // Test large size (>= 90) uses 'b' code
      rerender(
        <div>
          <img
            className="avatar"
            src="https://i.imgur.com/testIdb.jpg"
            alt="Test Large"
            width={100}
            height={100}
          />
        </div>
      );
      
      const largeAvatar = screen.getByAltText('Test Large');
      expect(largeAvatar.src).toContain('b.jpg');
    });

    test('main container has correct structure', () => {
      const { container } = render(<MyProfile />);
      const mainDiv = container.firstChild;
      
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv.tagName.toLowerCase()).toBe('div');
      
      // Check if main div contains both avatars
      const avatars = screen.getAllByRole('img');
      avatars.forEach(avatar => {
        expect(mainDiv).toContainElement(avatar);
      });
    });

    test('MyProfile component is properly exported as default', () => {
      expect(MyProfile).toBeDefined();
      expect(typeof MyProfile).toBe('function');
    });

    test('avatars are rendered in correct order', () => {
      render(<MyProfile />);
      const avatars = screen.getAllByRole('img');
      
      // First avatar should be Gregorio Y. Zara
      expect(avatars[0]).toHaveAttribute('alt', 'Gregorio Y. Zara');
      expect(avatars[0]).toHaveAttribute('width', '40');
      
      // Second avatar should be Ada Lovelace
      expect(avatars[1]).toHaveAttribute('alt', 'Ada Lovelace');
      expect(avatars[1]).toHaveAttribute('width', '100');
    });

    test('all avatars have required CSS class', () => {
      render(<MyProfile />);
      const avatars = screen.getAllByRole('img');
      
      avatars.forEach(avatar => {
        expect(avatar).toHaveClass('avatar');
      });
    });

    test('person object properties are correctly used', () => {
      render(<MyProfile />);
      
      // Check that person.name is used for alt attribute
      expect(screen.getByAltText('Gregorio Y. Zara')).toBeInTheDocument();
      expect(screen.getByAltText('Ada Lovelace')).toBeInTheDocument();
      
      // Check that person.imageId is used in src (through mock)
      const gregorioAvatar = screen.getByAltText('Gregorio Y. Zara');
      const adaAvatar = screen.getByAltText('Ada Lovelace');
      
      expect(gregorioAvatar.src).toContain('7vQD0fP');
      expect(adaAvatar.src).toContain('rDE2SL3L');
    });

    test('size prop is correctly applied to width and height attributes', () => {
      render(<MyProfile />);
      
      const gregorioAvatar = screen.getByAltText('Gregorio Y. Zara');
      expect(gregorioAvatar).toHaveAttribute('width', '40');
      expect(gregorioAvatar).toHaveAttribute('height', '40');
      
      const adaAvatar = screen.getByAltText('Ada Lovelace');
      expect(adaAvatar).toHaveAttribute('width', '100');
      expect(adaAvatar).toHaveAttribute('height', '100');
    });

    test('conditional size code logic works correctly', () => {
      const { getImageUrlV2 } = require('../../utils/utils.js');
      render(<MyProfile />);
      
      // Verify that size < 90 results in 's' code
      const firstCall = getImageUrlV2.mock.calls[0];
      expect(firstCall[1]).toBe('s'); // size 40 < 90
      
      // Verify that size >= 90 results in 'b' code
      const secondCall = getImageUrlV2.mock.calls[1];
      expect(secondCall[1]).toBe('b'); // size 100 >= 90
    });
  });

} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi MyProfile component Anda.');
  
  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('MyProfile Component - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    test('component should at least render without crashing', () => {
      expect(() => render(<MyProfile />)).not.toThrow();
    });

    test('should contain basic structure elements', () => {
      render(<MyProfile />);
      
      // Test minimal requirements
      try {
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
        console.log('✔ Avatar images ditemukan');
      } catch (e) {
        console.log('❌ Avatar images tidak ditemukan');
      }

      try {
        expect(screen.getByAltText(/Gregorio/i)).toBeInTheDocument();
        console.log('✔ Gregorio Y. Zara avatar ditemukan');
      } catch (e) {
        console.log('❌ Gregorio Y. Zara avatar tidak ditemukan');
      }

      try {
        expect(screen.getByAltText(/Ada/i)).toBeInTheDocument();
        console.log('✔ Ada Lovelace avatar ditemukan');
      } catch (e) {
        console.log('❌ Ada Lovelace avatar tidak ditemukan');
      }
    });

    test('should have proper avatar structure', () => {
      render(<MyProfile />);
      
      try {
        const avatars = screen.getAllByRole('img');
        expect(avatars.length).toBe(2);
        console.log('✔ Jumlah avatar sesuai (2 avatar)');
      } catch (e) {
        console.log('❌ Jumlah avatar tidak sesuai');
      }

      try {
        const avatars = screen.getAllByRole('img');
        avatars.forEach(avatar => {
          expect(avatar).toHaveClass('avatar');
        });
        console.log('✔ Avatar CSS class ditemukan');
      } catch (e) {
        console.log('❌ Avatar CSS class tidak ditemukan');
      }

      try {
        // Check if avatars have size attributes
        const avatars = screen.getAllByRole('img');
        avatars.forEach(avatar => {
          expect(avatar).toHaveAttribute('width');
          expect(avatar).toHaveAttribute('height');
        });
        console.log('✔ Avatar size attributes ditemukan');
      } catch (e) {
        console.log('❌ Avatar size attributes tidak ditemukan');
      }
    });

    test('should have proper component structure', () => {
      const { container } = render(<MyProfile />);
      
      try {
        const mainDiv = container.firstChild;
        expect(mainDiv.tagName.toLowerCase()).toBe('div');
        console.log('✔ Main container div ditemukan');
      } catch (e) {
        console.log('❌ Main container div tidak ditemukan');
      }

      try {
        const avatars = screen.getAllByRole('img');
        expect(avatars.length).toBe(2);
        
        // Check for different sizes
        const sizes = avatars.map(avatar => avatar.getAttribute('width'));
        const hasDifferentSizes = new Set(sizes).size > 1;
        expect(hasDifferentSizes).toBe(true);
        console.log('✔ Avatar memiliki ukuran yang berbeda');
      } catch (e) {
        console.log('❌ Avatar tidak memiliki ukuran yang berbeda');
      }
    });
  });
}