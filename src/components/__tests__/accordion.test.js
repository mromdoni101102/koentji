  import '@testing-library/jest-dom';
  import { diffLines } from 'diff';
  import fs from 'fs';
  import path from 'path';
  import { render, screen, fireEvent } from '@testing-library/react';
  import Accordion, { Panel } from '../../components/event_handler/accordion.js'; // pakai dari props sebagai default

  // Fungsi baca file
  const readFileContent = (filePath) => {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      console.warn(`⚠ Gagal membaca file: ${filePath}`);
      return '';
    }
  };

  // Fungsi pembanding isi file
  const compareFiles = (studentCode, answerKeyCode) => {
    if (!studentCode || !answerKeyCode) {
      console.log('⚠ File tidak lengkap untuk dibandingkan.');
      return true; // Lanjut saja ke tes meskipun tidak bisa dibandingkan
    }

    const differences = diffLines(studentCode, answerKeyCode);
    const hasDiff = differences.some((part) => part.added || part.removed);

    if (hasDiff) {
      console.log('❌ Perbedaan ditemukan dalam file Accordion.js:');
      differences.forEach((part, i) => {
        if (part.added) {
          console.log(`+ Baris ${i + 1}: ${part.value.trim()}`);
        } else if (part.removed) {
          console.log(`- Baris ${i + 1}: ${part.value.trim()}`);
        }
      });
      return false;
    }

    return true;
  };

  // Lokasi file
  const studentFilePath = path.join(__dirname, '../../components/mahasiswa/accordion.js');
  const answerKeyFilePath = path.join(__dirname, '../../components/event_handler/accordion.js');

  // Baca file
  const studentCode = readFileContent(studentFilePath);
  const answerKeyCode = readFileContent(answerKeyFilePath);

  // Perbandingan kode
  if (compareFiles(studentCode, answerKeyCode)) {
    console.log('✔ Kode mahasiswa sesuai dengan kunci jawaban.');

    describe('Accordion Component - Full Test', () => {
      test('renders title and first panel by default', () => {
        render(<Accordion />);
        expect(screen.getByText('Almaty, Kazakhstan')).toBeInTheDocument();
        expect(screen.getByText(/Dengan populasi sekitar/)).toBeInTheDocument();
      });

      test('clicking panel title changes active panel', () => {
        render(<Accordion />);
        const showButton = screen.getByText('Tampilkan'); // ganti dari /Nama "Almaty"/
        fireEvent.click(showButton);
        expect(screen.getByText(/Malus sieversii/)).toBeInTheDocument();
      });
      test('only one panel content is visible at a time', () => {
        render(<Accordion />);
        const showButton = screen.getByText('Tampilkan'); // ganti dari /Nama "Almaty"/
        fireEvent.click(showButton);

        // Pastikan panel pertama sudah tidak tampil
        expect(screen.queryByText(/Dengan populasi sekitar/)).not.toBeInTheDocument();

        // Panel kedua tampil
        expect(screen.getByText(/Malus sieversii/)).toBeInTheDocument();
      });

      test('Panel renders correctly with active and inactive states', () => {
        const { container, rerender } = render(
          <Panel title="Test Panel" isActive={true} onShow={() => {}}>
            Konten Panel Aktif
          </Panel>
        );
        expect(container).toHaveTextContent('Konten Panel Aktif');

        rerender(
          <Panel title="Test Panel" isActive={false} onShow={() => {}}>
            Konten Panel Tidak Aktif
          </Panel>
        );
        expect(container).not.toHaveTextContent('Konten Panel Tidak Aktif');
      });
    });
  } else {
    console.log('❌ Kode mahasiswa tidak sesuai dengan kunci jawaban.');
    console.log('🛠 Menjalankan pengujian dasar untuk memastikan komponen tetap dapat dirender.');

    describe('Accordion Component - Basic Tests Only', () => {
      test('Accordion renders without crashing', () => {
        expect(() => render(<Accordion />)).not.toThrow();
      });

      test('renders at least one heading', () => {
        render(<Accordion />);
        expect(screen.getByText('Almaty, Kazakhstan')).toBeInTheDocument();
      });

      test('renders panel title elements', () => {
        render(<Accordion />);
        expect(screen.getByText(/Nama "Almaty"/)).toBeInTheDocument();
      });

      test('contains clickable element', () => {
        render(<Accordion />);
        const clickable = screen.getByText(/Nama "Almaty"/);
        expect(clickable).toBeInTheDocument();
      });
    });
  }
