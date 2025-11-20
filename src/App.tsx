import React, { useState, useEffect } from 'react';
import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { ulid } from 'ulid';
import { get } from 'http';


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

// LocalStorageのキー名を定数で管理
const STORAGE_KEY = 'habit-tracker-data';

function App() {
  // ==================== State管理 ====================

  // ローカルストレージから習慣データを読み込む関数
  const loadHabitsFromStorage = (): Habit[] => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData) as Habit[];
      }
    }
    catch (error) {
      console.error('ローカルストレージからの読み込みに失敗しました:', error);
    }

    // 何もデータがない場合は初期値を返す
    return [
      { id: ulid(), name: '30分プログラミング', completedDates: [] },
      { id: ulid(), name: '読書する', completedDates: [] },
      { id: ulid(), name: '運動する', completedDates: [] }
    ]
  }

  // 習慣のリスト
  const [habits, setHabits] = useState<Habit[]>([
    ...loadHabitsFromStorage()]);
  
  // 入力フォームの値を管理
  const [newHabitName, setNewHabitName] = useState<string>('');

  // カレンダーのセルにホバーしたときの情報を管理
  const [hoveredCell, setHoveredCell] = useState<{ habitId: string; date: string } | null>(null);

  // 表示する日数を切り替えるstateの管理
  const [displayDays, setDisplayDays] = useState<number>(7); // 7日間表示がデフォルト

  // 習慣データが変更されるたびにローカルストレージに保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
      console.log('習慣データをローカルストレージに保存しました:', habits);
    } catch (error) {
      console.error('ローカルストレージへの保存に失敗しました:', error);
    }
  }, [habits]);

  /**
   * LocalStorageのデータをクリアする関数
   * 開発中のテスト用
   */
  const clearStorage = () => {
    if (window.confirm('すべてのデータを削除しますか？')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  // 現在の使用量を確認（デバッグ用）
  const checkStorageSize = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const sizeInBytes = new Blob([data]).size;
      return sizeInBytes;
    }
    return 0;
  };

  // ==================== 日付関連 ====================

  // 今日の日付を取得
  const today = new Date();
  const dateString = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  // 今日の日付をYYYY-MM-DD形式で取得
  const getTodayString = (): string => {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 今日の日付文字列
  const todayString = getTodayString();


   /**
   * 日付をYYYY-MM-DD形式にフォーマット
   */
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * 過去N日分の日付配列を生成（新規追加）
   * @param days - 日数（デフォルト: 7日）
   * @returns 日付の配列（古い順）
   */
  const getLastNDays = (days: number = 7): string[] => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i)); // 古い日付から順に
      return formatDate(date);
    });
  };

  /**
   * 日付文字列から曜日を取得
   * @param dateStr - YYYY-MM-DD形式の日付文字列
   * @returns 曜日（日〜土）
   */
  const getDayOfWeek = (dateStr: string): string => {
    const date = new Date(dateStr);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[date.getDay()];
  };

  /**
   * 日付文字列から「月/日」形式に変換
   * @param dateStr - YYYY-MM-DD形式の日付文字列
   * @returns 月/日形式の文字列
   */
  const getMonthDay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 曜日が土日の場合trueを返す
  const isWeekend = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day === 0 || day === 6; // 日曜日(0)または土曜日(6)
  };

    /**
   * 日付を読みやすい形式に変換
   * @param dateStr - YYYY-MM-DD形式
   * @returns 例: "11月14日(木)"
   */
  const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = getDayOfWeek(dateStr);
    return `${month}月${day}日(${dayOfWeek})`;
  };


  // 過去7日分の日付を取得
  const last7Days = getLastNDays(7);

  // 過去30日分の日付を取得
  const last30Days = getLastNDays(30);

  // 表示する日付配列を取得
  const displayDates = getLastNDays(displayDays);

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
   * 指定した習慣が特定の日付に完了しているか確認
   * @param habit 確認する習慣 
   * @param date 確認する日付（YYYY-MM-DD形式）
   * @returns 指定した日付に完了していればtrue
   */
  const isCheckedOnDate = (habit: Habit, date: string): boolean => {
    return habit.completedDates.includes(date);
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
   * 指定した日付のチェック状態を切り替え
   */
  const toggleCheckOnDate = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) {
        return habit;
      }

      const isCompleted = habit.completedDates.includes(date);

      if (isCompleted) {
        // チェックを外す
        return {
          ...habit,
          completedDates: habit.completedDates.filter(d => d !== date)
        };
      } else {
        // チェックを入れる
        return {
          ...habit,
          completedDates: [...habit.completedDates, date]
        };
      }
    }));
  };

  /**
   * IDから習慣を取得
   */
  const getHabitById = (id: string): Habit | undefined => {
    return habits.find(habit => habit.id === id);
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

      {/* カレンダーヘッダー */}
      <div className="calendar-section">
        <div className="calendar-header-controls" >
          <h2>📅 過去7の記録</h2>
          <div className="date-range-buttons">
            <button
              className={`date-range-button ${displayDays === 7 ? 'active' : ''}`}
              onClick={() => setDisplayDays(7)}
            >
              7日間
            </button>
            <button
              className={`date-range-button ${displayDays === 30 ? 'active' : ''}`}
              onClick={() => setDisplayDays(30)}
            >
              30日間
            </button>
          </div>
        </div>

        {/* ツールチップ表示 */}
        {hoveredCell && (
          <div className="calendar-tooltip">
            {getHabitById(hoveredCell.habitId)?.name} - {formatDateForDisplay(hoveredCell.date)}
            <br />
            <span className="tooltip-hint">
              {isCheckedOnDate(getHabitById(hoveredCell.habitId)!, hoveredCell.date) 
                ? 'クリックでチェックを外す' 
                : 'クリックでチェックを入れる'}
            </span>
          </div>
        )}

        {/* 日付ヘッダー */}
        <div className="calendar-header">
          <div className="habit-name-column">習慣</div>
          {displayDates.map(date => (
            <div 
              key={date} 
              className={`date-column ${date === todayString ? 'today' : ''} ${isWeekend(date) ? 'weekend' : ''}`}
            >
            <div className="date-month-day">{getMonthDay(date)}</div>
              <div className="date-day-of-week">{getDayOfWeek(date)}</div>
            </div>
          ))}
        </div>        
      </div>
      {/* カレンダーグリッド */}
      <div className="calendar-grid">
        {habits.length === 0 ? (
            <div className="calendar-empty">
              習慣を追加すると、ここにカレンダーが表示されます
            </div>
          ) : (habits.map(habit => (
          <div key={habit.id} className="calendar-row">
            <div className="habit-name-column">
              {habit.name}
            </div>
            {displayDates.map(date => (
              <div 
                key={date} 
                className={`calendar-cell ${habit.completedDates.includes(date) ? 'completed' : ''}  ${date === todayString ? 'today' : ''} ${isWeekend(date) ? 'weekend' : ''}`}
                onClick={() => toggleCheckOnDate(habit.id, date)}
                onMouseEnter={() => setHoveredCell({ habitId: habit.id, date })}
                onMouseLeave={() => setHoveredCell(null)}
                role="button"
                aria-label={`${habit.name} - ${formatDateForDisplay(date)} - ${isCheckedOnDate(habit, date) ? '完了済み' : '未完了'}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleCheckOnDate(habit.id, date);
              }
                }}
                title={`${habit.name} - ${getMonthDay(date)}`}
              >
                {habit.completedDates.includes(date) ? '✔️' : ''}
              </div>
            ))}
          </div>
        )))}

        {/* カレンダーの統計情報 */}
        {habits.length > 0 && (
          <div className="calendar-stats">
            <div className="stat-item">
              <span className="stat-label">期間中の合計達成:</span>
              <span className="stat-value">
                {habits.reduce((sum, habit) => 
                  sum + habit.completedDates.filter(date => displayDates.includes(date)).length, 0
                )}回
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">平均達成率:</span>
              <span className="stat-value">
                {habits.length > 0 
                  ? ((habits.reduce((sum, habit) => 
                      sum + habit.completedDates.filter(date => displayDates.includes(date)).length, 0
                    ) / (habits.length * displayDates.length) * 100).toFixed(1))
                  : 0}%
              </span>
            </div>
          </div>
        )}
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

        {/* デバッグ用ボタン（本番では削除推奨） */}
        <div>
          <label>LocalStorage使用量:{checkStorageSize()}バイト</label>
          <button onClick={clearStorage} className="clear-button">
            データをリセット
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
