import React from 'react';
import Card from '../../components/mahasiswa/Card.js';
export default function MyProfileV2() {
  return React.createElement(
    'div',
    null,
    React.createElement(
      Card,
      null,
      React.createElement('h1', null, 'Foto'),
      React.createElement('img', {
        className: 'avatar',
        src: 'https://i.imgur.com/OKS67lhm.jpg',
        alt: 'Aklilu Lemma',
        width: 70,
        height: 70
      })
    ),
    React.createElement(
      Card,
      null,
      React.createElement('h1', null, 'Tentang'),
      React.createElement(
        'p',
        null,
        'Aklilu Lemma adalah seorang ilmuwan terkemuka dari Etiopia yang telah menemukan pengobatan alami untuk skistosomiasis.'
      )
    )
  );
}
