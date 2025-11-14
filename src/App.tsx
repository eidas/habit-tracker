import React, { useState } from 'react';
import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { ulid } from 'ulid';

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}


function App() {
  // 習慣の配列を管理
  const [habits, setHabits] = useState<Habit[]>([
    { id: ulid(), name: '30分プログラミング', completedDates: [] },
    { id: ulid(), name: '読書する', completedDates: [] },
    { id: ulid(), name: '運動する', completedDates: [] }
  ]);
  
  // 入力フォームの値を管理
  const [newHabitName, setNewHabitName] = useState<string>('');

  // 今日の日付を取得
  const today = new Date();
  const dateString = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  // 今日の日付をYYYY-MM-DD形式で取得（新規追加）
  const getTodayString = (): string => {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 今日の日付文字列
  const todayString = getTodayString();

  // 習慣を追加する関数
  const addHabit = () => {
    if (newHabitName.trim() !== '') {
      setHabits([...habits, 
        { id: ulid(), name: newHabitName.trim(), completedDates: [] }]);
      setNewHabitName('');
    }
  };

  // 習慣を削除する関数
  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    setHabits(updatedHabits);
  };

  // チェック状態の確認（新規追加）
  const isCheckedToday = (habit: Habit): boolean => {
    return habit.completedDates.includes(todayString);
  };

  // 習慣の完了状態を切り替える関数
  const toggleHabitCompletion = (id: string): void => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const isCompleted = isCheckedToday(habit);
        const updatedCompletedDates = isCompleted
          ? habit.completedDates.filter(date => date !== todayString) // チェックを外す
          : [...habit.completedDates, todayString]; // チェックを入れる
        return { ...habit, completedDates: updatedCompletedDates };
      }
      return habit;
    });
    setHabits(updatedHabits);

    // const updatedHabits = habits.map((habit) => {}
    //   habit.id === id ? { ...habit, completed: !habit.completed } : habit
    // );
    // setHabits(updatedHabits);
  };


  return (
    <div className="App">
      <Header />

      {/* 今日の日付表示 */}
      <div className="date-display">
        {dateString}
      </div>

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
              checked={isCheckedToday(habit)} 
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
