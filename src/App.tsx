import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AuthProvider, useAuth} from './contexts/AuthProvider';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import {RootStackParamList} from './types/navigation';
import EntryDetails from './components/EntryDetails';
import AddEntryScreen from './components/AddEntryScreen';
import Toast from 'react-native-toast-message';
import {toastConfig} from './toast/toastConfig';
import './i18n';
import SignupScreen from './screens/SignUpScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './screens/ProfileScreen';
import BootSplash from 'react-native-bootsplash';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({route}: {route: any}) => ({
      headerShown: route.name === 'Home' ? false : true,
      headerStyle: {
        // backgroundColor: '#6200EE',
      },
      tabBarActiveTintColor: '#6200EE',
      // tabBarStyle: {
      //   height: 60,

      //   // paddingTop: 10,
      //   // marginBottom: 20,
      // },
      // tabBarItemStyle: {
      //   display: 'flex',
      //   // alignItems: 'center',
      //   // alignContent:"center",
      //   // justifyContent: 'flex-start',
      //   // paddingBottom: 40,
      // },
      // tabBarLabelStyle: {
      //   display: route.name === 'Add Entry' ? 'none' : 'none',
      // },
      // tabBarIconStyle: {
      //   height: 50,
      //   width: 50,
      //   marginTop: route.name === 'Add Entry' ? 0 : 0,
      // },
      tabBarIcon: ({
        focused,
        color,
        size,
      }: {
        focused: boolean;
        color: string;
        size: number;
      }) => {
        let iconName: string = '';
        let iconSize: number = size;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Add Entry') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
          iconSize = size + 5;
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return (
          <Ionicons
            name={iconName}
            size={iconSize}
            color={focused ? '#6200EE' : color}
          />
        );
      },
    })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Add Entry" component={AddEntryScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const {user, loading} = useAuth();

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
      console.log('BootSplash has been hidden successfully');
    });
  }, []);

  if (loading) return null; // Show splash or loading indicator if needed

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{}}>
          {user ? (
            <>
              {/* TabNavigator is the main navigator after login */}
              <Stack.Screen
                name="Home"
                component={TabNavigator}
                options={{headerShown: false}}
              />
              <Stack.Screen name="Detail" component={EntryDetails} />
            </>
          ) : (
            <>
              {/* Show login/signup screens if not logged in */}
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUp"
                component={SignupScreen}
                options={{headerShown: false}}
              />
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
