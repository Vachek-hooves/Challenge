import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/context';
import LinearGradient from 'react-native-linear-gradient';

const ResultButton = ({ onPress, colors, children }) => (
  <View style={styles.resultButtonShadow}>
    <TouchableOpacity onPress={onPress} style={styles.resultButtonTouch}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.resultButtonGradient}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

const StackQuizScreen = ({ route, navigation }) => {
  const { quizType, quizName } = route.params;
  const { getQuizByType } = useStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const quizData = getQuizByType(quizType);
    setQuestions(quizData);
  }, [quizType]);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentQuestionIndex]);

  const handleSelectOption = (option) => {
    if (!showAnswer) {
      const currentQuestion = questions[currentQuestionIndex];
      setSelectedAnswer(option);
      setShowAnswer(true);
      
      const isCorrect = option === currentQuestion.correctOption;
      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      }

      setTimeout(() => {
        fadeOut(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
          } else {
            setShowResult(true);
          }
        });
      }, 1500);
    }
  };

  const getOptionStyle = (option) => {
    if (!showAnswer) {
      return selectedAnswer === option ? styles.selectedOption : null;
    }
    
    if (option === questions[currentQuestionIndex].correctOption) {
      return styles.correctOption;
    }
    
    if (selectedAnswer === option && option !== questions[currentQuestionIndex].correctOption) {
      return styles.incorrectOption;
    }
    
    return styles.disabledOption;
  };

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

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  if (!questions.length || !questions[currentQuestionIndex]) {
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
            <ResultButton
              onPress={restartQuiz}
              colors={['#00b09b', '#96c93d']}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </ResultButton>
            
            <ResultButton
              onPress={() => navigation.goBack()}
              colors={['#FF512F', '#DD2476']}
            >
              <Text style={styles.buttonText}>Back to Spinner</Text>
            </ResultButton>
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
            <OptionButton
              key={index}
              option={option}
              index={index}
              onPress={() => handleSelectOption(option)}
              disabled={showAnswer}
              style={[getOptionStyle(option)]}
            />
          ))}
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const OptionButton = ({ option, index, onPress, style, disabled }) => {
  
  return (
    <View style={[styles.shadowContainer, style]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={styles.touchableWrapper}
      >
        <LinearGradient
          colors={getOptionColors(index)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.option}
        >
          <Text style={styles.optionText}>
            {String.fromCharCode(65 + index)}. {option}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const getOptionColors = (index) => {
  const colorSets = [
    ['#FF512F', '#DD2476'], // Red-Pink
    ['#4776E6', '#8E54E9'], // Blue-Purple
    ['#00b09b', '#96c93d'], // Green
    ['#f12711', '#f5af19'], // Orange
  ];
  return colorSets[index % colorSets.length];
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
    marginTop: 20,
  },
  shadowContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  touchableWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  option: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'transparent',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  resultScore: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  resultPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 25,
    minWidth: 220,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loading: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  selectedOption: {
    borderColor: '#fff',
  },
  correctOption: {
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  incorrectOption: {
    borderColor: '#FF5252',
    borderWidth: 3,
  },
  disabledOption: {
    opacity: 0.6,
  },
  resultButtonShadow: {
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginVertical: 8,
  },
  resultButtonTouch: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  resultButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 35,
    minWidth: 220,
    alignItems: 'center',
  },
});

export default StackQuizScreen;