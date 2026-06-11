import { useState } from "react";

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);

  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const handleVotes = (randomIndex) => {
    const newVotes = [...votes];
    newVotes[randomIndex] = newVotes[randomIndex] + 1;
    setVotes(newVotes);
    console.log(newVotes);
  };

  const unicRandom = () => {
    let newValue = getRandomNumber(0, anecdotes.length - 2);

    if (newValue >= selected) {
      newValue = newValue + 1;
    }
    return newValue;
  };

  const bestAnicdote = () => {
    let analizVar = 0;
    let analizIndex = 0;

    for (let i = 0; i < votes.length; i++) {
      if (analizVar <= votes[i]) {
        analizVar = votes[i];
        analizIndex = i;
      }
    }
    return analizIndex;
  };

  const mostVotestAnecdotIndex = bestAnicdote();

  return (
    <>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button
        onClick={() => {
          setSelected(unicRandom());
        }}
      >
        next anecdote
      </button>

      <button
        onClick={() => {
          handleVotes(selected);
        }}
      >
        add vote
      </button>

      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[mostVotestAnecdotIndex]}</p>
      <p>has {votes[mostVotestAnecdotIndex]} votes</p>
    </>
  );
};

export default App;
