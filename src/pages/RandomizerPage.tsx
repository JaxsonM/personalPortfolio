import React, { useState } from 'react';

type Participant = {
  name: string;
  positions: number[];
  tickets: number;
};

const RandomizerPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newName, setNewName] = useState('');
  const [results, setResults] = useState<string[]>([]);
  let lotteryPool: string[] = [];
  let winners: Participant[] = [];

  // Add a new participant with an initial position
  const addParticipant = () => {
    if (newName.trim()) {
      setParticipants([...participants, { name: newName.trim(), positions: [], tickets: 0 }]);
      setNewName('');
    }
    console.log("ps:", participants);
  };

  // Calculate the average of an array of numbers, rounded to the nearest whole number
  const average = (array: number[]) => {
    if (array.length === 0) return 0; // To handle division by zero if positions array is empty
    const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return Math.round(sum / array.length);
  };

  // Shuffle array in place
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Randomize the participants based on their average positions
  const handleRandomize = () => {
    console.log("Ps before initial shuffle:", participants);
    if (participants[0].positions.length === 0) {
      // Make the initial order random
      shuffleArray(participants);
      // Update the positions for each participant
    const updatedParticipants = participants.map((participant, index) => {
      const newPositions = [...participant.positions, index + 1]; // +1 to avoid zero-based index
      const avgTickets = average(newPositions);
      return {
        ...participant,
        positions: newPositions,
        tickets: avgTickets,
      };
    });
    setParticipants(updatedParticipants);
    } else {
    console.log("Ps after initial shuffle:", participants);

    

    // Add participants to the lottery pool based on their average positions
    participants.forEach((participant) => {
      for (let j = 0; j < participant.tickets; j++) {
        lotteryPool.push(participant.name);
      }
    });

    // Pick winners from the lottery pool
    for (let i = 0; i < participants.length; i++) {
      if (lotteryPool.length === 0) break; // Ensure there's no infinite loop
      console.log(lotteryPool);
      // Randomly pick a winner from the lottery pool
      const winnerIndex = Math.floor(Math.random() * lotteryPool.length);
      const winnerName = lotteryPool[winnerIndex];

      const winner = participants.find(participant => participant.name === winnerName);
      if (winner) {
        winners.push(winner);
      }

      // Remove all instances of the winner from the lottery pool
      lotteryPool = lotteryPool.filter(participant => participant !== winnerName);
    }

    // Set the results with the winners' names
    setResults(winners.map(winner => winner.name));

    // Reverse the order of winners so that the last winner is placed at the last position
    // const reversedWinners = winners.reverse();

    // setResults([...reversedWinners]);
    console.log("winners:", winners);
    // Set participants to the same order as their names in reversedWinners
    // const orderedParticipants = winners.map(winnerName =>
    //   updatedParticipants.find(participant => participant.name === winnerName)
    // ) as Participant[];
    setParticipants(winners);

    console.log(winners);
    // Update the positions for each participant
    const updatedParticipants = participants.map((participant, index) => {
      const newPositions = [...participant.positions, index + 1]; // +1 to avoid zero-based index
      const avgTickets = average(newPositions);
      return {
        ...participant,
        positions: newPositions,
        tickets: avgTickets,
      };
    });
    setParticipants(updatedParticipants);
}
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Randomizer Page</h1>
      <div className="mt-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter name"
          className="px-2 py-1 border border-gray-300 rounded"
        />
        <button
          onClick={addParticipant}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Participant
        </button>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleRandomize}
      >
        Randomize
      </button>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Participants</h2>
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>
              {participant.name} (Positions: {participant.positions.join(', ')}, Tickets: {participant.tickets})
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Results</h2>
        <ol>
          {results.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RandomizerPage;
