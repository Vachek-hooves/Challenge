import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'

const StackChallengeChoose = ({ navigation }) => {
  const quizOptions = ['Math Quiz', 'Science Quiz', 'History Quiz', 'Geography Quiz'];
  const [isDropping, setIsDropping] = useState(false);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);
  
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  // Configure peg layout
  const ROWS = 5;
  const PEGS_PER_ROW = 5;
  const PEG_SPACING = screenWidth / (PEGS_PER_ROW + 1);
  const ROW_SPACING = (screenHeight - 80) / (ROWS + 1); // -250 to leave space for top and bottom

  // Generate peg positions
  const pegPositions = [];
  for (let row = 0; row < ROWS; row++) {
    const isOffset = row % 2 === 1;
    for (let peg = 0; peg < (isOffset ? PEGS_PER_ROW - 1 : PEGS_PER_ROW); peg++) {
      pegPositions.push({
        x: PEG_SPACING * (isOffset ? peg + 1.5 : peg + 1),
        y: ROW_SPACING * (row + 1),
      });
    }
  }

  const ballPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const dropBall = () => {
    if (isDropping) return;
    
    setIsDropping(true);
    
    const startX = screenWidth / 2 - 10;
    let currentX = startX;
    let currentY = 0;
    
    // Reset ball position
    ballPosition.setValue({ x: currentX, y: currentY });
    
    // Choose random target index and store it
    const targetIndex = Math.floor(Math.random() * 4);
    setSelectedQuizIndex(targetIndex);
    
    // Calculate target X position based on index
    const quizWidth = screenWidth / 4;
    const targetX = (quizWidth * targetIndex) + (quizWidth / 2) - 10;
    
    const animations = [];
    const numberOfBounces = ROWS + 2;
    
    for (let i = 0; i < numberOfBounces; i++) {
      const progress = i / numberOfBounces;
      
      const bias = (targetX - currentX) * progress * 0.2;
      const randomFactor = (1 - progress) * PEG_SPACING * 0.8;
      const nextX = currentX + bias + (Math.random() - 0.5) * randomFactor;
      const nextY = (i + 1) * (screenHeight - 200) / numberOfBounces;
      
      animations.push(
        Animated.parallel([
          Animated.timing(ballPosition.x, {
            toValue: Math.max(PEG_SPACING, Math.min(screenWidth - PEG_SPACING, nextX)),
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(ballPosition.y, {
            toValue: nextY,
            duration: 400,
            useNativeDriver: true,
          })
        ])
      );
      
      currentX = nextX;
      currentY = nextY;
    }
    
    // Final snap animation
    animations.push(
      Animated.parallel([
        Animated.timing(ballPosition.x, {
          toValue: targetX,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(ballPosition.y, {
          toValue: screenHeight - 100,
          duration: 200,
          useNativeDriver: true,
        })
      ])
    );
    
    Animated.sequence(animations).start(() => {
      setIsDropping(false);
      
      console.log({
        finalX: targetX,
        screenWidth,
        finalQuizIndex: targetIndex,
        selectedQuiz: quizOptions[targetIndex],
        allQuizzes: quizOptions
      });
      
      alert(`Selected: ${quizOptions[targetIndex]}`);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={dropBall} style={styles.dropButton}>
        <Text>Drop Ball</Text>
      </TouchableOpacity>

      {pegPositions.map((peg, index) => (
        <View
          key={index}
          style={[
            styles.peg,
            {
              left: peg.x,
              top: peg.y,
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.ball,
          {
            transform: [
              { translateX: ballPosition.x },
              { translateY: ballPosition.y },
            ],
          },
        ]}
      />

      <View style={styles.quizContainer}>
        {quizOptions.map((quiz, index) => (
          <View 
            key={index} 
            style={[
              styles.quizOption,
              selectedQuizIndex === index && styles.selectedQuiz
            ]}
          >
            <Text>{quiz}</Text>
            <Text style={{fontSize: 10}}>{index}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dropButton: {
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginTop: 80,
    zIndex: 1,

  },
  peg: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#666',
    borderRadius: 3,
    zIndex: 1,
  },
  ball: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    position: 'absolute',
    zIndex: 2,
  },
  quizContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    width: '100%',
    justifyContent: 'space-around',
    zIndex: 1,
  },
  quizOption: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    alignItems: 'center',
    width: '22%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedQuiz: {
    borderColor: 'green',
    borderWidth: 2,
  },
});

export default StackChallengeChoose