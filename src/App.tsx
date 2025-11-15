import React, { useState } from 'react';
import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { ulid } from 'ulid';


/**
  * 習慣の型定義
  * @property {string} id - 習慣の一意なID
  * @property {string} name - 習慣の名前
  * @property {string[]} completedDates - 習慣が完了した日付の配列（YYYY-MM-DD形式の文字列）
  */
interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}


function App() {
  // ==================== State管理 ====================

  // 習慣のリスト
  const [habits, setHabits] = useState<Habit[]>([
    { id: ulid(), name: '30分プログラミング', completedDates: [] },
    { id: ulid(), name: '読書する', completedDates: [] },
    { id: ulid(), name: '運動する', completedDates: [] }
  ]);
  
  // 入力フォームの値を管理
  const [newHabitName, setNewHabitName] = useState<string>('');

  // ==================== 日付関連 ====================

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

  // ==================== 習慣の操作 ====================

  /**
   * 新しい習慣を追加
   */
  const addHabit = () => {
    if (newHabitName.trim() !== '') {
      setHabits([...habits, 
        { 
          id: ulid(), 
          name: newHabitName.trim(), 
          completedDates: [] 
        }
      ]);
      setNewHabitName('');
    }
  };

  /**
   * 習慣を削除
   * @param id - 削除する習慣のID
   */
  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    setHabits(updatedHabits);
  };

  /**
   * 指定した習慣が今日完了しているか確認
   * @param habit - 確認する習慣
   * @returns 今日完了していればtrue
   */
  const isCheckedToday = (habit: Habit): boolean => {
    return habit.completedDates.includes(todayString);
  };

  /**
   * 習慣の完了状態を切り替え
   * @param id - 切り替える習慣のID
   */
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
  };

  /**
   * Enterキー押下時の処理
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addHabit();
    }
  };

  // ==================== レンダリング ====================
  
  return (
    <div className="App">
      {/* ヘッダー */}
      <header>
        <Header /> 
        <div className="date-display">{dateString}</div>
      </header>

      {/* 新規習慣登録フォーム */}
      <div className='add-habit-form'>
        <input
          type="text"
          className="habit-input"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="新しい習慣を入力..."
        />
        <button className="add-button" onClick={addHabit}>追加</button>
      </div>

      {/* 習慣リスト */}
      <main className="habit-list">
        {habits.length === 0 ? (
          <div className="empty-state">
            習慣を追加してみましょう！
          </div>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="habit-item">
              <input 
                type="checkbox" 
                id={`habit-${habit.id}`} 
                checked={isCheckedToday(habit)} 
                onChange={() => toggleHabitCompletion(habit.id)} 
                className="habit-checkbox"
              />
              <label htmlFor={`habit-${habit.id}`} className="habit-label">
                {habit.name}
              </label>
              <span className="completion-count"> 
                {habit.completedDates.length}回
              </span>
              <button 
                className='delete-button' 
                onClick={() => deleteHabit(habit.id)}
                aria-label={`${habit.name}を削除`}
              >
                削除
              </button>
            </div>
          ))
        )}
      </main>

      {/* フッター */}
      <footer className="app-footer">
        <p>継続は力なり 💪</p>
      </footer>
    </div>
  );
}

export default App;
