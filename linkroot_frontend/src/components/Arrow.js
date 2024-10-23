import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Using react-icons

export default function Arrow() {
  return (
    React.createElement('div', { className: 'flex items-center justify-center w-full py-6 px-4' },
      React.createElement(FaArrowLeft, { className: 'w-8 h-8 text-gray-600 transform -rotate-45' }), // Increased size
      React.createElement('h2', { className: 'text-2xl font-bold text-center mx-4 text-gray-800' },
        'BUSINESSES POWERED BY LINKROOT'
      ),
      React.createElement(FaArrowRight, { className: 'w-8 h-8 text-gray-600 transform rotate-45' }) // Increased size
    )
  );
}
