import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {StoreProvider} from './store/context';
import {
  TabUserProfile,
  TabChooseQuiz,
  TabSpinnerQuiz,
  TabScoreScreen,
  TabTrueGame,
} from './screen/tabScreens';
import {
  StackWelcomeScreen,
  StackChallengeChoose,
  StackQuizScreen,
  StackTrueGame,
} from './screen/stackScreens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {View, TouchableOpacity, Image, AppState, Text} from 'react-native';
import {useState, useEffect} from 'react';
import {
  toggleBackgroundMusic,
  setupPlayer,
  pauseBackgroundMusic,
  playBackgroundMusic,
} from './components/sound/setPlayer';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const TabNavigator = () => {
  const [isPlayMusic, setIsPlayMusic] = useState(true);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && isPlayMusic) {
        playBackgroundMusic();
      } else if (nextAppState === 'inactive' || nextAppState === 'background') {
        pauseBackgroundMusic();
      }
    });
    const initMusic = async () => {
      await setupPlayer();
      await playBackgroundMusic();
      setIsPlayMusic(true);
    };
    initMusic();

    return () => {
      subscription.remove();
      pauseBackgroundMusic();
    };
  }, []);

  const handlePlayMusicToggle = () => {
    const newState = toggleBackgroundMusic();
    setIsPlayMusic(newState);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 100,
          position: 'absolute',
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 15,
          backgroundColor: '#1a2a6c',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          paddingBottom: 10,
        },
        tabBarItemStyle: {
          // marginTop: 5,
          // marginBottom: 5,
        },
        tabBarActiveTintColor: '#fdbb2d',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="TabUserProfile"
        component={TabUserProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: focused
                  ? 'rgba(253, 187, 45, 0.2)'
                  : 'transparent',
              }}>
              <Icon name="account" size={40} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TabSpinnerQuiz"
        component={TabSpinnerQuiz}
        options={{
          tabBarLabel: 'Quiz',
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: focused
                  ? 'rgba(253, 187, 45, 0.2)'
                  : 'transparent',
              }}>
              <Icon name="rotate-3d-variant" size={40} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TabTrueGame"
        component={TabTrueGame}
        options={{
          tabBarLabel: 'True/False',
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: focused
                  ? 'rgba(253, 187, 45, 0.2)'
                  : 'transparent',
              }}>
              <Icon name="check-circle-outline" size={40} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TabScoreScreen"
        component={TabScoreScreen}
        options={{
          tabBarLabel: 'Scores',
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: focused
                  ? 'rgba(253, 187, 45, 0.2)'
                  : 'transparent',
              }}>
              <Icon name="trophy" size={40} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name=" "
        component={EmptyComponent}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            // <View
            //   style={{
            //     padding: 8,
            //     borderRadius: 20,
            //     backgroundColor: focused
            //       ? 'rgba(253, 187, 45, 0.2)'
            //       : 'transparent',
            //   }}>
              <TouchableOpacity onPress={handlePlayMusicToggle}>
                <Image
                  source={require('./assets/icons/maracas.png')}
                  style={{
                    width: 40,
                    height: 40,
                    tintColor: isPlayMusic ? '#fdbb2d' : 'rgba(255, 255, 255, 0.6)',
                  }}
                />
              </TouchableOpacity>
            // </View>
          ),
          tabBarLabel: 'Music',
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '500',
            color: isPlayMusic ? '#fdbb2d' : 'rgba(255, 255, 255, 0.6)',
          },
        }}
        listeners={{tabPress: e => e.preventDefault()}}
      />
    </Tab.Navigator>
  );
};
const EmptyComponent = () => null;

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
          <Stack.Screen name="StackTrueGame" component={StackTrueGame} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
}

export default App;
