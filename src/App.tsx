import React, { useState } from 'react';
import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';

function App() {
  // 習慣の配列を管理
  const [habits, setHabits] = useState<string[]>([
    '30分プログラミング',
    '読書する',
    '運動する'
  ]);

  // 入力フォームの値を管理
  const [newHabit, setNewHabit] = useState<string>('');

  // 習慣を追加する関数
  const addHabit = () => {
    if (newHabit.trim() !== '') {
      setHabits([...habits, newHabit.trim()]);
      setNewHabit('');
    }
  };

  return (
    <div className="App">
      <Header />
      {/* 入力フォーム */}
      <div className='add-habit'>
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="新しい習慣を入力..."
        />
        <button onClick={addHabit}>追加</button>
      </div>

      {/* 習慣リスト */}
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
