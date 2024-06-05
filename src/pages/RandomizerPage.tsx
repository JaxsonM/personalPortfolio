// src/pages/RandomizerPage.tsx
import React, { useState } from 'react';

const RandomizerPage: React.FC = () => {
  const [result, setResult] = useState<number | null>(null);

  const handleRandomize = () => {
    const min = 1;
    const max = 100;
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    setResult(random);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Randomizer Page</h1>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
        onClick={handleRandomize}
      >
        Randomize
      </button>
      {result !== null && <p className="mt-4 text-lg">Random number: {result}</p>}
    </div>
  );
};

export default RandomizerPage;
