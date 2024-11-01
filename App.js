import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {StoreProvider} from './store/context';
import {TabUserProfile, TabChooseQuiz} from './screen/tabScreens';
import {StackWelcomeScreen, StackChallengeChoose, StackQuizScreen} from './screen/stackScreens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="TabUserProfile" component={TabUserProfile} />
      <Tab.Screen name="TabChooseQuiz" component={TabChooseQuiz} />
    </Tab.Navigator>
  );
};

function App() {
  return (
    <StoreProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 1000,
          }}>
          <Stack.Screen
            name="StackWelcomeScreen"
            component={StackWelcomeScreen}
          />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen
            name="StackChallengeChoose"
            component={StackChallengeChoose}
          />
          <Stack.Screen name="StackQuizScreen" component={StackQuizScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
}

export default App;
