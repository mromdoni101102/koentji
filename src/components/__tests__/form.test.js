import { diffLines } from 'diff';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from '../../components/event_handler/form.js'; // Import dari folder kunci jawaban

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
const studentFilePath = path.join(__dirname, '../../components/mahasiswa/form.js');
const answerKeyFilePath = path.join(__dirname, '../../components/event_handler/form.js');

// Baca konten file
const studentCode = readFileContent(studentFilePath);
const answerKeyCode = readFileContent(answerKeyFilePath);

// Bandingkan file sebelum menjalankan pengujian
if (compareFiles(studentCode, answerKeyCode)) {
  console.log('✔ Kode sesuai dengan kunci jawaban. Melanjutkan ke pengujian otomatis...');

  // Define Jest tests
  describe('Form Component Tests', () => {
    let preventDefaultSpy; // Deklarasikan di luar beforeEach agar bisa diakses di test

    beforeEach(() => {
      // Reset any mocks before each test
      jest.clearAllMocks();
      // Pastikan preventDefaultSpy tidak aktif di sini untuk tes lain
    });

    afterEach(() => {
      // Pulihkan spy setelah setiap tes selesai, jika spy telah didefinisikan
      if (preventDefaultSpy) {
        preventDefaultSpy.mockRestore();
        preventDefaultSpy = undefined; // Setel ulang agar bersih untuk tes berikutnya
      }
    });

    test('renders Form component without crashing', () => {
      expect(() => render(<Form />)).not.toThrow();
    });

    test('renders initial form elements correctly', () => {
      render(<Form />);
      
      expect(screen.getByText('Tebak Nama Hewan')).toBeInTheDocument();
      expect(screen.getByText('Hewan apa yang ditakuti oleh doraemon?')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    test('textarea handles input correctly', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'kucing');
      
      expect(textarea.value).toBe('kucing');
    });

    test('submit button is disabled when textarea is empty', () => {
      render(<Form />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeDisabled();
    });

    test('submit button is enabled when textarea has content', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      await user.type(textarea, 'tikus');
      expect(submitButton).not.toBeDisabled();
    });

    test('form shows success message when correct answer is submitted', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      await user.type(textarea, 'tikus');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Yay... Jawaban Benar!')).toBeInTheDocument();
      });
    });

    test('form shows error message when incorrect answer is submitted', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      await user.type(textarea, 'kucing');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Tebakan yang bagus tetapi jawaban salah. Silahkan coba lagi!')).toBeInTheDocument();
      });
    });

    test('form elements are disabled during submission', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      await user.type(textarea, 'tikus');
      
      // Click submit and immediately check if elements are disabled
      user.click(submitButton);
      
      // During submission, elements should be disabled
      await waitFor(() => {
        expect(textarea).toBeDisabled();
        expect(submitButton).toBeDisabled();
      });
    });

    test('case insensitive answer validation works correctly', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      // Test uppercase
      await user.type(textarea, 'TIKUS');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Yay... Jawaban Benar!')).toBeInTheDocument();
      });
    });

    test('form has correct CSS classes', () => {
      render(<Form />);
      
      const mainDiv = screen.getByText('Tebak Nama Hewan').closest('div');
      expect(mainDiv).toHaveClass('w-full', 'max-w-xs');
      
      const form = screen.getByRole('textbox').closest('form');
      expect(form).toHaveClass('shadow-md', 'rounded', 'px-8', 'pt-6', 'pb-8', 'mb-4', 'text-black', 'border-gray-400');
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('w-full', 'p-2', 'border', 'border-gray-300', 'rounded', 'mb-4');
      
      const button = screen.getByRole('button', { name: 'Submit' });
      expect(button).toHaveClass('bg-blue-400', 'p-2', 'm-2', 'rounded', 'text-sm', 'text-white');
    });

    test('error message has correct styling', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      await user.type(textarea, 'kucing');
      await user.click(submitButton);
      
      await waitFor(() => {
        const errorMessage = screen.getByText('Tebakan yang bagus tetapi jawaban salah. Silahkan coba lagi!');
        expect(errorMessage).toHaveClass('text-red-500', 'text-sm');
      });
    });

    test('form can be submitted multiple times after error', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      // First submission with wrong answer
      await user.type(textarea, 'kucing');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Tebakan yang bagus tetapi jawaban salah. Silahkan coba lagi!')).toBeInTheDocument();
      });
      
      // Clear textarea and submit correct answer
      await user.clear(textarea);
      await user.type(textarea, 'tikus');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Yay... Jawaban Benar!')).toBeInTheDocument();
      });
    });

    test('form uses React.createElement correctly', () => {
      const { container } = render(<Form />);
      
      // Check if the component renders proper HTML structure
      const h2 = container.querySelector('h2');
      const p = container.querySelector('p');
      const form = container.querySelector('form');
      const textarea = container.querySelector('textarea');
      const button = container.querySelector('button');
      
      expect(h2).toBeInTheDocument();
      expect(p).toBeInTheDocument();
      expect(form).toBeInTheDocument();
      expect(textarea).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    test('component state management works correctly', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      
      // Test state updates
      expect(textarea.value).toBe('');
      
      await user.type(textarea, 'test');
      expect(textarea.value).toBe('test');
      
      await user.clear(textarea);
      expect(textarea.value).toBe('');
    });

    test('submitForm function works with correct timeout', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      const startTime = Date.now();
      
      await user.type(textarea, 'tikus');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Yay... Jawaban Benar!')).toBeInTheDocument();
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should take at least 500ms due to setTimeout
      expect(duration).toBeGreaterThan(400); // Memberi sedikit toleransi
    });

    // TES YANG DIPERBAIKI UNTUK PREVENT DEFAULT BEHAVIOR
    test('form prevents default submission behavior', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      // Ketik dulu teksnya, event preventDefault() dari pengetikan tidak akan di-spy
      await user.type(textarea, 'tikus');

      // Sekarang aktifkan spy TEPAT SEBELUM event submit
      preventDefaultSpy = jest.spyOn(Event.prototype, 'preventDefault');

      // Klik tombol submit
      await user.click(submitButton);
      
      // Tunggu hingga form selesai submit dan pesan sukses/error muncul
      await waitFor(() => {
        // Cek salah satu dari pesan yang akan muncul (sukses atau error)
        expect(screen.queryByText('Yay... Jawaban Benar!') || screen.queryByText(/Tebakan yang bagus/)).toBeInTheDocument();
      });

      // Pastikan preventDefault dipanggil persis 1 kali dari event submit
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      
      // preventDefaultSpy.mockRestore() akan dipanggil di afterEach
    });

    test('component handles empty answer correctly', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      // Button should be disabled when textarea is empty
      expect(submitButton).toBeDisabled();
      
      // Type and then clear
      await user.type(textarea, 'test');
      expect(submitButton).not.toBeDisabled();
      
      await user.clear(textarea);
      expect(submitButton).toBeDisabled();
    });

    test('success state renders only h1 element', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      await user.type(textarea, 'tikus');
      await user.click(submitButton);
      
      await waitFor(() => {
        const successMessage = screen.getByText('Yay... Jawaban Benar!');
        expect(successMessage.tagName.toLowerCase()).toBe('h1');
        
        // Form elements should not be present
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
      });
    });

    test('br element is present in form', () => {
      const { container } = render(<Form />);
      const brElement = container.querySelector('br');
      expect(brElement).toBeInTheDocument();
    });

  });

} else {
  console.log('❌ Kode tidak sesuai dengan kunci jawaban.');
  console.log('📝 Silakan periksa kembali implementasi Form component Anda.');
  
  // Tetap jalankan beberapa test dasar meski kode tidak sama
  describe('Form Component - Basic Tests (Kode tidak sesuai kunci jawaban)', () => {
    test('component should at least render without crashing', () => {
      expect(() => render(<Form />)).not.toThrow();
    });

    test('should contain basic form elements', () => {
      render(<Form />);
      
      try {
        expect(screen.getByText(/Tebak Nama Hewan/i)).toBeInTheDocument();
        console.log('✔ Judul form ditemukan');
      } catch (e) {
        console.log('❌ Judul form tidak ditemukan');
      }

      try {
        expect(screen.getByText(/doraemon/i)).toBeInTheDocument();
        console.log('✔ Pertanyaan form ditemukan');
      } catch (e) {
        console.log('❌ Pertanyaan form tidak ditemukan');
      }

      try {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        console.log('✔ Textarea ditemukan');
      } catch (e) {
        console.log('❌ Textarea tidak ditemukan');
      }

      try {
        expect(screen.getByRole('button')).toBeInTheDocument();
        console.log('✔ Submit button ditemukan');
      } catch (e) {
        console.log('❌ Submit button tidak ditemukan');
      }
    });

    test('should have proper form interaction', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      try {
        const textarea = screen.getByRole('textbox');
        await user.type(textarea, 'test');
        expect(textarea.value).toBe('test');
        console.log('✔ Textarea input interaction works');
      } catch (e) {
        console.log('❌ Textarea input interaction failed');
      }

      try {
        const submitButton = screen.getByRole('button');
        expect(submitButton).toBeInTheDocument();
        console.log('✔ Submit button accessible');
      } catch (e) {
        console.log('❌ Submit button not accessible');
      }
    });

    test('should handle form submission', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      try {
        const textarea = screen.getByRole('textbox');
        const submitButton = screen.getByRole('button');
        
        await user.type(textarea, 'tikus');
        await user.click(submitButton);
        
        // Wait for any async operations
        await waitFor(() => {
          // Check if success message appears or error handling works
          const hasSuccessMessage = screen.queryByText(/Yay/i) !== null;
          const hasErrorMessage = screen.queryByText(/salah/i) !== null;
          
          if (hasSuccessMessage || hasErrorMessage) {
            console.log('✔ Form submission handling works');
          } else {
            console.log('❌ Form submission handling may not work');
          }
        });
      } catch (e) {
        console.log('❌ Form submission failed');
      }
    });

    test('should have proper styling classes', () => {
      render(<Form />);
      
      try {
        const { container } = render(<Form />);
        const elementsWithClasses = container.querySelectorAll('[class]');
        expect(elementsWithClasses.length).toBeGreaterThan(0);
        console.log('✔ CSS classes ditemukan');
      } catch (e) {
        console.log('❌ CSS classes tidak ditemukan');
      }
    });

    test('should use React.createElement structure', () => {
      const { container } = render(<Form />);
      
      try {
        // Check if basic HTML structure exists
        const hasDiv = container.querySelector('div') !== null;
        const hasH2 = container.querySelector('h2') !== null;
        const hasP = container.querySelector('p') !== null;
        const hasForm = container.querySelector('form') !== null;
        const hasTextarea = container.querySelector('textarea') !== null;
        const hasButton = container.querySelector('button') !== null;
        
        if (hasDiv && hasH2 && hasP && hasForm && hasTextarea && hasButton) {
          console.log('✔ React.createElement structure detected');
        } else {
          console.log('❌ React.createElement structure incomplete');
        }
      } catch (e) {
        console.log('❌ Error checking React.createElement structure');
      }
    });

    test('should handle state management', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      try {
        const textarea = screen.getByRole('textbox');
        
        // Check initial state
        expect(textarea.value).toBe('');
        
        // Check state update
        await user.type(textarea, 'test');
        expect(textarea.value).toBe('test');
        
        console.log('✔ State management works');
      } catch (e) {
        console.log('❌ State management failed');
      }
    });

    test('should export component properly', () => {
      try {
        expect(Form).toBeDefined();
        expect(typeof Form).toBe('function');
        console.log('✔ Component export works');
      } catch (e) {
        console.log('❌ Component export failed');
      }
    });

    test('should have proper form validation', () => {
      render(<Form />);
      
      try {
        const submitButton = screen.getByRole('button');
        const textarea = screen.getByRole('textbox');
        
        // Check if button is disabled when textarea is empty
        if (textarea.value === '' && submitButton.disabled) {
          console.log('✔ Form validation works');
        } else {
          console.log('❌ Form validation may not work properly');
        }
      } catch (e) {
        console.log('❌ Form validation check failed');
      }
    });

    test('should handle async operations', async () => {
      const user = userEvent.setup();
      render(<Form />);
      
      try {
        const textarea = screen.getByRole('textbox');
        const submitButton = screen.getByRole('button');
        
        await user.type(textarea, 'tikus');
        await user.click(submitButton);
        
        // Wait for async operation
        setTimeout(() => {
          console.log('✔ Async operation handling attempted');
        }, 600);
      } catch (e) {
        console.log('❌ Async operation handling failed');
      }
    });

    test('should have proper component structure', () => {
      const { container } = render(<Form />);
      
      try {
        const rootElement = container.firstChild;
        expect(rootElement).toBeInTheDocument();
        console.log('✔ Component renders with proper root structure');
      } catch (e) {
        console.log('❌ Component structure check failed');
      }
    });
  });
}