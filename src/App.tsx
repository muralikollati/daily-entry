
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './contexts/AuthProvider';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { RootStackParamList } from './types/navigation';
import EntryDetails from './components/EntryDetails';
import AddEntryScreen from './components/AddEntryScreen';
import Toast from 'react-native-toast-message';
import { toastConfig } from './toast/toastConfig';
import './i18n';
import SignupScreen from './screens/SignUpScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }: { route: any }) => ({
      // headerShown: false,
      headerStyle:{
        // backgroundColor: '#6200EE',
      },
      tabBarActiveTintColor: '#6200EE',
      tabBarStyle: {
        // paddingTop: 20,
        // marginBottom: 20,
      },
      tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
        let iconName: string = '';
        let iconSize: number = size;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Add Entry') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
          iconSize = size; // Increase size for AddEntry
        }else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        
        return <Ionicons name={iconName} size={iconSize} color={focused ? "#6200EE" : color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Add Entry" component={AddEntryScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading, token } = useAuth();

  if (loading) return null; // Show splash or loading indicator if needed

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{}}>
          {user ? (
            <>
              {/* TabNavigator is the main navigator after login */}
              <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="Detail" component={EntryDetails} />
            </>
          ) : (
            <>
              {/* Show login/signup screens if not logged in */}
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SignUp" component={SignupScreen} options={{ headerShown: false }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {AuthProvider, useAuth} from './contexts/AuthProvider';
// import HomeScreen from './screens/HomeScreen';
// import LoginScreen from './screens/LoginScreen';
// import {RootStackParamList} from './types/navigation';
// import EntryDetails from './components/EntryDetails';
// import AddEntryScreen from './components/AddEntryScreen';
// import Toast from 'react-native-toast-message';
// import {toastConfig} from './toast/toastConfig';
// import './i18n';
// import SignupScreen from './screens/SignUpScreen';

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const AppNavigator = () => {
//   const {user, loading, token} = useAuth();

//   if (loading) return null; // Show splash or loading indicator if needed

//   return (
//     <>
//       <NavigationContainer>
//         <Stack.Navigator screenOptions={{}}>
//           {user ? (
//             <>
//               <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
//               <Stack.Screen name="Detail" component={EntryDetails} />
//               <Stack.Screen name="AddEntry" component={AddEntryScreen} />
//             </>
//           ) : (
//             <>
//               <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//               <Stack.Screen name="SignUp" component={SignupScreen} options={{ headerShown: false }}/>
//             </>
//           )}
//         </Stack.Navigator>
//       </NavigationContainer>
//       <Toast config={toastConfig} />
//     </>
//   );
// };

// export default function App() {
//   return (
//     <AuthProvider>
//       <AppNavigator />
//     </AuthProvider>
//   );
// }
