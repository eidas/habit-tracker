import React, { useState } from 'react';
import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { ulid } from 'ulid';

interface Habit {
  id: string;
  name: string;
  completed: boolean;
}


function App() {
  // 習慣の配列を管理
  const [habits, setHabits] = useState<Habit[]>([
    { id: ulid(), name: '30分プログラミング', completed: false },
    { id: ulid(), name: '読書する', completed: false },
    { id: ulid(), name: '運動する', completed: false }
  ]);

  // 入力フォームの値を管理
  const [newHabitName, setNewHabitName] = useState<string>('');

  // 習慣を追加する関数
  const addHabit = () => {
    if (newHabitName.trim() !== '') {
      setHabits([...habits, 
        { id: ulid(), name: newHabitName.trim(), completed: false }]);
      setNewHabitName('');
    }
  };

  // 習慣を削除する関数
  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    setHabits(updatedHabits);
  };

  // 習慣の完了状態を切り替える関数
  const toggleHabitCompletion = (id: string): void => {
    const updatedHabits = habits.map((habit) => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
  };


  return (
    <div className="App">
      <Header />
      {/* 入力フォーム */}
      <div className='add-habit-form'>
        <input
          type="text"
          className="add-input"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="新しい習慣を入力..."
        />
        <button className="add-button" onClick={addHabit}>追加</button>
      </div>

      {/* 習慣リスト */}
      <main className="App-main">
        {habits.map((habit) => (
          <div key={habit.id} className="habit-item">
            <input 
              type="checkbox" 
              id={`habit-${habit.id}`} 
              checked={habit.completed} 
              onChange={() => toggleHabitCompletion(habit.id)} 
            />
            <label htmlFor={`habit-${habit.id}`}>{habit.name}</label>
            <button className='delete-button' onClick={() => deleteHabit(habit.id)}>削除</button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
