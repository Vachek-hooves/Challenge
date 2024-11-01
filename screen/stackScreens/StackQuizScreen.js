import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/context';
import LinearGradient from 'react-native-linear-gradient';

const StackQuizScreen = ({ route, navigation }) => {
  const { quizType, quizName } = route.params;
  const { getQuizByType } = useStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const quizData = getQuizByType(quizType);
    setQuestions(quizData);
  }, [quizType]);

  const fadeOut = (callback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAnswer = (selectedAnswer) => {
    fadeOut(() => {
      if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
        setScore(prev => prev + 1);
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    });
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
  };

  if (!questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading quiz...</Text>
      </View>
    );
  }

  if (showResult) {
    return (
      <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        style={styles.container}
      >
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.resultScore}>
            Your Score: {score}/{questions.length}
          </Text>
          <Text style={styles.resultPercentage}>
            {Math.round((score / questions.length) * 100)}%
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={restartQuiz}>
              <LinearGradient
                colors={['#00b09b', '#96c93d']}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <LinearGradient
                colors={['#FF512F', '#DD2476']}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Back to Spinner</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.quizName}>{quizName}</Text>
        <Text style={styles.progress}>
          Question {currentQuestionIndex + 1}/{questions.length}
        </Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.question}>
          {questions[currentQuestionIndex].question}
        </Text>

        <View style={styles.optionsContainer}>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswer(option)}
              style={styles.optionWrapper}
            >
              <LinearGradient
                colors={['#4776E6', '#8E54E9']}
                style={styles.option}
              >
                <Text style={styles.optionText}>{option}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  quizName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  progress: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  score: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  question: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 10,
  },
  optionWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  option: {
    padding: 15,
    borderRadius: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },
  resultPercentage: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loading: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
});

export default StackQuizScreen;