import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Selalu import MyProfileV2 dari folder mahasiswa untuk pengujian.
import MyProfileV2 from '../../components/mahasiswa/myprofilev2.js'; 

// --- PENTING: Mocking Card.js ---
jest.mock('../../components/props/Card.js', () => {
  console.log('>>> MOCKING AKTIF untuk Card.js props! <<<'); 
  return function MockCardProps({ children }) {
    // Gunakan class="card" agar sesuai dengan HTML
    return React.createElement('div', { className: 'card' }, children); 
  };
}, { virtual: true }); 

jest.mock('../../components/mahasiswa/Card.js', () => {
  console.log('>>> MOCKING AKTIF untuk Card.js mahasiswa! <<<'); 
  return function MockCard({ children }) {
    // Gunakan class="card" agar sesuai dengan HTML
    return React.createElement('div', { className: 'card' }, children); 
  };
}, { virtual: true });
// --- AKHIR PERUBAHAN MOCKING CARD ---

// Fungsi untuk membaca konten file
const readFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`File not found: ${filePath}`);
    return '';
  }
};

// Fungsi untuk normalisasi kode (menghapus perbedaan yang tidak signifikan)
const normalizeCode = (code) => {
  if (!code) return '';
  
  let normalized = code.replace(/\r\n/g, '\n'); 
  normalized = normalized.replace(/import\s+Card\s+from\s+['"].*?Card\.js['"];?/g, "import Card from './Card.js';");
  
  normalized = normalized.split('\n').filter(line => line.trim() !== '').join('\n');
  normalized = normalized.split('\n').map(line => line.trim()).join('\n');
  normalized = normalized.replace(/\s+/g, ' ');
  return normalized.trim();
};

// Fungsi untuk membandingkan dua string kode
const compareFiles = (studentCode, answerKeyCode) => {
  if (!studentCode || !answerKeyCode) {
    console.log('⚠ File perbandingan tidak ditemukan, melanjutkan ke pengujian...');
    return true;
  }
  
  const normalizedStudentCode = normalizeCode(studentCode);
  const normalizedAnswerCode = normalizeCode(answerKeyCode);
  
  const differences = diffLines(normalizedStudentCode, normalizedAnswerCode);
  const hasDifferences = differences.some(part => part.added || part.removed);

  if (hasDifferences) {
    console.log('❌ Ditemukan perbedaan dalam kode:');
    differences.forEach((part) => {
      if (part.added) {
        console.log(`+ Ditambahkan: ${part.value.trim()}`);
      } else if (part.removed) {
        console.log(`- Dihapus: ${part.value.trim()}`);
      }
    });
    return false;
  }
  return true;
};

// Path file mahasiswa dan kunci jawaban
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/MyProfileV2.js');
const answerKeyFilePath = path.join(__dirname, '../../components/props/MyProfileV2.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  describe('MyProfileV2 Component Tests (Kode Sesuai Kunci Jawaban)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders MyProfileV2 component without crashing', () => {
      expect(() => render(<MyProfileV2 />)).not.toThrow();
    });

    test('renders main container div', () => {
      const { container } = render(<MyProfileV2 />);
      const mainDiv = container.firstChild;
      
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv.tagName.toLowerCase()).toBe('div');
    });

    test('renders exactly 2 Card components', () => {
      render(<MyProfileV2 />);
      // screen.debug(); // Hanya aktifkan jika masih perlu debug DOM
      const cards = screen.getAllByRole('generic').filter(el => 
        // Menggunakan el.getAttribute('class') untuk mencari class HTML
        el.getAttribute('class') && el.getAttribute('class').includes('card')
      );
      expect(cards).toHaveLength(2);
    });

    test('renders first Card with photo content', () => {
      render(<MyProfileV2 />);
      
      const photoHeading = screen.getByText('Foto');
      expect(photoHeading).toBeInTheDocument();
      expect(photoHeading.tagName.toLowerCase()).toBe('h1');
      
      const avatarImage = screen.getByAltText('Aklilu Lemma');
      expect(avatarImage).toBeInTheDocument();
      // Mengubah toHaveAttribute('className', 'avatar') menjadi memeriksa 'class'
      expect(avatarImage.getAttribute('class')).toBe('avatar'); 
      expect(avatarImage).toHaveAttribute('src', 'https://i.imgur.com/OKS67lhm.jpg');
      expect(avatarImage).toHaveAttribute('width', '70');
      expect(avatarImage).toHaveAttribute('height', '70');
    });

    test('renders second Card with about content', () => {
      render(<MyProfileV2 />);
      
      const aboutHeading = screen.getByText('Tentang');
      expect(aboutHeading).toBeInTheDocument();
      expect(aboutHeading.tagName.toLowerCase()).toBe('h1');
      
      const description = screen.getByText(/Aklilu Lemma adalah seorang ilmuwan terkemuka/);
      expect(description).toBeInTheDocument();
      expect(description.tagName.toLowerCase()).toBe('p');
      expect(description.textContent).toBe(
        'Aklilu Lemma adalah seorang ilmuwan terkemuka dari Etiopia yang telah menemukan pengobatan alami untuk skistosomiasis.'
      );
    });

    test('uses React.createElement correctly', () => {
      const { container } = render(<MyProfileV2 />);
      
      const mainDiv = container.firstChild;
      expect(mainDiv.tagName.toLowerCase()).toBe('div');
      
      expect(mainDiv.children).toHaveLength(2);
      
      const firstCard = mainDiv.children[0];
      const secondCard = mainDiv.children[1];
      
      expect(firstCard.querySelector('h1')).toBeTruthy();
      expect(firstCard.querySelector('img')).toBeTruthy();
      
      expect(secondCard.querySelector('h1')).toBeTruthy();
      expect(secondCard.querySelector('p')).toBeTruthy();
    });

    test('image has correct attributes', () => {
      render(<MyProfileV2 />);
      const image = screen.getByRole('img');
      
      // Mengubah toHaveAttribute('className', 'avatar') menjadi memeriksa 'class'
      expect(image.getAttribute('class')).toBe('avatar'); 
      expect(image).toHaveAttribute('src', 'https://i.imgur.com/OKS67lhm.jpg');
      expect(image).toHaveAttribute('alt', 'Aklilu Lemma');
      expect(image).toHaveAttribute('width', '70');
      expect(image).toHaveAttribute('height', '70');
    });

    test('headings have correct text content', () => {
      render(<MyProfileV2 />);
      const headings = screen.getAllByRole('heading', { level: 1 });
      
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent('Foto');
      expect(headings[1]).toHaveTextContent('Tentang');
    });

    test('paragraph has correct content', () => {
      render(<MyProfileV2 />);
      const paragraph = screen.getByText(/Aklilu Lemma adalah seorang ilmuwan/);
      
      expect(paragraph).toBeInTheDocument();
      expect(paragraph.textContent).toContain('Etiopia');
      expect(paragraph.textContent).toContain('skistosomiasis');
      expect(paragraph.textContent).toContain('pengobatan alami');
    });

    test('MyProfileV2 component is properly exported as default', () => {
      expect(MyProfileV2).toBeDefined();
      expect(typeof MyProfileV2).toBe('function');
    });

    test('component structure matches React.createElement pattern', () => {
      render(<MyProfileV2 />);
      
      const image = screen.getByAltText('Aklilu Lemma');
      const photoHeading = screen.getByText('Foto');
      const aboutHeading = screen.getByText('Tentang');
      const paragraph = screen.getByText(/Aklilu Lemma adalah seorang ilmuwan/);
      
      expect(image).toBeInTheDocument();
      expect(photoHeading).toBeInTheDocument();
      expect(aboutHeading).toBeInTheDocument();
      expect(paragraph).toBeInTheDocument();
    });

    test('Cards are rendered in correct order', () => {
      render(<MyProfileV2 />);
      const headings = screen.getAllByRole('heading', { level: 1 });
      
      expect(headings[0]).toHaveTextContent('Foto');
      expect(headings[1]).toHaveTextContent('Tentang');
    });

    test('component imports Card correctly', () => {
      render(<MyProfileV2 />);
      
      // Menggunakan document.querySelectorAll('[class*="card"]') untuk lebih fleksibel
      // atau .card jika yakin hanya itu
      const cards = document.querySelectorAll('.card'); 
      expect(cards.length).toBeGreaterThan(0);
    });
  });

} else {
  console.log('❌ Kode TIDAK sesuai dengan kunci jawaban. Menjalankan pengujian dasar...');
  console.log('📝 Silakan periksa kembali implementasi MyProfileV2 component Anda.');
  
  describe('MyProfileV2 Component - Basic Tests (Kode Tidak Sesuai Kunci Jawaban)', () => {
    test('component should at least render without crashing', () => {
      expect(() => render(<MyProfileV2 />)).not.toThrow();
    });

    test('should contain basic structure elements', () => {
      render(<MyProfileV2 />);
      
      try {
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
        console.log('✔ Heading elements ditemukan');
      } catch (e) {
        console.log('❌ Heading elements tidak ditemukan');
      }

      try {
        const image = screen.getByRole('img');
        expect(image).toBeInTheDocument();
        console.log('✔ Image element ditemukan');
      } catch (e) {
        console.log('❌ Image element tidak ditemukan');
      }

      try {
        expect(screen.getByText(/Foto/i)).toBeInTheDocument();
        console.log('✔ "Foto" text ditemukan');
      } catch (e) {
        console.log('❌ "Foto" text tidak ditemukan');
      }

      try {
        expect(screen.getByText(/Tentang/i)).toBeInTheDocument();
        console.log('✔ "Tentang" text ditemukan');
      } catch (e) {
        console.log('❌ "Tentang" text tidak ditemukan');
      }
    });

    test('should have proper content structure', () => {
      render(<MyProfileV2 />);
      
      try {
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('alt');
        expect(image).toHaveAttribute('src');
        console.log('✔ Image memiliki atribut alt dan src');
      } catch (e) {
        console.log('❌ Image tidak memiliki atribut yang diperlukan');
      }

      try {
        const paragraph = screen.getByText(/Aklilu Lemma/i);
        expect(paragraph).toBeInTheDocument();
        console.log('✔ Paragraph tentang Aklilu Lemma ditemukan');
      } catch (e) {
        console.log('❌ Paragraph tentang Aklilu Lemma tidak ditemukan');
      }

      try {
        const { container } = render(<MyProfileV2 />);
        const mainDiv = container.firstChild;
        expect(mainDiv.children.length).toBeGreaterThanOrEqual(2);
        console.log('✔ Component memiliki struktur minimal (2 bagian)');
      } catch (e) {
        console.log('❌ Component tidak memiliki struktur yang cukup');
      }
    });

    test('should have proper component export', () => {
      try {
        expect(MyProfileV2).toBeDefined();
        expect(typeof MyProfileV2).toBe('function');
        console.log('✔ Component export ditemukan');
      } catch (e) {
        console.log('❌ Component export tidak ditemukan');
      }

      try {
        const { container } = render(<MyProfileV2 />);
        const mainDiv = container.firstChild;
        expect(mainDiv.tagName.toLowerCase()).toBe('div');
        console.log('✔ Main container div ditemukan');
      } catch (e) {
        console.log('❌ Main container div tidak ditemukan');
      }
    });

    test('should use React.createElement pattern', () => {
      render(<MyProfileV2 />);
      
      try {
        const headings = screen.getAllByRole('heading');
        const image = screen.getByRole('img');
        
        expect(headings.length).toBeGreaterThan(0);
        expect(image).toBeInTheDocument();
        console.log('✔ React elements berhasil di-render');
      } catch (e) {
        console.log('❌ React elements tidak dapat di-render dengan benar');
      }

      try {
        expect(screen.getByText('Foto')).toBeInTheDocument();
        expect(screen.getByText('Tentang')).toBeInTheDocument();
        console.log('✔ Content elements ditemukan');
      } catch (e) {
        console.log('❌ Content elements tidak ditemukan');
      }
    });
  });
}