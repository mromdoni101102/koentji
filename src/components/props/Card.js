import React from 'react';

export default function Card({ children }) {
  return React.createElement(
    'div',
    { className: 'card' },  
    React.createElement('div', { className: 'card-content' }, children)
  );
}