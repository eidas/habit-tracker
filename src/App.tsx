import React, { useState } from 'react';
import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';

function App() {
  const [habits, setHabits] = useState<string[]>([
    '30分プログラミング',
    '読書する',
    '運動する'
  ]);

  return (
    <div className="App">
      <Header />
      <main className="App-main">
        {habits.map((habit, index) => (
          <div key={index} className="habit-item">
            <input type="checkbox" id={`habit-${index}`} />
            <label htmlFor={`habit-${index}`}>{habit}</label>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
