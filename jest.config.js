// jest.config.js
const nextJest = require('next/jest');

// Menentukan direktori root aplikasi Next.js Anda.
// Ini penting agar next/jest dapat menemukan next.config.js dan file lingkungan.
const createJestConfig = nextJest({
  dir: './',
});

// Tambahkan konfigurasi khusus Anda yang akan digabungkan dengan konfigurasi Next.js bawaan.
const customJestConfig = {
  // Selalu sertakan file setup ini. Ini akan menambahkan matchers dari @testing-library/jest-dom.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // 'jest-environment-jsdom' adalah lingkungan pengujian yang benar untuk aplikasi React.
  // Next.js biasanya sudah mengaturnya, tapi tidak ada salahnya memastikan.
  testEnvironment: 'jest-environment-jsdom',
  // ===========================================

  // Ini adalah bagian kunci untuk mengatasi masalah "Cannot find module '@/data/article'".
  // Kita memberitahu Jest bagaimana cara memetakan alias '@/' ke direktori 'src/' di root proyek.
  // Asumsi: folder 'data' ada di dalam folder 'src'.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Konfigurasi code coverage (jika Anda ingin menggunakannya).
  // Hapus komentar pada baris di bawah ini jika kamu ingin mengaktifkan code coverage.
  // collectCoverage: true,
  // collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/__tests__/**', '!**/node_modules/**'],
  // coverageReporters: ['html', 'text'],
};

// createJestConfig adalah fungsi async, jadi kita membungkusnya dalam fungsi sync
// yang mengembalikan promise.
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();

  // Anda dapat menginspeksi atau memodifikasi objek 'config' terakhir di sini
  // sebelum Jest menggunakannya. Misalnya, jika Anda memiliki kebutuhan yang sangat spesifik
  // yang tidak dapat ditangani oleh customJestConfig.
  return config;
};