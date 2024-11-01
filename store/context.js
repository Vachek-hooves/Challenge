import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HISTORY_QUIZ, SPORT_QUIZ, CAPITALS_QUIZ, FILM_QUIZ } from '../data/quizData';

const StoreContext = createContext();

const STORAGE_KEYS = {
  HISTORY: 'history_quiz',
  SPORT: 'sport_quiz',
  CAPITALS: 'capitals_quiz',
  FILM: 'film_quiz'
};

export function StoreProvider({ children }) {
  const [historyQuiz, setHistoryQuiz] = useState([]);
  const [sportQuiz, setSportQuiz] = useState([]);
  const [capitalsQuiz, setCapitalsQuiz] = useState([]);
  const [filmQuiz, setFilmQuiz] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize quizzes from AsyncStorage or default data
  useEffect(() => {
    const initializeQuizzes = async () => {
      try {
        // Try to get quizzes from AsyncStorage
        const storedHistory = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
        const storedSport = await AsyncStorage.getItem(STORAGE_KEYS.SPORT);
        const storedCapitals = await AsyncStorage.getItem(STORAGE_KEYS.CAPITALS);
        const storedFilm = await AsyncStorage.getItem(STORAGE_KEYS.FILM);

        // Set history quiz
        if (storedHistory) {
          setHistoryQuiz(JSON.parse(storedHistory));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(HISTORY_QUIZ));
          setHistoryQuiz(HISTORY_QUIZ);
        }

        // Set sport quiz
        if (storedSport) {
          setSportQuiz(JSON.parse(storedSport));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.SPORT, JSON.stringify(SPORT_QUIZ));
          setSportQuiz(SPORT_QUIZ);
        }

        // Set capitals quiz
        if (storedCapitals) {
          setCapitalsQuiz(JSON.parse(storedCapitals));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.CAPITALS, JSON.stringify(CAPITALS_QUIZ));
          setCapitalsQuiz(CAPITALS_QUIZ);
        }

        // Set film quiz
        if (storedFilm) {
          setFilmQuiz(JSON.parse(storedFilm));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.FILM, JSON.stringify(FILM_QUIZ));
          setFilmQuiz(FILM_QUIZ);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing quizzes:', error);
        setIsLoading(false);
      }
    };

    initializeQuizzes();
  }, []);

  // Update quiz data in AsyncStorage
  const updateQuiz = async (quizType, newData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS[quizType], JSON.stringify(newData));
      switch (quizType) {
        case 'HISTORY':
          setHistoryQuiz(newData);
          break;
        case 'SPORT':
          setSportQuiz(newData);
          break;
        case 'CAPITALS':
          setCapitalsQuiz(newData);
          break;
        case 'FILM':
          setFilmQuiz(newData);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  // Get quiz data by type
  const getQuizByType = (type) => {
    switch (type) {
      case 'HISTORY':
        return historyQuiz;
      case 'SPORT':
        return sportQuiz;
      case 'CAPITALS':
        return capitalsQuiz;
      case 'FILM':
        return filmQuiz;
      default:
        return [];
    }
  };

  const storeValue = {
    historyQuiz,
    sportQuiz,
    capitalsQuiz,
    filmQuiz,
    isLoading,
    updateQuiz,
    getQuizByType,
  };

  return (
    <StoreContext.Provider value={storeValue}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
