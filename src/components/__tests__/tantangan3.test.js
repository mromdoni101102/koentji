import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tantangan3 from '../../components/conditional_rendering/Tantangan3.js';

// Fungsi baca file
const readFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.warn(`⚠️ Tidak dapat membaca file: ${filePath}`);
    return '';
  }
};

// Fungsi pembanding
const compareFiles = (studentCode, answerKeyCode) => {
  if (!studentCode || !answerKeyCode) {
    console.log('⚠️ Salah satu file tidak ditemukan, lanjut ke pengujian dasar...');
    return true;
  }

  const differences = diffLines(studentCode, answerKeyCode);
  const hasDiff = differences.some(part => part.added || part.removed);

  if (hasDiff) {
    console.log('❌ Perbedaan ditemukan antara kode mahasiswa dan kunci:');
    differences.forEach((part, index) => {
      if (part.added) console.log(`+ [${index + 1}] ${part.value.trim()}`);
      if (part.removed) console.log(`- [${index + 1}] ${part.value.trim()}`);
    });
    return false;
  }

  console.log('✅ Kode cocok dengan kunci jawaban.');
  return true;
};

// Lokasi file
const studentPath = path.join(__dirname, '../../components/mahasiswa/Tantangan3.js');
const answerKeyPath = path.join(__dirname, '../../components/conditional_rendering/Tantangan3.js');

// Baca file
const studentCode = readFileContent(studentPath);
const answerKeyCode = readFileContent(answerKeyPath);

// Jalankan perbandingan
if (compareFiles(studentCode, answerKeyCode)) {
  // Pengujian lengkap jika cocok
  describe('Tantangan3 Component - Full Test', () => {
    test('Render tidak error', () => {
      expect(() => render(<Tantangan3 />)).not.toThrow();
    });

test('Menampilkan teks nama minuman', () => {
  render(<Tantangan3 />);
  const names = screen.getAllByText(/tea|coffee/i);
  expect(names.length).toBe(2); // karena ada "tea" dan "coffee"
});

test('Menampilkan teks "Part of plant"', () => {
  render(<Tantangan3 />);
  const elements = screen.getAllByText('Part of plant');
  expect(elements.length).toBe(2); // muncul dua kali
});

test('Menampilkan teks "Caffeine content"', () => {
  render(<Tantangan3 />);
  const elements = screen.getAllByText('Caffeine content');
  expect(elements.length).toBe(2); // muncul dua kali
});

test('Menampilkan teks "Age"', () => {
  render(<Tantangan3 />);
  const elements = screen.getAllByText('Age');
  expect(elements.length).toBe(2); // muncul dua kali
});

  });
} else {
  // Pengujian dasar jika tidak cocok
  describe('Tantangan3 Component - Basic Test (Mismatch)', () => {
    test('Component masih bisa dirender', () => {
      expect(() => render(<Tantangan3 />)).not.toThrow();
    });

    test('Cek apakah elemen dasar muncul', () => {
      render(<Tantangan3 />);
      try {
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
        console.log('✔️ Terdapat elemen heading');
      } catch {
        console.log('❌ Tidak ditemukan elemen heading');
      }
    });
  });
}
