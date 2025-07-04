  import React, { useState } from "react";

  export default function Form() {
    const [jawaban, setJawaban] = useState('');
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('typing');

    if (status === 'success') {
      return React.createElement('h1', null, 'Yay... Jawaban Benar!');
    }

    function handleTextareaChange(e) {
      setJawaban(e.target.value);
    }

    async function handleSubmit(e) {
      e.preventDefault();
      setStatus('submitting');
      try {
        await submitForm(jawaban);
        setStatus('success');
      } catch (err) {
        setStatus('typing');
        setError(err);
      }
    }

    return React.createElement(
      'div',
      { className: 'w-full max-w-xs' },
      React.createElement('h2', null, 'Tebak Nama Hewan'),
      React.createElement('p', null, 'Hewan apa yang ditakuti oleh doraemon?'),
      React.createElement(
        'form',
        {
          className: 'shadow-md rounded px-8 pt-6 pb-8 mb-4 text-black border-gray-400',
          onSubmit: handleSubmit,
        },
        React.createElement('textarea', {
          value: jawaban,
          onChange: handleTextareaChange,
          disabled: status === 'submitting',
          className: 'w-full p-2 border border-gray-300 rounded mb-4',
        }),
        React.createElement('br'),
        React.createElement(
          'button',
          {
            type: 'submit',
            className: 'bg-blue-400 p-2 m-2 rounded text-sm text-white',
            disabled: jawaban.length === 0 || status === 'submitting',
          },
          'Submit'
        ),
        error &&
          React.createElement(
            'p',
            { className: 'text-red-500 text-sm' },
            error.message
          )
      )
    );
  }

  // Fungsi submitForm: simulasi request
  function submitForm(jawaban) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const shouldError = jawaban.toLowerCase() !== 'tikus';
        if (shouldError) {
          reject(new Error('Tebakan yang bagus tetapi jawaban salah. Silahkan coba lagi!'));
        } else {
          resolve();
        }
      }, 500); // set timeout selama 0,5 detik
    });
  }
