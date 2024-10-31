import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'

const StackChallengeChoose = ({ navigation }) => {
  const [isDropping, setIsDropping] = useState(false);
  const ballPosition = useRef(new Animated.ValueXY()).current;
  
  const screenWidth = Dimensions.get('window').width;
  const quizOptions = ['Math Quiz', 'Science Quiz', 'History Quiz', 'Geography Quiz'];
  
  const dropBall = () => {
    if (isDropping) return;
    
    setIsDropping(true);
    const finalX = screenWidth * (0.1 + Math.random() * 0.8); // Random X position
    
    Animated.sequence([
      Animated.timing(ballPosition.y, {
        toValue: 500, // Adjust this value based on your screen
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsDropping(false);
      // Find which quiz was selected based on finalX position
      const quizIndex = Math.floor((finalX / screenWidth) * 4);
      // Here you can navigate to the selected quiz
      alert(`Selected: ${quizOptions[quizIndex]}`);
    });

    Animated.timing(ballPosition.x, {
      toValue: finalX,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={dropBall} style={styles.dropButton}>
        <Text>Drop Ball</Text>
      </TouchableOpacity>

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
    marginTop: 50,
  },
  ball: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    position: 'absolute',
    top: 100,
  },
  quizContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    width: '100%',
    justifyContent: 'space-around',
  },
  quizOption: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    alignItems: 'center',
    width: '22%',
  },
});

export default StackChallengeChoose