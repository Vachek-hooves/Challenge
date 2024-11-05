import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

const StackTrueGame = () => {
  const route = useRoute();
  const { quizType, questions } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{quizType}</Text>
      <Text>Number of questions: {questions.length}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
})

export default StackTrueGame