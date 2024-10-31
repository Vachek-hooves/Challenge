import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'

const StackChallengeChoose = ({ navigation }) => {
  const [isDropping, setIsDropping] = useState(false);
  const ballPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const quizOptions = ['Math Quiz', 'Science Quiz', 'History Quiz', 'Geography Quiz'];
  
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

  const dropBall = () => {
    if (isDropping) return;
    
    setIsDropping(true);
    const startX = screenWidth / 2 - 10;
    let currentX = startX;
    let currentY = 0;
    
    // Reset ball position
    ballPosition.setValue({ x: currentX, y: currentY });
    
    // Calculate final positions for each quiz option
    const quizWidths = screenWidth / 4;
    const finalPositions = quizOptions.map((_, index) => 
      quizWidths * index + (quizWidths / 2) - 10 // -10 to center ball
    );
    
    // Create bounce animations
    const animations = [];
    const numberOfBounces = ROWS + 2; // Match number of bounces to rows of pegs
    
    for (let i = 0; i < numberOfBounces; i++) {
      // Calculate next position based on current position and nearby pegs
      const rowIndex = Math.floor(i / 2);
      const isOffset = rowIndex % 2 === 1;
      
      // Make the ball more likely to bounce towards a final position
      const progress = i / numberOfBounces;
      const nearestFinal = finalPositions.reduce((prev, curr) => 
        Math.abs(curr - currentX) < Math.abs(prev - currentX) ? curr : prev
      );
      
      // Bias the random movement towards the nearest final position
      const bias = (nearestFinal - currentX) * progress * 0.3;
      const nextX = currentX + bias + (Math.random() - 0.5) * PEG_SPACING * (1 - progress);
      const nextY = (i + 1) * (screenHeight - 200) / numberOfBounces;
      
      animations.push(
        Animated.parallel([
          Animated.timing(ballPosition.x, {
            toValue: nextX,
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
    
    // Final animation to snap to nearest quiz option
    const finalX = finalPositions.reduce((prev, curr) => 
      Math.abs(curr - currentX) < Math.abs(prev - currentX) ? curr : prev
    );
    
    animations.push(
      Animated.parallel([
        Animated.timing(ballPosition.x, {
          toValue: finalX,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(ballPosition.y, {
          toValue: screenHeight - 100, // Position just above quiz options
          duration: 200,
          useNativeDriver: true,
        })
      ])
    );
    
    Animated.sequence(animations).start(() => {
      setIsDropping(false);
      const quizIndex = Math.floor((finalX + 10) / (screenWidth / 4));
      alert(`Selected: ${quizOptions[quizIndex]}`);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={dropBall} style={styles.dropButton}>
        <Text>Drop Ball</Text>
      </TouchableOpacity>

      {/* Render pegs */}
      {pegPositions.map((peg, index) => (
        <View
          key={index}
          style={[
            styles.peg,
            {
              left: peg.x, // Center the peg
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
          <View key={index} style={styles.quizOption}>
            <Text>{quiz}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

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
});

export default StackChallengeChoose